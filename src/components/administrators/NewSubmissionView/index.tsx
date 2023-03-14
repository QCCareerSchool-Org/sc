import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import type { FC, MouseEvent } from 'react';
import { useCallback, useReducer } from 'react';

import { NewAssignmentList } from './NewAssignmentList';
import { NewSubmissionStatsTable } from './NewSubmissionStatsTable';
import { NewSubmissionStatus } from './NewSubmissionStatus';
import { NewTransfersList } from './NewTransfersList';
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

  if (state.error) {
    return <ErrorPage statusCode={state.errorCode ?? 500} />;
  }

  if (!state.data) {
    return null;
  }

  const submission = state.data.newSubmission;
  const enrollment = submission.enrollment;

  return (
    <>
      <Section>
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 col-lg-7 mb-4 mb-lg-0">
              <h1 className="mb-0">{enrollment.course.code}{enrollment.studentNumber} Submission {submission.unitLetter}</h1>
              <p className="lead">{enrollment.course.name} v{enrollment.course.version}</p>
              <p className="lead">{submission.description ?? '(No description)'}</p>
              <NewSubmissionStatus submission={submission} />
            </div>
            <div className="col-12 col-lg-5">
              <NewSubmissionStatsTable administratorId={administratorId} submission={submission} />
              {submission.newTransfers.length > 0 && (
                <div className="mt-4">
                  <h2 className="h6">Transfers</h2>
                  <NewTransfersList transfers={submission.newTransfers} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2>Assignments</h2>
          <NewAssignmentList assignments={submission.newAssignments} onClick={handleClick} />
        </div>
      </Section>
      <style jsx>{`
      .submissionStats th, .submissionStats td { padding: 0.5rem 1rem; }
      `}</style>
    </>
  );
};
