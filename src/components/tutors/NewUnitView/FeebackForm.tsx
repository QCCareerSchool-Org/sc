import type { ChangeEventHandler, ReactElement } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { UploadPayload } from './useUpload';
import { ProgressBar } from '@/components/ProgressBar';

type Props = {
  tutorId: number;
  studentId: number;
  courseId: number;
  unitId: string;
  processingState: State['processingState'];
  progress: State['progress'];
  upload$: Subject<UploadPayload>;
};

export const FeebackForm = ({ tutorId, studentId, courseId, unitId, processingState, progress, upload$ }: Props): ReactElement => {

  if (processingState === 'uploading') {
    return <ProgressBar progress={progress}>{progress}%</ProgressBar>;
  }

  const inputChange: ChangeEventHandler<HTMLInputElement> = e => {
    const files = e.target.files;
    if (files?.length === 1) {
      const file = files[0];
      upload$.next({ tutorId, studentId, courseId, unitId, file, processingState });
    }
  };

  return <input onChange={inputChange} type="file" />;
};
