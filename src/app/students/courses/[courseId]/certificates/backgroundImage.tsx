import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { CSSProperties, FC } from 'react';
import { memo } from 'react';

interface Props {
  src: StaticImageData;
  objectPosition?: CSSProperties['objectPosition'];
  mobile?: {
    src: StaticImageData;
    /** when to show the standard image, e.g. 'md' means show the standard image on md or larger screens */
    breakpoint: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    objectPosition?: CSSProperties['objectPosition'];
  };
  priority?: boolean;
}

type Breakpoint = NonNullable<Props['mobile']>['breakpoint'];

const breakpointWidths: Record<Breakpoint, number> = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

/**
 * Displays a background image with an option to show a different background image on small screens
 */
export const BackgroundImage: FC<Props> = memo(({ src, objectPosition, mobile, priority }) => {
  if (mobile) {
    const breakpointWidth = breakpointWidths[mobile.breakpoint];
    const standardSizes = `(min-width: ${breakpointWidth}px) 100vw, 1px`;
    const mobileSizes = `(max-width: ${breakpointWidth - 0.02}px) 100vw, 1px`;

    return (
      <>
        <div className={`position-absolute top-0 start-0 w-100 h-100 d-none d-${mobile.breakpoint}-block`}><Part src={src} objectPosition={objectPosition} priority={priority} sizes={standardSizes} /></div>
        <div className={`position-absolute top-0 start-0 w-100 h-100 d-${mobile.breakpoint}-none`}><Part src={mobile.src} objectPosition={mobile.objectPosition} priority={priority} sizes={mobileSizes} /></div>
      </>
    );
  }
  return <Part src={src} objectPosition={objectPosition} priority={priority} />;
});

BackgroundImage.displayName = 'BackgroundImage';

interface PartProps {
  src: StaticImageData;
  objectPosition: CSSProperties['objectPosition'];
  priority?: boolean;
  sizes?: string;
}

const Part: FC<PartProps> = ({ src, objectPosition, priority, sizes = '100vw' }) => <Image src={src} placeholder="blur" alt="" priority={priority} fill sizes={sizes} style={{ objectFit: 'cover', objectPosition }} />;
