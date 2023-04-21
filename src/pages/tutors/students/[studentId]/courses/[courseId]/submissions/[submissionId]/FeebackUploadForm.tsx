import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { memo } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { FeedbackUploadPayload } from './useFeedbackUpload';
import { ProgressBar } from '@/components/ProgressBar';
import { Spinner } from '@/components/Spinner';

type Props = {
  tutorId: number;
  studentId: number;
  courseId: number;
  submissionId: string;
  state: State;
  onFileChange: ChangeEventHandler<HTMLInputElement>;
  upload$: Subject<FeedbackUploadPayload>;
};

export const FeebackUploadForm: FC<Props> = memo(props => {
  const { tutorId, studentId, courseId, submissionId, state, upload$ } = props;

  const disabled = typeof state.feedbackForm.errorMessage !== 'undefined' || state.feedbackForm.file === null || state.processingState === 'uploading' || state.processingState === 'deleting' || state.processingState === 'closing' || state.processingState === 'returning';

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (!disabled && state.feedbackForm.file !== null) {
      upload$.next({ tutorId, studentId, courseId, submissionId, file: state.feedbackForm.file, processingState: state.processingState });
    }
  };

  return (
    <>
      <div className="mb-3">
        {state.processingState === 'uploading'
          ? <ProgressBar progress={state.feedbackForm.progress}>{state.feedbackForm.progress}%</ProgressBar>
          : <input onChange={props.onFileChange} type="file" accept="audio/*" className="form-control" id={submissionId} />
        }
      </div>
      <div className="d-flex align-items-center">
        <button onClick={handleButtonClick} className="btn btn-primary" style={{ width: 80 }} disabled={disabled}>
          {state.processingState === 'uploading' ? <Spinner size="sm" /> : 'Upload'}
        </button>
        {state.feedbackForm.errorMessage && <small className="text-danger ms-2">{state.feedbackForm.errorMessage}</small>}
        {state.processingState === 'upload error' && <small className="text-danger ms-2">{state.errorMessage ?? 'Upload error'}</small>}
      </div>
    </>
  );
});

FeebackUploadForm.displayName = 'FeebackUploadForm';
