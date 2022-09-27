import type { FC } from 'react';
import { memo } from 'react';

import { endpoint } from '../../../basePath';
import { Audio } from '@/components/Audio';
import { Video } from '@/components/Video';
import type { NewAssignmentMedium } from '@/domain/newAssignmentMedium';

type Props = {
  className: string;
  administratorId: number;
  newAssignmentMedium: NewAssignmentMedium;
};

export const NewAssignmentMediumView: FC<Props> = memo(({ className, administratorId, newAssignmentMedium }) => {
  const src = `${endpoint}/administrators/${administratorId}/newAssignmentMedia/${newAssignmentMedium.assignmentMediumId}/file`;

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
