import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import type { FC, MouseEvent } from 'react';
import { useCallback, useReducer } from 'react';

import { formatDateTime } from '../../../formatDate';
import { NewAssignmentList } from './NewAssignmentList';
import { NewSubmissionStatus } from './NewSubmissionStatus';
import { NewTransfersList } from './NewTransfersList';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Audio } from '@/components/Audio';
import { Section } from '@/components/Section';
import { useServices } from '@/hooks/useServices';
import { endpoint } from 'src/basePath';

type Props = {
  administratorId: number;
  submissionId: string;
};

export const NewSubmissionView: FC<Props> = ({ administratorId, submissionId }) => {
  const router = useRouter();
  const { gradeService } = useServices();
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
              {submission.description && <p className="lead">{submission.description}</p>}
              <NewSubmissionStatus submission={submission} />
            </div>
            <div className="col-12 col-lg-5">
              <table className="table table-sm table-bordered bg-white submissionStats ms-lg-auto">
                <tbody>
                  <tr><th scope="row">Created</th><td>{formatDateTime(submission.created)}</td></tr>
                  {submission.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(submission.modified)}</td></tr>}
                  {submission.submitted && <tr><th scope="row">{submission.skipped ? 'Skippped' : 'Submitted'}</th><td>{formatDateTime(submission.submitted)}</td></tr>}
                  {submission.transferred && <tr><th scope="row">Transferred</th><td>{formatDateTime(submission.transferred)}</td></tr>}
                  {submission.closed && <tr><th scope="row">Marked</th><td>{formatDateTime(submission.closed)}</td></tr>}
                  {submission.submitted && submission.closed && !submission.skipped && (
                    <>
                      {submission.points > 0
                        ? (
                          <>
                            <tr><th scope="row">Mark</th><td>{submission.mark ?? '--'} / {submission.points}{submission.mark !== null && <>&nbsp;&nbsp;({gradeService.calculate(submission.mark, submission.points, submission.submitted)})</>}</td></tr>
                            {submission.markOverride !== null && <tr><th scope="row">Override</th><td>{submission.markOverride} / {submission.points}&nbsp;&nbsp;({gradeService.calculate(submission.markOverride, submission.points, submission.submitted)})</td></tr>}
                          </>
                        )
                        : <tr><th scope="row">Mark</th><td>N/A</td></tr>
                      }
                    </>
                  )}
                  {submission.responseFilename !== null && <tr><th scope="row">Audio File</th><td style={{ padding: '0.3rem' }}><Audio controls src={`${endpoint}/administrators/${administratorId}/newSubmissions/${submissionId}/feedback`} style={{ marginBottom: -6, maxHeight: 32, maxWidth: 240 }} /></td></tr>}
                </tbody>
              </table>
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
