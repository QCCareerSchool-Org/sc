import Script from 'next/script';
import type { FC } from 'react';

export const ScrollPreventer: FC = () => {
  return <Script id="scrollScript">{`window.history.scrollRestoration = "manual"`}</Script>;
};
