import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { MouseEvent, MouseEventHandler, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { InaccessibleUnit } from '../InaccessibleUnit';
import { AssignmentTable } from './AssignmentTable';
import { FeebackForm } from './FeebackForm';
import { initialState, reducer } from './state';
import { useClose } from './useClose';
import { useInitialData } from './useInitialData';
import { useReturn } from './useReturn';
import { useUpload } from './useUpload';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';
import { formatDate } from 'src/formatDate';

type Props = {
  tutorId: number;
  studentId: number;
  courseId: number;
  unitId: string;
};

export const NewUnitView = ({ tutorId, studentId, courseId, unitId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(tutorId, studentId, courseId, unitId, dispatch);

  const upload$ = useUpload(dispatch);
  const close$ = useClose(dispatch);
  const return$ = useReturn(dispatch);

  const assignmentClick = useCallback((e: MouseEvent, assignmentId: string): void => {
    void router.push(`${router.asPath}/assignments/${assignmentId}`);
  }, [ router ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newUnit) {
    return null;
  }

  if (state.newUnit.tutorId !== tutorId && state.newUnit.enrollment.tutorId !== tutorId) {
    return <InaccessibleUnit reason="wrong tutor" />;
  }

  if (!state.newUnit.submitted) {
    return <InaccessibleUnit reason="not submitted" />;
  }

  const closeClick: MouseEventHandler<HTMLButtonElement> = e => {
    close$.next({ tutorId, studentId, courseId, unitId, processingState: state.processingState });
  };

  const returnClick: MouseEventHandler<HTMLButtonElement> = e => {
    return$.next({ tutorId, studentId, courseId, unitId, processingState: state.processingState });
  };

  return (
    <>
      <Section>
        <div className="container">
          <h1>Unit {state.newUnit.unitLetter}{state.newUnit.title && <>: {state.newUnit.title}</>}</h1>
          <table className="table table-bordered bg-white w-auto">
            <tbody>
              <tr><th scope="row">Course</th><td>{state.newUnit.enrollment.course.name} v{state.newUnit.enrollment.course.version}</td></tr>
              <tr><th scope="row">Student</th><td>{state.newUnit.enrollment.student.firstName} {state.newUnit.enrollment.student.lastName}</td></tr>
              <tr><th scope="row">Student Number</th><td>{state.newUnit.enrollment.course.code}&thinsp;{state.newUnit.enrollment.studentNumber}</td></tr>
              <tr><th scope="row">Submitted</th><td>{formatDate(state.newUnit.submitted)}</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Assignments</h2>
          <AssignmentTable unit={state.newUnit} onClick={assignmentClick} />
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Feedback</h2>
          <FeebackForm
            tutorId={tutorId}
            studentId={studentId}
            courseId={courseId}
            unitId={unitId}
            processingState={state.processingState}
            progress={state.progress} upload$={upload$}
          />
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Close Unit</h2>
          {state.newUnit.marked
            ? <p className="lead">This unit is now marked.</p>
            : <p className="lead">This unit is not yet marked.</p>
          }
          <div className="d-flex align-items-center">
            <button onClick={closeClick} className="btn btn-primary" style={{ width: 80 }} disabled={!state.newUnit.marked}>
              {state.processingState === 'closing' ? <Spinner size="sm" /> : 'Close'}
            </button>
            {state.processingState === 'close error' && <span className="text-danger ms-2">{state.errorMessage ?? 'error'}</span>}
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8">
              <h2 className="h3">Return to Student for Changes</h2>
              <p>This form is to be used for the following reasons:</p>
              <ol>
                <li>A student uploaded the wrong files (e.g., A2 was submitted in the slot for E2).</li>
                <li>You received a corrupt or blank file from a student (i.e., you can't open it).</li>
              </ol>
              <p>Please do not use this form to ask students to redo parts of an assignment or unit. Please mark the work as is. If the student does poorly, let him or her know they can resubmit the unit for a small fee. Advise the student to call the School to set this up.</p>
              <p>To send this assignment back to the student, enter a brief reason below and then click the &ldquo;Return&rdquo; button. We'll read your message and write our own message to the student.</p>
              <div className="mb-3">
                <label htmlFor={'returnMessage' + unitId} className="form-label fw-bold">Message to Student</label>
                <textarea maxLength={1000} id={'returnMessage' + unitId} className="form-control" rows={7} />
              </div>
              <div className="d-flex align-items-center">
                <button onClick={returnClick} className="btn btn-danger" style={{ width: 80 }}>
                  {state.processingState === 'returning' ? <Spinner size="sm" /> : 'Return'}
                </button>
                {state.processingState === 'return error' && <span className="text-danger ms-2">{state.errorMessage ?? 'error'}</span>}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
