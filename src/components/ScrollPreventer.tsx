import Script from 'next/script';
import type { ReactElement } from 'react';

export const ScrollPreventer = (): ReactElement => {
  return <Script id="scrollScript">{`window.history.scrollRestoration = "manual"`}</Script>;
};
