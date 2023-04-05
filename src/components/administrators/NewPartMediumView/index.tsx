import type { FC } from 'react';
import { memo } from 'react';

import { endpoint } from '../../../basePath';
import { Audio } from '@/components/Audio';
import { Video } from '@/components/Video';
import type { NewPartMedium } from '@/domain/newPartMedium';

type Props = {
  className: string;
  administratorId: number;
  newPartMedium: NewPartMedium;
};

export const NewPartMediumView: FC<Props> = memo(({ className, administratorId, newPartMedium }) => {
  const src = `${endpoint}/administrators/${administratorId}/newPartMedia/${newPartMedium.partMediumId}/file`;

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
