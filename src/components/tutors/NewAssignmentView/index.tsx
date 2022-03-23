import NextError from 'next/error';
import type { ReactElement } from 'react';
import { useReducer } from 'react';

import { InaccessibleUnit } from '../InaccessibleUnit';
import { initialState, reducer } from './state';
import { useFoo } from './useFoo';
import { useInitialData } from './useInitialData';
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

  const foo$ = useFoo(tutorId, studentId, courseId, unitId, assignmentId, dispatch);

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
    <Section>
      <div className="container">
        <h1>Assignment View</h1>
        <pre>
          {JSON.stringify(state.newAssignment, undefined, ' ')}
        </pre>
      </div>
    </Section>
  );
};
