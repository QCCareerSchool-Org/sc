import NextError from 'next/error';
import type { ReactElement } from 'react';
import { useReducer } from 'react';

import { AssignmentSection } from './AssignmentSection';
import { NewUnitInfoTable } from './NewUnitInfoTable';
import { NewUnitStatus } from './NewUnitStatus';
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
  unitId: string;
};

export const NewUnitView = ({ studentId, courseId, unitId }: Props): ReactElement | null => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, studentId, courseId, unitId);

  const submit$ = useUnitSubmit(dispatch);
  const skip$ = useUnitSkip(dispatch);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newUnit) {
    return null;
  }

  const showAssignments = (!!state.newUnit.closed || !state.newUnit.submitted);

  return (
    <>
      <Section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8">
              {state.newUnit.optional && <span className="text-danger">OPTIONAL</span>}
              <h1>Unit {state.newUnit.unitLetter}{state.newUnit.title && <>: {state.newUnit.title}</>}</h1>
              <NewUnitInfoTable newUnit={state.newUnit} />
              <NewUnitStatus studentId={studentId} courseId={courseId} newUnit={state.newUnit} />
            </div>
          </div>
        </div>
      </Section>
      {showAssignments && <AssignmentSection unit={state.newUnit} />}
      {!state.newUnit.submitted && (
        <>
          <SubmitSection
            studentId={studentId}
            courseId={courseId}
            unitId={unitId}
            processingState={state.processingState}
            submit$={submit$}
            unitComplete={state.newUnit.complete}
            optionalAssignmentsIncomplete={state.optionalAssignmentIncomplete}
            errorMessage={state.errorMessage}
          />
          {state.newUnit.optional && (
            <SkipSection
              studentId={studentId}
              courseId={courseId}
              unitId={unitId}
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
