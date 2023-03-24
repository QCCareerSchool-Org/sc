import ErrorPage from 'next/error';
import type { FC, MouseEventHandler } from 'react';
import { useCallback, useReducer } from 'react';
import { catchError, EMPTY } from 'rxjs';

import { endpoint } from '../../../basePath';
import { formatDateTime } from '../../../formatDate';
import { NewPartView } from './NewPartView';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import type { InputType } from './useInputSave';
import { useInputSave } from './useInputSave';
import { NewAssignmentMediumView } from '@/components/administrators/NewAssignmentMediumView';
import { Description } from '@/components/Description';
import { DownloadMedium } from '@/components/DownloadMedium';
import { Section } from '@/components/Section';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useServices } from '@/hooks/useServices';

type Props = {
  administratorId: number;
  assignmentId: string;
};

export const NewAssignmentView: FC<Props> = ({ administratorId, assignmentId }) => {
  const { gradeService } = useServices();
  const { newAssignmentMediumService } = useAdminServices();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId, assignmentId);

  const inputSave$ = useInputSave(dispatch);

  const saveInput = useCallback((inputType: InputType, partId: string, id: string, markOverride: number | null): void => {
    inputSave$.next({ inputType, administratorId, partId, id, markOverride });
  }, [ inputSave$, administratorId ]);

  if (state.error) {
    return <ErrorPage statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newAssignment) {
    return null;
  }

  const submission = state.newAssignment.newSubmission;

  return (
    <>
      <Section>
        <div className="container assignmentContainer">
          <div className="row">
            <div className="col-12 col-lg-8">
              {state.newAssignment.optional && <span className="text-danger">OPTIONAL</span>}
              <h1>Assignment {state.newAssignment.assignmentNumber}{state.newAssignment.title && <>: {state.newAssignment.title}</>}</h1>
              {state.newAssignment.description && <Description description={state.newAssignment.description} descriptionType={state.newAssignment.descriptionType} />}

            </div>
            <div className="col-12 col-lg-4">
              <table className="table table-bordered w-auto bg-white ms-lg-auto">
                <tbody>
                  <tr><th scope="row">Created</th><td>{formatDateTime(submission.created)}</td></tr>
                  {submission.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(submission.modified)}</td></tr>}
                  {submission.submitted && <tr><th scope="row">{submission.skipped ? 'Skipped' : 'Submitted'}</th><td>{formatDateTime(submission.submitted)}</td></tr>}
                  {submission.transferred && <tr><th scope="row">Transferred</th><td>{formatDateTime(submission.transferred)}</td></tr>}
                  {submission.closed && <tr><th scope="row">Marked</th><td>{formatDateTime(submission.closed)}</td></tr>}
                  {submission.submitted && submission.closed && !submission.skipped && (
                    <>
                      {state.newAssignment.points > 0
                        ? (
                          <>
                            <tr><th scope="row">Mark</th><td>{state.newAssignment.mark ?? '--'} / {state.newAssignment.points}{state.newAssignment.mark !== null && <>&nbsp;&nbsp;({gradeService.calculate(state.newAssignment.mark, state.newAssignment.points, submission.submitted)})</>}</td></tr>
                            {state.newAssignment.markOverride !== null && <tr><th scope="row">Override</th><td>{state.newAssignment.markOverride} / {state.newAssignment.points}&nbsp;&nbsp;({gradeService.calculate(state.newAssignment.markOverride, state.newAssignment.points, submission.submitted)})</td></tr>}
                          </>
                        )
                        : <tr><th scope="row">Mark</th><td>N/A</td></tr>
                      }
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-10 col-xl-8">
              {state.newAssignment.newAssignmentMedia.filter(m => m.type !== 'download').map(m => (
                <figure key={m.assignmentMediumId} className={`figure ${m.type}Figure d-block`}>
                  <NewAssignmentMediumView className="figure-img mb-0 mw-100" administratorId={administratorId} newAssignmentMedium={m} />
                  <figcaption className="figure-caption">{m.caption}</figcaption>
                </figure>
              ))}
              {state.newAssignment.newAssignmentMedia.filter(m => m.type === 'download').map(m => {
                const href = `${endpoint}/administrators/${administratorId}/newAssignmentMedia/${m.assignmentMediumId}/file`;
                const handleDownloadClick: MouseEventHandler = e => {
                  e.preventDefault();
                  newAssignmentMediumService.downloadAssignmentMediumFile(administratorId, m.assignmentMediumId).pipe(
                    catchError(() => EMPTY),
                  ).subscribe();
                };
                return (
                  <div key={m.assignmentMediumId} className="downloadMedium">
                    <a href={href} download={m.filename} onClick={handleDownloadClick}>
                      <DownloadMedium medium={m} />
                    </a>
                  </div>
                );
              })}
              {state.newAssignment.markingCriteria && (
                <div className="alert alert-secondary">
                  <h3 className="h6">Assignment Marking Criteria</h3>
                  {state.newAssignment.markingCriteria.replace(/\r\n/gu, '\n').split('\n\n').map((m, i) => <p key={i}>{m}</p>)}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
      {state.newAssignment.newParts.map(p => <NewPartView key={p.partId} administratorId={administratorId} part={p} saveInput={saveInput} />)}
      <style jsx>{`
      .alert p:last-of-type { margin-bottom: 0; }
      .assignmentContainer *:last-child { margin-bottom: 0; }
      .downloadMedium {
        margin-bottom: 1rem;
      }
      .downloadMedium:last-of-type {
        margin-bottom: 0;
      }
      .downloadMedium a {
        text-decoration: none;
        color: inherit;
      }
      `}</style>
    </>
  );
};
