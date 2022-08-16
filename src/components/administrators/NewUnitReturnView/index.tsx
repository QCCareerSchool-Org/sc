import NextError from 'next/error';
import Link from 'next/link';
import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { Fragment, useReducer } from 'react';

import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useUnitReturnClose } from './useUnitReturnClose';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { formatDateTime } from 'src/formatDate';

type Props = {
  administratorId: number;
  unitReturnId: string;
};

export const NewUnitReturnView: FC<Props> = ({ administratorId, unitReturnId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId, unitReturnId);
  const unitReturnClose$ = useUnitReturnClose(dispatch);

  const unsavedChanges = state.newUnitReturn && state.form.adminComment !== state.newUnitReturn.newUnit.adminComment && !(state.form.adminComment === '' && state.newUnitReturn.newUnit.adminComment === null);

  useWarnIfUnsavedChanges(unsavedChanges);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newUnitReturn) {
    return null;
  }

  const handleAdminCommentChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    dispatch({ type: 'ADMIN_COMMENT_CHANGED', payload: e.target.value });
  };

  const handleCloseButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    unitReturnClose$.next({
      processingState: state.form.processingState,
      administratorId,
      unitReturnId,
      adminComment: state.form.adminComment,
    });
  };

  const enrollment = state.newUnitReturn.newUnit.enrollment;
  const tutor = state.newUnitReturn.newUnit.tutor;

  return (
    <Section>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-5 col-xl-4">
            <h1>Returned Unit</h1>
            <table className="table table-bordered w-auto">
              <tbody>
                <tr>
                  <th scope="row">Name</th>
                  <td><a href={`/administrators/accounts/edit.php?id=${enrollment.studentId}`}>{enrollment.student.firstName} {enrollment.student.lastName}</a></td>
                </tr>
                <tr>
                  <th scope="row">Student Number</th>
                  <td><a href={`/administrators/students/edit.php?id=${enrollment.enrollmentId}`}>{enrollment.course.code}&thinsp;{enrollment.studentNumber}</a></td>
                </tr>
                <tr>
                  <th scope="row">Course</th>
                  <td>{enrollment.course.name}</td>
                </tr>
                <tr>
                  <th scope="row">Returned Date</th>
                  <td>{formatDateTime(state.newUnitReturn.returned)}</td>
                </tr>
                <tr>
                  <th scope="row">Tutor</th>
                  <td>{tutor.firstName} {tutor.lastName}</td>
                </tr>
                <tr>
                  <th scope="row">Unit</th>
                  <td><Link href={`/administrators/new-units/${state.newUnitReturn.unitId}`}><a>{state.newUnitReturn.newUnit.unitLetter}</a></Link></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-12 col-md-10 col-lg-7 col-xl-8">
            <div className="mb-3 mt-lg-4">
              <label htmlFor="tutorComment">Tutor's Comments</label>
              <div id="tutorComment" className="form-control">{state.newUnitReturn.newUnit.tutorComment?.replace(/\r\n/gu, '\n').split('\n').map((p, i) => {
                if (i === 0) {
                  return <Fragment key={i}>{p}</Fragment>;
                }
                return <Fragment key={i}><br />{p}</Fragment>;
              })}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="adminComment">Your Comments</label>
              <textarea onChange={handleAdminCommentChange} value={state.form.adminComment} className="form-control" rows={8} disabled={!!state.newUnitReturn.completed} />
            </div>
            <div className="d-flex align-items-center">
              <button onClick={handleCloseButtonClick} className="btn btn-primary" style={{ width: 80 }} disabled={state.form.processingState === 'saving' || state.form.adminComment.length === 0 || !unsavedChanges}>
                {state.form.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
              </button>
              {state.form.processingState === 'save error' && <span className="text-danger ms-2">{state.form.errorMessage ?? 'Error saving'}</span>}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
