import type { FC, ReactEventHandler } from 'react';
import { memo, useRef } from 'react';

import { useRefreshAndRetryMedia } from '@/hooks/useRefreshAndRetryMedia';

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export const Img: FC<Props> = memo(({ src, alt, className }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const retry$ = useRefreshAndRetryMedia(imageRef);

  const handleError: ReactEventHandler<HTMLImageElement> = () => {
    retry$.next();
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={handleError} className={className} />
  );
});

Img.displayName = 'Img';
