import NextError from 'next/error';
import type { ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { InaccessibleUnit } from '../InaccessibleUnit';
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

  return (
    <>
      <Section>
        <div className="container assignmentContainer">
          <h1>Assignment {state.newAssignment.assignmentNumber}{state.newAssignment.title && <>: {state.newAssignment.title}</>}</h1>
          {state.newAssignment.description?.split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
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
      <style jsx>{`
      .alert p:last-of-type { margin-bottom: 0; }
      .assignmentContainer *:last-child { margin-bottom: 0; }
      `}</style>
    </>
  );
};
