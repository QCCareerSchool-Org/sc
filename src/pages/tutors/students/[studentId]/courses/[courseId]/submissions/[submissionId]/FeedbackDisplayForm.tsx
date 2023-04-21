import type { FC, MouseEventHandler } from 'react';
import { memo, useMemo } from 'react';
import type { Subject } from 'rxjs';

import type { State } from './state';
import type { FeedbackDeletePayload } from './useFeedbackDelete';
import { Audio } from '@/components/Audio';
import { Spinner } from '@/components/Spinner';
import { endpoint } from 'src/basePath';
import { humanReadableFileSize } from 'src/humanReadableFilesize';

type Props = {
  tutorId: number;
  studentId: number;
  courseId: number;
  submissionId: string;
  responseFilename: string;
  responseFilesize: number;
  responseMimeTypeId: string;
  processingState: State['processingState'];
  errorMessage: State['errorMessage'];
  delete$: Subject<FeedbackDeletePayload>;
};

export const FeedbackDisplayForm: FC<Props> = memo(props => {
  const { tutorId, studentId, courseId, submissionId, responseFilename, responseFilesize, processingState, errorMessage, delete$ } = props;
  const audioSrc = useMemo(() => `${endpoint}/tutors/${tutorId}/students/${studentId}/newSubmissions/${submissionId}/response`, [ tutorId, studentId, submissionId ]);

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm('Are you sure you want to delete your audio feedback?')) {
      delete$.next({ tutorId, studentId, courseId, submissionId, processingState });
    }
  };

  return (
    <>
      <div>
        <figure className="figure">
          <Audio src={audioSrc} controls preload="auto" />
          <figcaption className="figure-caption"><strong>{responseFilename}</strong> ({humanReadableFileSize(responseFilesize)})</figcaption>
        </figure>
      </div>
      <div className="d-flex align-items-center">
        <button onClick={handleDeleteClick} className="btn btn-danger" style={{ width: 80 }}>
          {processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
        </button>
        {processingState === 'delete error' && <span className="text-danger ms-2">{errorMessage ?? 'Delete error'}</span>}
      </div>
    </>
  );
});

FeedbackDisplayForm.displayName = 'FeedbackDisplayForm';
