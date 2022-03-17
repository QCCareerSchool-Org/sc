import type { ReactElement } from 'react';
import { memo } from 'react';

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
      <video controls className={className}>
        <source type={newPartMedium.mimeTypeId} src={src} />
      </video>
    );
  }

  if (newPartMedium.type === 'audio') {
    return (
      <audio controls>
        <source type={newPartMedium.mimeTypeId} src={src} />
      </audio>
    );
  }

  return null;
});

NewPartMediumView.displayName = 'NewPartMediumView';
