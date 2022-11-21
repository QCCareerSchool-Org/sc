import type { FC } from 'react';
import { memo } from 'react';

import { endpoint } from '../../../basePath';
import { Audio } from '@/components/Audio';
import { Video } from '@/components/Video';
import type { NewPartMedium } from '@/domain/newPartMedium';

type Props = {
  className: string;
  studentId: number;
  courseId: number;
  submissionId: string;
  assignmentId: string;
  partId: string;
  newPartMedium: NewPartMedium;
};

export const NewPartMediumView: FC<Props> = memo(props => {
  const { className, studentId, courseId, submissionId, assignmentId, partId, newPartMedium } = props;
  const src = `${endpoint}/students/${studentId}/courses/${courseId}/newSubmissions/${submissionId}/assignments/${assignmentId}/parts/${partId}/media/${newPartMedium.partMediumId}/file`;

  if (newPartMedium.type === 'image') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} className={className} alt={newPartMedium.caption} />;
  }

  if (newPartMedium.type === 'video') {
    return (
      <Video src={src} controls className={className} preload="auto" />
    );
  }

  if (newPartMedium.type === 'audio') {
    return (
      <Audio src={src} controls preload="auto" />
    );
  }

  return null;
});

NewPartMediumView.displayName = 'NewPartMediumView';
