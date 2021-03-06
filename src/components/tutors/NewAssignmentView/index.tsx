import NextError from 'next/error';
import type { MouseEvent, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { endpoint } from '../../../basePath';
import { scrollToId } from '../../../scrollToId';
import { InaccessibleUnit } from '../InaccessibleUnit';
import { Medium } from './Medium';
import { Part } from './Part';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useInputSave } from './useInputSave';
import type { InputType } from './useInputSave';
import { Section } from '@/components/Section';

type Props = {
  tutorId: number;
  studentId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
};

export const NewAssignmentView = ({ tutorId, studentId, courseId, unitId, assignmentId }: Props): ReactElement | null => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(tutorId, studentId, courseId, unitId, assignmentId, dispatch);

  const inputSave$ = useInputSave(dispatch);

  const saveInput = useCallback((inputType: InputType, partId: string, id: string, mark: number | null, notes: string | null): void => {
    inputSave$.next({ inputType, tutorId, partId, id, mark, notes });
  }, [ inputSave$, tutorId ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newAssignment) {
    return null;
  }

  if (state.newAssignment.newUnit.tutorId !== tutorId && state.newAssignment.newUnit.enrollment.tutorId !== tutorId) {
    return <InaccessibleUnit reason="wrong tutor" />;
  }

  if (!state.newAssignment.newUnit.submitted) {
    return <InaccessibleUnit reason="not submitted" />;
  }

  const handleUnmarkedIdClick = (e: MouseEvent<HTMLAnchorElement>, id: string): void => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <>
      <Section>
        <div className="container assignmentContainer">
          <h1>Assignment {state.newAssignment.assignmentNumber}{state.newAssignment.title && <>: {state.newAssignment.title}</>}</h1>
          {state.newAssignment.description?.split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
          {state.newAssignment.newAssignmentMedia.filter(m => m.type !== 'download').map(m => {
            const src = `${endpoint}/tutors/${tutorId}/newAssignmentMedia/${m.assignmentMediumId}/file`;
            return (
              <figure key={m.assignmentMediumId} className={`figure ${m.type}Figure d-block`}>
                <Medium className="figure-img mb-0 mw-100" medium={m} src={src} />
                <figcaption className="figure-caption">{m.caption}</figcaption>
              </figure>
            );
          })}
          {state.newAssignment.markingCriteria && (
            <div className="alert alert-secondary">
              <h3 className="h6">Assignment Marking Criteria</h3>
              {state.newAssignment.markingCriteria.replace(/\r\n/gu, '\n').split('\n\n').map((m, i) => <p key={i}>{m}</p>)}
            </div>
          )}
        </div>
      </Section>
      {state.newAssignment.newParts.map(n => (
        <Section key={n.partId}>
          <div className="container">
            <Part tutorId={tutorId} newPart={n} saveInput={saveInput} />
          </div>
        </Section>
      ))}
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
      `}</style>
    </>
  );
};
