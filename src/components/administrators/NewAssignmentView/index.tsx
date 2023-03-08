import type { FC, MouseEvent, MouseEventHandler } from 'react';
import { useCallback, useReducer } from 'react';

import { catchError, EMPTY } from 'rxjs';
import { NewPartView } from './NewPartView';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import type { InputType } from './useInputSave';
import { useInputSave } from './useInputSave';
import { NewAssignmentMediumView } from '@/components/administrators/NewAssignmentMediumView';
import { DownloadMedium } from '@/components/DownloadMedium';
import { Section } from '@/components/Section';
import { useAdminServices } from '@/hooks/useAdminServices';
import { useServices } from '@/hooks/useServices';
import { endpoint } from 'src/basePath';

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

  if (!state.newAssignment) {
    return null;
  }

  const handleUnmarkedIdClick = (e: MouseEvent, id: string): void => {
    //
  };

  const mark = state.newAssignment.markOverride ?? state.newAssignment.mark;

  return (
    <>
      <Section>
        <div className="container assignmentContainer">
          {state.newAssignment.optional && <span className="text-danger">OPTIONAL</span>}
          <h1>Assignment {state.newAssignment.assignmentNumber}{state.newAssignment.title && <>: {state.newAssignment.title}</>}</h1>
          {state.newAssignment.newSubmission.submitted && <p>Mark: {state.newAssignment.points === 0 ? 'N/A' : gradeService.calculate(mark, state.newAssignment.points, state.newAssignment.newSubmission.submitted) ?? 'No mark recorded'}</p>}
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
      <Section className="bg-dark text-light">
        <div className="container">
          {state.newAssignment.mark !== null && <p className="lead mb-0">All answers are marked!</p>}
          {state.newAssignment.mark === null && (
            <>
              <p className="lead mb-2">Some answers are not marked:</p>
              <ul className="ps-3 mb-0">
                {state.newAssignment.newParts.filter(p => p.mark === null).map(p => (
                  // we don't use an anchor link because we don't want the history to change
                  <li key={p.partId}>
                    <a onClick={e => handleUnmarkedIdClick(e, p.partId)} href={`#${p.partId}`} className="link-light text-decoration-none">{p.title}</a>
                    <ul>
                      {p.newTextBoxes.filter(t => t.mark === null).map((t, i) => (
                        <li key={t.textBoxId}><a onClick={e => handleUnmarkedIdClick(e, t.textBoxId)} href={`#${t.textBoxId}`} className="link-light text-decoration-none">Text Box: {t.description ?? `#${i + 1}`}</a></li>
                      ))}
                      {p.newUploadSlots.filter(u => u.mark === null).map(u => (
                        <li key={u.uploadSlotId}><a onClick={e => handleUnmarkedIdClick(e, u.uploadSlotId)} href={`#${u.uploadSlotId}`} className="link-light text-decoration-none">Upload Slot: {u.label}</a></li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Section>
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
