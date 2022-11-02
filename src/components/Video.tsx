import type { ReactEventHandler } from 'react';
import { forwardRef, memo, useRef } from 'react';

import { useRefreshAndRetryMedia } from '@/hooks/useRefreshAndRetryMedia';
import { mergeRefs } from 'src/mergeRefs';

type Props = {
  controls?: boolean;
  src: string;
  poster?: string;
  captionSrc?: string;
  preload?: 'auto' | 'metadata' | 'none';
  className?: string;
  style?: React.CSSProperties;
  onPlay?: ReactEventHandler<HTMLVideoElement>;
  onTimeUpdate?: ReactEventHandler<HTMLVideoElement>;
  onEnded?: ReactEventHandler<HTMLVideoElement>;
};

export const Video = memo(forwardRef<HTMLVideoElement, Props>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const retry$ = useRefreshAndRetryMedia(videoRef);

  const handleError: ReactEventHandler<HTMLAudioElement> = () => {
    if (videoRef.current?.error?.code === 2) { // MEDIA_ERR_NETWORK
      retry$.next();
    }
  };

  return (
    <video
      ref={mergeRefs(ref, videoRef)}
      controls={props.controls}
      src={props.src}
      poster={props.poster}
      preload={props.preload}
      className={props.className}
      onError={handleError}
      onPlay={props.onPlay}
      onTimeUpdate={props.onTimeUpdate}
      onEnded={props.onEnded}
      style={props.style}
    >
      {props.captionSrc && <track srcLang="en" src={props.captionSrc} kind="subtitle" label="English" />}
      <p>Your browser doesn't support HTML5 video. Here is a <a href={props.src}>link to download the video</a> instead.</p>
    </video>
  );
}));

Video.displayName = 'Video';
