import NextError from 'next/error';
import Link from 'next/link';
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
import { getVirtualCommunityLink } from 'src/lib/virtualCommunityLink';

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

  const virtualCommunityLink = getVirtualCommunityLink(state.newSubmission.enrollment.course.school.slug);

  const expired = state.newSubmission.enrollment.dueDate !== null && state.newSubmission.enrollment.dueDate <= new Date();

  return (
    <>
      <Section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8">
              {state.newSubmission.optional && <span className="text-danger">OPTIONAL</span>}
              <h1>Submission {state.newSubmission.unitLetter}{state.newSubmission.title && <>: {state.newSubmission.title}</>}</h1>
              <NewSubmissionInfoTable newSubmission={state.newSubmission} />
              {state.newSubmission.submitted === null && state.newSubmission.parent !== null && (
                <div className="alert alert-danger mt-3" role="alert">
                  This submission is a redo. Be sure to carefully review the audio feedback your tutor provided for your <Link href={`/students/courses/${courseId}/submissions/${state.newSubmission.parent.submissionId}`} className="alert-link">previous submission</Link>, and make the necessary changes to your assignments before resubmitting this unit to your tutor.
                </div>
              )}
              <NewSubmissionStatus studentId={studentId} courseId={courseId} newSubmission={state.newSubmission} onProgress={handleAudioProgress} />
              {state.newSubmission.submitted === null && expired && (
                <div className="alert alert-danger mt-3" role="alert">
                  <h5>Course Expired</h5>
                  <p>Your course due date has passed. Please contact the School to extend your course.</p>
                  <p className="mb-0">You will be unable to submit assignments or complete lessons until your course has been extended.</p>
                </div>
              )}
              {state.newSubmission.unitLetter === 'A' && state.newSubmission.enrollment.course.code === 'MZ' && state.newSubmission.responseProgress === 100 && (
                <div className="alert alert-info" role="alert">
                  <h5>Please Complete the Course Experience Survey</h5>
                  <p>We're working hard to make your course experience even better and your feedback is valuable. Please complete <a target="_blank" rel="noreferrer" href={surveyLink} className="alert-link">this two-minute survey</a>.</p>
                  <a target="_blank" rel="noreferrer" href={surveyLink} className="btn btn-info">Take the Survey</a>
                </div>
              )}
              {virtualCommunityLink !== null && (
                <div className="alert alert-primary" role="alert">
                  <h5>Virtual Community</h5>
                  <p>Haven't joined yet? It's time to jump into our Facebook Virtual Community! You'll find mentors, get exclusive content from industry experts, and network with peers. Don't miss out&mdash;<a target="_blank" rel="noreferrer" href={virtualCommunityLink} className="alert-link">request to join today!</a></p>
                  <a target="_blank" rel="noreferrer" href={virtualCommunityLink} className="btn btn-primary">Join the Virtual Community</a>
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
            expired={expired}
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
