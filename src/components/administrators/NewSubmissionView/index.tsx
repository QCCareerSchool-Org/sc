import { useRouter } from 'next/router';
import type { FC, MouseEvent } from 'react';
import { useCallback, useReducer } from 'react';

import { NewAssignmentList } from './NewAssignmentList';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';

type Props = {
  administratorId: number;
  submissionId: string;
};

export const NewSubmissionView: FC<Props> = ({ administratorId, submissionId }) => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId, submissionId);

  const handleClick = useCallback((e: MouseEvent<HTMLTableRowElement>, assignmentId: string): void => {
    void router.push(`/administrators/new-assignments/${assignmentId}`);
  }, [ router ]);

  if (!state.newSubmission) {
    return null;
  }

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Submission</h1>
          <NewAssignmentList assignments={state.newSubmission.newAssignments} onClick={handleClick} />
        </div>
      </Section>
    </>
  );
};
