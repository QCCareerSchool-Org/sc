import type { ChangeEventHandler, MouseEventHandler, ReactElement } from 'react';
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
  unitId: string;
  state: State;
  fileChange: ChangeEventHandler<HTMLInputElement>;
  upload$: Subject<FeedbackUploadPayload>;
};

export const FeebackUploadForm = memo(({ tutorId, studentId, courseId, unitId, state, fileChange, upload$ }: Props): ReactElement => {

  const disabled = typeof state.feedbackForm.errorMessage !== 'undefined' || state.feedbackForm.file === null || state.processingState === 'uploading' || state.processingState === 'deleting' || state.processingState === 'closing' || state.processingState === 'returning';

  const buttonClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (!disabled && state.feedbackForm.file !== null) {
      upload$.next({ tutorId, studentId, courseId, unitId, file: state.feedbackForm.file, processingState: state.processingState });
    }
  };

  return (
    <>
      <div className="mb-3">
        {state.processingState === 'uploading'
          ? <ProgressBar progress={state.feedbackForm.progress}>{state.feedbackForm.progress}%</ProgressBar>
          : <input onChange={fileChange} type="file" accept="audio/*" className="form-control" id={unitId} />
        }
      </div>
      <div className="d-flex align-items-center">
        <button onClick={buttonClick} className="btn btn-primary" style={{ width: 80 }} disabled={disabled}>
          {state.processingState === 'uploading' ? <Spinner size="sm" /> : 'Upload'}
        </button>
        {state.feedbackForm.errorMessage && <small className="text-danger ms-2">{state.feedbackForm.errorMessage}</small>}
        {state.processingState === 'upload error' && <small className="text-danger ms-2">{state.errorMessage ?? 'Upload error'}</small>}
      </div>
    </>
  );
});

FeebackUploadForm.displayName = 'FeebackUploadForm';
