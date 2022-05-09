import type { ReactElement } from 'react';
import { memo } from 'react';

import { endpoint } from '../../../basePath';
import { Audio } from '@/components/Audio';
import { Video } from '@/components/Video';
import type { NewAssignmentMedium } from '@/domain/newAssignmentMedium';

type Props = {
  className: string;
  studentId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  newAssignmentMedium: NewAssignmentMedium;
};

export const NewAssignmentMediumView = memo(({ className, studentId, courseId, unitId, assignmentId, newAssignmentMedium }: Props): ReactElement | null => {
  const src = `${endpoint}/students/${studentId}/courses/${courseId}/newUnits/${unitId}/assignments/${assignmentId}/media/${newAssignmentMedium.assignmentMediumId}/file`;

  if (newAssignmentMedium.type === 'image') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} className={className} alt={newAssignmentMedium.caption} />;
  }

  if (newAssignmentMedium.type === 'video') {
    return (
      <Video src={src} controls className={className} preload="auto" />
    );
  }

  if (newAssignmentMedium.type === 'audio') {
    return (
      <Audio src={src} controls preload="auto" />
    );
  }

  return null;
});

NewAssignmentMediumView.displayName = 'NewAssignmentMediumView';
