import NextError from 'next/error';
import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { useCallback, useReducer } from 'react';

import { NewAssignmentMediumEditForm } from './NewAssignmentMediumEditForm';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useMediumDelete } from './useMediumDelete';
import { useMediumSave } from './useMediumSave';
import { Audio } from '@/components/Audio';
import { FileIcon } from '@/components/FileIcon';
import { Section } from '@/components/Section';
import { Video } from '@/components/Video';
import { useAdminServices } from '@/hooks/useAdminServices';
import { endpoint } from 'src/basePath';
import { formatDateTime } from 'src/formatDate';
import { humanReadableFileSize } from 'src/humanReadableFilesize';

type Props = {
  administratorId: number;
  mediumId: string;
};

export const NewAssignmentMediumEdit: FC<Props> = ({ administratorId, mediumId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const { newAssignmentMediumService } = useAdminServices();

  useInitialData(dispatch, administratorId, mediumId);

  const mediumSave$ = useMediumSave(dispatch);
  const mediumDelete$ = useMediumDelete(dispatch);

  const handleCaptionChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'CAPTION_CHANGED', payload: e.target.value });
  }, []);

  const handleOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ORDER_CHANGED', payload: e.target.value });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newAssignmentMedium) {
    return null;
  }

  const src = `${endpoint}/administrators/${administratorId}/newAssignmentMedia/${state.newAssignmentMedium.assignmentMediumId}/file`;

  const handleDownloadClick: MouseEventHandler = e => {
    e.preventDefault();
    newAssignmentMediumService.downloadAssignmentMediumFile(administratorId, mediumId).subscribe();
  };

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Assignment Media</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewAssignmentMediumEditForm
                administratorId={administratorId}
                mediumId={mediumId}
                formState={state.form}
                save$={mediumSave$}
                delete$={mediumDelete$}
                onCaptionChange={handleCaptionChange}
                onOrderChange={handleOrderChange}
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
            <>
              <div>
                <Video src={src} className="mediaContent" controls preload="auto" playsInline />
              </div>
              <a href={src}>Download</a>
            </>
          )}
          {state.newAssignmentMedium.type === 'audio' && (
            <>
              <div>
                <Audio src={src} controls preload="auto" />
              </div>
              <a href={src}>Download</a>
            </>
          )}
          {state.newAssignmentMedium.type === 'download' && (
            <a onClick={handleDownloadClick} href={src} download><FileIcon mimeType={state.newAssignmentMedium.mimeTypeId} size={96} /></a>
          )}
        </div>
      </Section>
    </>
  );
};
