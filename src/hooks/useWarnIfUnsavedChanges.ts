/**
 * See https://github.com/vercel/next.js/issues/2476
 * // hack--restore the history
 *  const state = lastHistory.current?.state;
 *  if (state !== null && window.history.state !== null && state.idx !== window.history.state.idx) {
 *    window.history.go(state.idx > window.history.state.idx ? -1 : 1);
 *  }
 */

import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

export const useWarnIfUnsavedChanges = (notSaved: boolean, message = 'Changes you made may not be saved.'): void => {
  const router = useRouter();
  const popStateAlreadyChecked = useRef(false);
  const lastHistory = useRef<History>();

  useEffect(() => {
    // make a copy of the history so we can restore the url in beforePopStateCallback
    lastHistory.current = { ...window.history, state: { ...window.history.state, options: { ...window.history.state.options } } };

    if (notSaved) {
      // For reloading the page or leaving the site
      const beforeUnloadHandler = (e: BeforeUnloadEvent): string => {
        (e || window.event).returnValue = message; // Gecko + IE
        return message; // Safari, Chrome, and other WebKit-derived browsers
      };

      // back or forward button, manual url change, but not clicking a Next/Link
      const beforePopStateCallback = (s: any): boolean => {
        if (!confirm(message)) {
          // restore the url (TODO: this messes up the foward button)
          window.history.pushState(lastHistory.current, '', lastHistory.current?.state.as);

          return false;
        }
        popStateAlreadyChecked.current = true;
        return true;
      };

      // Next.js route changes such as clicking Next/Link, but also back or forward buttons and manual url changes
      const routeChangeStartHandler = (url: string): void => {
        if (!popStateAlreadyChecked.current) { // skip if we already agreed to navigate in beforePopStateCallback
          if (router.pathname !== url && !confirm(message)) {
            router.events.emit('routeChangeError');

            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
          }
        }
        popStateAlreadyChecked.current = false;
      };

      router.beforePopState(beforePopStateCallback);
      router.events.on('routeChangeStart', routeChangeStartHandler);
      window.addEventListener('beforeunload', beforeUnloadHandler);

      return () => {
        router.beforePopState(() => true);
        router.events.off('routeChangeStart', routeChangeStartHandler);
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    }
  }, [ notSaved, message, router ]);
};
