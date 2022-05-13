import type { MouseEventHandler, ReactElement } from 'react';
import { memo, useMemo } from 'react';
import type { Subject } from 'rxjs';

import { endpoint } from '../../../basePath';
import { humanReadableFileSize } from '../../../humanReadableFilesize';
import type { State } from './state';
import type { FeedbackDeletePayload } from './useFeedbackDelete';
import { Audio } from '@/components/Audio';
import { Spinner } from '@/components/Spinner';

type Props = {
  tutorId: number;
  studentId: number;
  courseId: number;
  unitId: string;
  responseFilename: string;
  responseFilesize: number;
  responseMimeTypeId: string;
  processingState: State['processingState'];
  errorMessage: State['errorMessage'];
  delete$: Subject<FeedbackDeletePayload>;
};

export const FeedbackDisplayForm = memo((props: Props): ReactElement => {
  const { tutorId, studentId, courseId, unitId, responseFilename, responseFilesize, responseMimeTypeId, processingState, errorMessage, delete$ } = props;
  const audioSrc = useMemo(() => `${endpoint}/tutors/${tutorId}/students/${studentId}/newUnits/${unitId}/response`, [ tutorId, studentId, unitId ]);

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm('Are you sure you want to delete your audio feedback?')) {
      delete$.next({ tutorId, studentId, courseId, unitId, processingState });
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
