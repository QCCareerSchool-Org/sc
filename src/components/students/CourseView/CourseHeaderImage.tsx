import type { ReactElement, ReactEventHandler } from 'react';
import { useRef } from 'react';

import { endpoint } from '../../../basePath';
import { useRefreshAndRetryMedia } from '@/hooks/useRefreshAndRetryMedia';

type Props = {
  courseId: number;
};

export const CourseHeaderImage = ({ courseId }: Props): ReactElement => {
  const src = `${endpoint}/courseHeaderImages/${courseId}`;

  const imageRef = useRef<HTMLImageElement>(null);
  const retry$ = useRefreshAndRetryMedia(imageRef);

  const handleError: ReactEventHandler<HTMLImageElement> = () => {
    retry$.next();
  };

  return (
    <>
      <span className="wrapper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img onError={handleError} src={src} className="cover" alt="header image" />
        <div className="overlay cover" />
      </span>
      <style jsx>{`
      .wrapper {
        box-sizing: border-box;
        display: block;
        overflow: hidden;
        width: initial;
        height: initial;
        background: none;
        opacity: 1;
        border: 0;
        margin: 0;
        padding: 0;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      }
      .cover {
        position: absolute;
        inset: 0px;
        box-sizing: border-box;
        padding: 0px;
        border: none;
        margin: auto;
        display: block;
        width: 0px;
        height: 0px;
        min-width: 100%;
        max-width: 100%;
        min-height: 100%;
        max-height: 100%;
        object-fit: cover;
        object-position: center center;
      }
      .overlay {
        background-image: linear-gradient(rgba(0, 0, 0, .40), rgba(0, 0, 0, .60));
      }
      `}</style>
    </>

  );
};
