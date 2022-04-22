import type { ReactElement } from 'react';

import { Audio } from '@/components/Audio';
import { Img } from '@/components/Img';
import { Video } from '@/components/Video';
import type { NewAssignmentMedium } from '@/domain/newAssignmentMedium';
import type { NewPartMedium } from '@/domain/newPartMedium';

type Props = {
  medium: NewAssignmentMedium | NewPartMedium;
  src: string;
  className?: string;
};

export const Medium = ({ medium, src, className }: Props): ReactElement => {
  switch (medium.type) {
    case 'image':
      return <Img src={src} className={className} alt={medium.caption} />;
    case 'video':
      return <Video src={src} controls className={className} preload="auto" />;
    case 'audio':
      return <Audio src={src} controls preload="auto" />;
    default:
      throw Error('Invalid type');
  }
};
