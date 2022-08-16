import type { FC, ReactEventHandler } from 'react';
import { memo, useRef } from 'react';

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

export const Audio: FC<Props> = memo(props => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const retry$ = useRefreshAndRetryMedia(audioRef);

  const handleError: ReactEventHandler<HTMLAudioElement> = () => {
    if (audioRef.current?.error?.code === 2) { // MEDIA_ERR_NETWORK
      retry$.next();
    }
  };

  return (
    <audio
      ref={audioRef}
      controls={props.controls}
      src={props.src}
      preload={props.preload}
      className={props.className}
      onError={handleError}
      onPlay={props.onPlay}
      onTimeUpdate={props.onTimeUpdate}
      onEnded={props.onEnded}
    >
      <p>Your browser doesn't support HTML5 audio. Here is a <a href={props.src}>link to download the audio</a> instead.</p>
    </audio>
  );
});

Audio.displayName = 'Audio';
