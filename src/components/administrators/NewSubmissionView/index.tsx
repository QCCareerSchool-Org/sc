import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC, FormEventHandler, MouseEvent, MouseEventHandler } from 'react';
import { useCallback, useId, useReducer } from 'react';

import { NewAssignmentList } from './NewAssignmentList';
import { NewSubmissionStatsTable } from './NewSubmissionStatsTable';
import { NewSubmissionStatus } from './NewSubmissionStatus';
import { NewTransfersList } from './NewTransfersList';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useSubmissionRestart } from './useSubmissionRestart';
import { useSubmissionTransfer } from './useSubmissionTransfer';
import { Modal } from '@/components/Modal';
import { ModalDialog } from '@/components/ModalDialog';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  submissionId: string;
};

export const NewSubmissionView: FC<Props> = ({ administratorId, submissionId }) => {
  const id = useId();
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId, submissionId);

  const submissionTransfer$ = useSubmissionTransfer(dispatch, administratorId, submissionId);
  const submissionRestart$ = useSubmissionRestart(dispatch, administratorId, submissionId);

  const handleClick = useCallback((e: MouseEvent<HTMLTableRowElement>, assignmentId: string): void => {
    void router.push(`/administrators/new-assignments/${assignmentId}`);
  }, [ router ]);

  const handleTutorIdChange: ChangeEventHandler<HTMLSelectElement> = e => {
    const tutorId = e.target.value.length ? parseInt(e.target.value, 10) : null;
    dispatch({ type: 'TUTOR_ID_CHANGED', payload: tutorId });
  };

  const handlePopupClose = useCallback(() => dispatch({ type: 'POPUP_TOGGLED' }), []);

  const handleTutorChangeButtonClick = (): void => {
    dispatch({ type: 'POPUP_TOGGLED' });
  };

  if (state.error) {
    return <ErrorPage statusCode={state.errorCode ?? 500} />;
  }

  if (!state.data) {
    return null;
  }

  const handleTransferFormSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    submissionTransfer$.next({ tutorId: state.transferForm.data.tutorId, processingState: state.transferForm.processingState });
  };

  const handleRestartButtonClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    if (!state.data) {
      return;
    }
    if (!state.data.newSubmission.closed) {
      return;
    }
    if (!state.data.newSubmission.skipped && state.data.newSubmission.mark && state.data.newSubmission.mark > state.data.newSubmission.points / 2) {
      if (!confirm('This submission already has a mark over 50%. Are you sure you want to restart it?')) {
        return;
      }
    }

    submissionRestart$.next({ processingState: state.restartForm.processingState });
  };

  const submission = state.data.newSubmission;
  const enrollment = submission.enrollment;

  const enrollmentUrl = '/administrators/students/edit.php?id=' + encodeURIComponent(enrollment.enrollmentId);

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
              {submission.newTransfers.length > 0 && (
                <div className="mt-4">
                  <h2 className="h6">Transfers</h2>
                  <NewTransfersList transfers={submission.newTransfers} />
                </div>
              )}
            </div>
            <div className="col-12 col-lg-5">
              <NewSubmissionStatsTable administratorId={administratorId} submission={submission} onTutorChangeButtonClick={handleTutorChangeButtonClick} />
              {submission.closed && submission.redoId === null && <div className="text-end"><button onClick={handleRestartButtonClick} className="btn btn-danger" disabled={state.restartForm.processingState === 'saving'}>Restart Submission</button></div>}
            </div>
          </div>
        </div>
      </Section>
      <Modal show={state.popup} onClose={handlePopupClose}>
        <ModalDialog title="Transfer Submission" onClose={handlePopupClose}>
          <div className="alert alert-info">
            <p>This will allow you to change the assigned tutor for <strong>this submission only</strong>. Any work already done on this submission by the current tutor will be attributed to the new tutor.</p>
            <p className="mb-0">To change the tutor for all future submissions, go to <a className="alert-link" href={enrollmentUrl}>this enrollment's information page</a>.</p>
          </div>
          {state.data.newSubmission.tutor && <p>The current tutor for this unit is <strong>{state.data.newSubmission.tutor.firstName} {state.data.newSubmission.tutor.lastName}</strong>.</p>}
          <form onSubmit={handleTransferFormSubmit}>
            <div className="mb-3">
              <label htmlFor={`${id}tutorId`} className="form-label">New Tutor</label>
              <select onChange={handleTutorIdChange} value={state.transferForm.data.tutorId ?? undefined} id={`${id}tutorId`} name="tutorId" className="form-select">
                <option />
                {state.data.tutors.map(t => <option key={t.tutorId} value={t.tutorId}>{t.firstName} {t.lastName}</option>)}
              </select>
            </div>
            <div className="d-flex align-items-center">
              <button type="submit" className="btn btn-primary" style={{ width: 90 }}>
                {state.transferForm.processingState === 'saving' ? <Spinner size="sm" /> : 'Transfer'}
              </button>
              {state.transferForm.processingState === 'save error' && <span className="text-danger ms-2">{state.transferForm.errorMessage?.length ? state.transferForm.errorMessage : 'Save Error'}</span>}
            </div>
          </form>
        </ModalDialog>
      </Modal>
      <Section>
        <div className="container">
          <h2>Assignments</h2>
          <NewAssignmentList assignments={submission.newAssignments} onClick={handleClick} />
        </div>
      </Section>
      <style jsx>{`
      .modalWrapper { background: white; }
      `}</style>
    </>
  );
};
