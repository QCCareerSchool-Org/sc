import NextError from 'next/error';
import type { ChangeEventHandler, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { NewAssignmentMediumEditForm } from './NewAssignmentMediumEditForm';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useMediumDelete } from './useMediumDelete';
import { useMediumSave } from './useMediumSave';
import { FileIcon } from '@/components/FileIcon';
import { Section } from '@/components/Section';
import { endpoint } from 'src/basePath';
import { formatDateTime } from 'src/formatDate';
import { humanReadableFileSize } from 'src/humanReadableFilesize';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  mediumId: string;
};

export const NewAssignmentMediumEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId, mediumId }: Props): ReactElement | null => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(administratorId, schoolId, courseId, unitId, assignmentId, mediumId, dispatch);

  const mediumSave$ = useMediumSave(dispatch);
  const mediumDelete$ = useMediumDelete(dispatch);

  const captionChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'CAPTION_CHANGED', payload: e.target.value });
  }, []);

  const orderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ORDER_CHANGED', payload: e.target.value });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newAssignmentMedium) {
    return null;
  }

  const src = `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/media/${state.newAssignmentMedium.assignmentMediumId}/file`;

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Assignment Media</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewAssignmentMediumEditForm
                administratorId={administratorId}
                schoolId={schoolId}
                courseId={courseId}
                unitId={unitId}
                assignmentId={assignmentId}
                mediumId={mediumId}
                formState={state.form}
                save$={mediumSave$}
                delete$={mediumDelete$}
                captionChange={captionChange}
                orderChange={orderChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto">
                  <tbody>
                    <tr><th scope="row">Assignment Template</th><td>{state.newAssignmentMedium.newAssignmentTemplate.title ?? state.newAssignmentMedium.newAssignmentTemplate.assignmentNumber}</td></tr>
                    <tr><th scope="row">Linked Assignments</th><td>{state.newAssignmentMedium.newAssignments.length}</td></tr>
                    <tr><th scope="row">Filename</th><td>{state.newAssignmentMedium.filename}</td></tr>
                    <tr><th scope="row">Type</th><td>{state.newAssignmentMedium.type}</td></tr>
                    <tr><th scope="row">Mime Type</th><td>{state.newAssignmentMedium.mimeTypeId}</td></tr>
                    <tr><th scope="row">Size</th><td>{humanReadableFileSize(state.newAssignmentMedium.filesize)}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newAssignmentMedium.created)}</td></tr>
                    {state.newAssignmentMedium.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newAssignmentMedium.modified)}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          {state.newAssignmentMedium.type === 'image' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} className="mediaContent" alt={state.newAssignmentMedium.caption} />
          )}
          {state.newAssignmentMedium.type === 'video' && (
            <video className="mediaContent" controls>
              <source src={src} type={state.newAssignmentMedium.mimeTypeId} />
            </video>
          )}
          {state.newAssignmentMedium.type === 'audio' && (
            <audio controls>
              <source src={src} type={state.newAssignmentMedium.mimeTypeId} />
            </audio>
          )}
          {state.newAssignmentMedium.type === 'download' && (
            <a href={src} download><FileIcon mimeType={state.newAssignmentMedium.mimeTypeId} size={96} /></a>
          )}
        </div>
      </Section>
    </>
  );
};
