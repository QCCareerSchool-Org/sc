import NextError from 'next/error';
import type { FC } from 'react';
import { useReducer } from 'react';

import { AssignmentSection } from './AssignmentSection';
import { NewSubmissionInfoTable } from './NewSubmissionInfoTable';
import { NewSubmissionStatus } from './NewSubmissionStatus';
import { SkipSection } from './SkipSection';
import { initialState, reducer } from './state';
import { SubmitSection } from './SubmitSection';
import { useAudioProgress } from './useAudioProgress';
import { useInitialData } from './useInitialData';
import { useSubmissionSkip } from './useSubmissionSkip';
import { useSubmissionSubmit } from './useSubmissionSubmit';
import { Section } from '@/components/Section';

type Props = {
  studentId: number;
  courseId: number;
  submissionId: string;
};

export const NewSubmissionView: FC<Props> = ({ studentId, courseId, submissionId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, studentId, courseId, submissionId);

  const submit$ = useSubmissionSubmit(dispatch);
  const skip$ = useSubmissionSkip(dispatch);
  const audioProgress$ = useAudioProgress(dispatch, studentId, courseId, submissionId);

  const handleAudioProgress = (progress: number): void => {
    audioProgress$.next(progress);
  };

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newSubmission) {
    return null;
  }

  const showAssignments = (!!state.newSubmission.closed || !state.newSubmission.submitted);

  const studentNumber = `${state.newSubmission.enrollment.course.code}${state.newSubmission.enrollment.studentNumber}`;
  const surveyLink = `https://ng295qu8zyk.typeform.com/to/LlPgGmJY#student_number=${encodeURIComponent(studentNumber)}`;

  return (
    <>
      <Section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8">
              {state.newSubmission.optional && <span className="text-danger">OPTIONAL</span>}
              <h1>Submission {state.newSubmission.unitLetter}{state.newSubmission.title && <>: {state.newSubmission.title}</>}</h1>
              <NewSubmissionInfoTable newSubmission={state.newSubmission} />
              <NewSubmissionStatus studentId={studentId} courseId={courseId} newSubmission={state.newSubmission} onProgress={handleAudioProgress} />
              {state.newSubmission.enrollment.course.code === 'MZ' && state.newSubmission.responseProgress === 100 && (
                <div className="alert alert-info">
                  <h5>Please Complete the Course Experience Survey</h5>
                  <p>We're working hard to make your course experience even better and your feedback is valuable. Please complete <a target="_blank" rel="noreferrer" href={surveyLink} className="alert-link">this two-minute survey</a>.</p>
                  <a target="_blank" rel="noreferrer" href={surveyLink} className="btn btn-info">Take the Survey</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
      {showAssignments && <AssignmentSection submission={state.newSubmission} />}
      {!state.newSubmission.submitted && (
        <>
          <SubmitSection
            studentId={studentId}
            courseId={courseId}
            submissionId={submissionId}
            processingState={state.processingState}
            submit$={submit$}
            unitComplete={state.newSubmission.complete}
            optionalAssignmentsIncomplete={state.optionalAssignmentIncomplete}
            errorMessage={state.errorMessage}
          />
          {state.newSubmission.optional && (
            <SkipSection
              studentId={studentId}
              courseId={courseId}
              submissionId={submissionId}
              processingState={state.processingState}
              skip$={skip$}
              errorMessage={state.errorMessage}
            />
          )}
        </>
      )}
    </>
  );
};
