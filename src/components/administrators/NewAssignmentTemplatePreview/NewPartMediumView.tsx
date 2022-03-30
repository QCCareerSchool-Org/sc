import type { ReactElement } from 'react';
import { memo } from 'react';

import { Audio } from '@/components/Audio';
import { Video } from '@/components/Video';
import type { NewPartMedium } from '@/domain/newPartMedium';
import { endpoint } from 'src/basePath';

type Props = {
  className: string;
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  newPartMedium: NewPartMedium;
};

export const NewPartMediumView = memo(({ className, administratorId, schoolId, courseId, unitId, assignmentId, partId, newPartMedium }: Props): ReactElement | null => {
  const src = `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/parts/${partId}/media/${newPartMedium.partMediumId}/file`;

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
