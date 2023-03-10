import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import type { FC, MouseEvent } from 'react';
import { useCallback, useReducer } from 'react';

import { formatDateTime } from '../../../formatDate';
import { NewAssignmentList } from './NewAssignmentList';
import { NewSubmissionStatus } from './NewSubmissionStatus';
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
          <div className="row">
            <div className="col-12 col-md-10 col-lg-6">
              <h1 className="mb-0">Edit {enrollment.course.code}{enrollment.studentNumber} Submission {submission.unitLetter}</h1>
              <p className="lead">{enrollment.course.name} v{enrollment.course.version}</p>
              {submission.description && <p className="lead">{submission.description}</p>}
              <table className="table table-bordered w-auto bg-white">
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
                </tbody>
              </table>
              {submission.responseFilename !== null && (
                <>
                  <h2 className="h5">Tutor Audio Feedback</h2>
                  <Audio controls src={`${endpoint}/administrators/${administratorId}/newSubmissions/${submissionId}/feedback`} />
                </>
              )}
              <div className="mt-4">
                <NewSubmissionStatus submission={submission} />
              </div>
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
    </>
  );
};
