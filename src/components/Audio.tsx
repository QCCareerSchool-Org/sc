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

export const Audio = memo(({ controls, src, preload, className, onPlay, onTimeUpdate, onEnded }: Props): ReactElement => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const retry$ = useRefreshAndRetryMedia(audioRef);

  const audioError: ReactEventHandler<HTMLAudioElement> = e => {
    if (audioRef.current?.error?.code === 2) { // MEDIA_ERR_NETWORK
      retry$.next();
    }
  };

  return (
    <audio
      ref={audioRef}
      controls={controls}
      src={src}
      preload={preload}
      className={className}
      onError={audioError}
      onPlay={onPlay}
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
    >
      <p>Your browser doesn't support HTML5 audio. Here is a <a href={src}>link to download the audio</a> instead.</p>
    </audio>
  );
});

Audio.displayName = 'Audio';
