import type { ReactElement, ReactEventHandler } from 'react';
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

export const Video = memo((props: Props): ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const retry$ = useRefreshAndRetryMedia(videoRef);

  const handleError: ReactEventHandler<HTMLAudioElement> = () => {
    if (videoRef.current?.error?.code === 2) { // MEDIA_ERR_NETWORK
      retry$.next();
    }
  };

  return (
    <video
      ref={videoRef}
      controls={props.controls}
      src={props.src}
      preload={props.preload}
      className={props.className}
      onError={handleError}
      onPlay={props.onPlay}
      onTimeUpdate={props.onTimeUpdate}
      onEnded={props.onEnded}
    >
      <p>Your browser doesn't support HTML5 video. Here is a <a href={props.src}>link to download the video</a> instead.</p>
    </video>
  );
});

Video.displayName = 'Video';
