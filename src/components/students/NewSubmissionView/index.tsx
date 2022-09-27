import NextError from 'next/error';
import type { FC } from 'react';
import { useReducer } from 'react';

import { AssignmentSection } from './AssignmentSection';
import { NewSubmissionInfoTable } from './NewSubmissionInfoTable';
import { NewSubmissionStatus } from './NewSubmissionStatus';
import { SkipSection } from './SkipSection';
import { initialState, reducer } from './state';
import { SubmitSection } from './SubmitSection';
import { useInitialData } from './useInitialData';
import { useUnitSkip } from './useUnitSkip';
import { useUnitSubmit } from './useUnitSubmit';
import { Section } from '@/components/Section';

type Props = {
  studentId: number;
  courseId: number;
  submissionId: string;
};

export const NewSubmissionView: FC<Props> = ({ studentId, courseId, submissionId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, studentId, courseId, submissionId);

  const submit$ = useUnitSubmit(dispatch);
  const skip$ = useUnitSkip(dispatch);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newSubmission) {
    return null;
  }

  const showAssignments = (!!state.newSubmission.closed || !state.newSubmission.submitted);

  return (
    <>
      <Section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8">
              {state.newSubmission.optional && <span className="text-danger">OPTIONAL</span>}
              <h1>Unit {state.newSubmission.unitLetter}{state.newSubmission.title && <>: {state.newSubmission.title}</>}</h1>
              <NewSubmissionInfoTable newSubmission={state.newSubmission} />
              <NewSubmissionStatus studentId={studentId} courseId={courseId} newSubmission={state.newSubmission} />
            </div>
          </div>
        </div>
      </Section>
      {showAssignments && <AssignmentSection unit={state.newSubmission} />}
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
