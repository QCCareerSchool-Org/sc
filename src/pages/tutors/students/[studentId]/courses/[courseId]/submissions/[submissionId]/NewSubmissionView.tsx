import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC, MouseEvent, MouseEventHandler } from 'react';
import { useCallback, useReducer } from 'react';

import { AssignmentTable } from './AssignmentTable';
import { FeebackUploadForm } from './FeebackUploadForm';
import { FeedbackDisplayForm } from './FeedbackDisplayForm';
import { initialState, reducer } from './state';
import { useClose } from './useClose';
import { useFeedbackDelete } from './useFeedbackDelete';
import { useFeedbackUpload } from './useFeedbackUpload';
import { useInitialData } from './useInitialData';
import { useReturn } from './useReturn';
import { Audio } from '@/components/Audio';
import { InaccessibleUnit } from '@/components/InaccessibleUnit';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';
import { endpoint } from 'src/basePath';
import { formatDate } from 'src/formatDate';

type Props = {
  tutorId: number;
  studentId: number;
  courseId: number;
  submissionId: string;
};

export const NewSubmissionView: FC<Props> = ({ tutorId, studentId, courseId, submissionId }) => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, tutorId, studentId, courseId, submissionId);

  const feedbackUpload$ = useFeedbackUpload(dispatch);
  const feedbackDelete$ = useFeedbackDelete(dispatch);
  const close$ = useClose(dispatch);
  const return$ = useReturn(dispatch);

  const handleAssignmentClick = useCallback((e: MouseEvent, assignmentId: string): void => {
    void router.push(`${router.asPath}/assignments/${assignmentId}`);
  }, [ router ]);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    if (e.target.files?.[0]) {
      dispatch({ type: 'FILE_CHANGED', payload: e.target.files[0] });
    }
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newSubmission) {
    return null;
  }

  if (state.newSubmission.tutorId !== tutorId && state.newSubmission.enrollment.tutorId !== tutorId) {
    return <InaccessibleUnit reason="wrong tutor" />;
  }

  if (!state.newSubmission.submitted) {
    return <InaccessibleUnit reason="not submitted" />;
  }

  const handleCloseClick: MouseEventHandler<HTMLButtonElement> = () => {
    close$.next({ tutorId, studentId, courseId, submissionId, processingState: state.processingState });
  };

  const handleReturnClick: MouseEventHandler<HTMLButtonElement> = () => {
    return$.next({ tutorId, studentId, courseId, submissionId, comment: state.returnForm.message, processingState: state.processingState });
  };

  const handleMessageChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    dispatch({ type: 'MESSAGE_CHANGED', payload: e.target.value });
  };

  return (
    <>
      <Section>
        <div className="container">
          <h1>Unit {state.newSubmission.unitLetter}{state.newSubmission.title && <>: {state.newSubmission.title}</>}</h1>
          <table className="table table-bordered bg-white w-auto">
            <tbody>
              <tr><th scope="row">Course</th><td>{state.newSubmission.enrollment.course.name} v{state.newSubmission.enrollment.course.version}</td></tr>
              <tr><th scope="row">Student</th><td>{state.newSubmission.enrollment.student.firstName} {state.newSubmission.enrollment.student.lastName}</td></tr>
              <tr><th scope="row">Student Number</th><td>{state.newSubmission.enrollment.course.code}&thinsp;{state.newSubmission.enrollment.studentNumber}</td></tr>
              <tr><th scope="row">Submitted</th><td>{formatDate(state.newSubmission.submitted)}</td></tr>
              {state.newSubmission.closed && state.newSubmission.responseFilename !== null && (
                <tr><th scope="row">Audio File</th><td style={{ padding: '0.3rem' }}><Audio controls src={`${endpoint}/tutors/${tutorId}/students/${studentId}/newSubmissions/${submissionId}/response`} style={{ marginBottom: -6, maxHeight: 32, maxWidth: 240 }} /></td></tr>
              )}
            </tbody>
          </table>
          {state.newSubmission.tutorId !== tutorId && (
            <div className="alert alert-info mt-4">This submission was marked by another tutor</div>
          )}
          {state.newSubmission.hasParent && (
            <div className="alert alert-primary mt-4">This submission is a redo. Changed answers are highlighted.</div>
          )}
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Assignments</h2>
          <AssignmentTable newSubmission={state.newSubmission} onClick={handleAssignmentClick} />
        </div>
      </Section>
      {state.newSubmission.closed === null && (
        <>
          <Section>
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-10 col-lg-8">
                  <h2 className="h3">Feedback</h2>
                  {state.newSubmission.responseFilename === null
                    ? (
                      <FeebackUploadForm
                        tutorId={tutorId}
                        studentId={studentId}
                        courseId={courseId}
                        submissionId={submissionId}
                        state={state}
                        onFileChange={handleFileChange}
                        upload$={feedbackUpload$}
                      />
                    )
                    : (
                      <FeedbackDisplayForm
                        tutorId={tutorId}
                        studentId={studentId}
                        courseId={courseId}
                        submissionId={submissionId}
                        responseFilename={state.newSubmission.responseFilename}
                        responseFilesize={state.newSubmission.responseFilesize ?? 0}
                        responseMimeTypeId={state.newSubmission.responseMimeTypeId ?? 'audio/mp3'}
                        processingState={state.processingState}
                        errorMessage={state.errorMessage}
                        delete$={feedbackDelete$}
                      />
                    )}
                </div>
              </div>
            </div>
          </Section>
          <Section>
            <div className="container">
              <h2 className="h3">Close Unit</h2>
              {state.newSubmission.mark === null
                ? <p className="lead">This unit is not yet marked.</p>
                : state.newSubmission.responseFilename === null
                  ? <p className="lead">No feedback has been provided</p>
                  : <p className="lead">You can now close this unit.</p>
              }
              <div className="d-flex align-items-center">
                <button onClick={handleCloseClick} className="btn btn-primary" style={{ width: 80 }} disabled={state.newSubmission.mark === null || state.newSubmission.responseFilename === null || state.processingState === 'closing' || state.processingState === 'returning' || state.processingState === 'uploading' || state.processingState === 'deleting'}>
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
                  <p><strong className="text-danger">Please do not use this form to ask students to redo parts of an assignment or unit.</strong> Please mark the work as is. If the student does poorly, let the student know that he or she can resubmit the unit for a small fee. Advise the student to call the School to set this up.</p>
                  <p>To send this assignment back to the student, enter a brief reason below and then click the &ldquo;Return&rdquo; button. We'll read your message and write our own message to the student.</p>
                  <div className="mb-3">
                    <label htmlFor={'returnMessage' + submissionId} className="form-label fw-bold">Message to Student</label>
                    <textarea onChange={handleMessageChange} value={state.returnForm.message} maxLength={1000} id={'returnMessage' + submissionId} className="form-control" rows={7} />
                  </div>
                  <div className="d-flex align-items-center">
                    <button onClick={handleReturnClick} className="btn btn-danger" style={{ width: 80 }} disabled={state.returnForm.message.length === 0 || state.processingState === 'closing' || state.processingState === 'returning' || state.processingState === 'uploading' || state.processingState === 'deleting'}>
                      {state.processingState === 'returning' ? <Spinner size="sm" /> : 'Return'}
                    </button>
                    {state.processingState === 'return error' && <span className="text-danger ms-2">{state.errorMessage ?? 'error'}</span>}
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </>
      )}
    </>
  );
};
