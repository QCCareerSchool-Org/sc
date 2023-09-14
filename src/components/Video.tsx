import type { ReactEventHandler } from 'react';
import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { UAParser } from 'ua-parser-js';

import { useRefreshAndRetryMedia } from '@/hooks/useRefreshAndRetryMedia';
import { mergeRefs } from 'src/mergeRefs';

type Props = {
  controls?: boolean;
  src: string;
  poster?: string;
  captionSrc?: string;
  preload?: 'auto' | 'metadata' | 'none';
  playsInline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onPlay?: ReactEventHandler<HTMLVideoElement>;
  onTimeUpdate?: ReactEventHandler<HTMLVideoElement>;
  onEnded?: ReactEventHandler<HTMLVideoElement>;
};

export const Video = memo(forwardRef<HTMLVideoElement, Props>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const retry$ = useRefreshAndRetryMedia(videoRef);

  const [ userAgent, setUserAgent ] = useState<UAParser.IResult | undefined>(undefined);

  useEffect(() => {
    setUserAgent(UAParser());
  }, []);

  const handleError: ReactEventHandler<HTMLAudioElement> = () => {
    if (videoRef.current?.error?.code === 2) { // MEDIA_ERR_NETWORK
      retry$.next();
    }
  };

  const src = userAgent?.os.name === 'iOS' && !props.src.includes('#')
    ? `${props.src}#t=0.01`
    : props.src;

  return (
    <video
      ref={mergeRefs(ref, videoRef)}
      controls={props.controls}
      src={src}
      poster={props.poster}
      preload={props.preload}
      crossOrigin="use-credentials"
      playsInline={props.playsInline}
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
