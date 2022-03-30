import type { ReactElement, ReactEventHandler } from 'react';
import { memo, useRef, useState } from 'react';

import { useRefreshAndRetryMedia } from '@/hooks/useRefreshAndRetryMedia';

type Props = {
  controls?: boolean;
  src: string;
  preload?: 'auto' | 'metadata' | 'none';
  className?: string;
  onPlay?: ReactEventHandler<HTMLAudioElement>;
  onTimeUpdate?: ReactEventHandler<HTMLAudioElement>;
  onEnded?: ReactEventHandler<HTMLAudioElement>;
};

export const Video = memo(({ controls, src, preload, className, onPlay, onTimeUpdate, onEnded }: Props): ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const retry$ = useRefreshAndRetryMedia(videoRef);

  const videoError: ReactEventHandler<HTMLAudioElement> = e => {
    if (videoRef.current?.error?.code === 2) { // MEDIA_ERR_NETWORK
      retry$.next();
    }
  };

  return (
    <video
      ref={videoRef}
      controls={controls}
      src={src}
      preload={preload}
      className={className}
      onError={videoError}
      onPlay={onPlay}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
    >
      <p>Your browser doesn't support HTML5 video. Here is a <a href={src}>link to download the video</a> instead.</p>
    </video>
  );
});

Video.displayName = 'Video';
