import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import type { ReactElement, ReactNode } from 'react';
import { useEffect } from 'react';

import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { ErrorFallback } from '@/components/ErrorFallback';
import { DefaultLayout } from '@/components/layouts/DefaultLayout';
import { ModalBackdrop } from '@/components/ModalBackdrop';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { RouteGuard } from '@/components/RouteGuard';
import { ScrollPreventer } from '@/components/ScrollPreventer';
import { SessionRefresh } from '@/components/SessionRefresh';
import { StateProvider } from '@/providers/index';
import { gaPageview } from 'src/lib/ga';
import { TrackJS } from 'src/trackjs-isomorphic';

import 'src/style.scss';

if (!TrackJS.isInstalled()) {
  TrackJS.install({
    token: '0377457a8a0c41c2a11da5e34f786bba',
    application: 'react-student-center',
    network: { enabled: false },
    onError: payload => {
      payload.metadata.push({
        key: 'authState',
        value: getSanitizedAuthState(),
      });
      return true;
    },
  });
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  index?: number;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const SCApp = ({ Component, pageProps }: AppPropsWithLayout): ReactElement => {
  const router = useRouter();

  useEffect(() => {
    import('bootstrap'); // load the boostrap javascript library on the client only
  }, [ router ]);

  useEffect(() => {
    const handleRouteChange = (url: string): void => {
      gaPageview(url);
    };

    // When the component is mounted, subscribe to router changes and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [ router.events ]);

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? (page => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <AppErrorBoundary>
      <ScrollPreventer />
      <StateProvider>
        <SessionRefresh />
        {getLayout(
          <RouteGuard>
            <PageErrorBoundary fallback={<ErrorFallback />}>
              <Component {...pageProps} />
            </PageErrorBoundary>
          </RouteGuard>,
        )}
        <ModalBackdrop />
      </StateProvider>
    </AppErrorBoundary>
  );
};

export default SCApp;

/** Returns a string representing the stored auth state for error logging purposes */
const getSanitizedAuthState = (): string => {
  if (window.navigator.cookieEnabled && 'localStorage' in window) {
    const storedAuthState = window.localStorage.getItem('authState');
    if (storedAuthState) {
      try {
        const authState = JSON.parse(storedAuthState) as Record<string, unknown>;
        return JSON.stringify({
          administratorId: authState.administratorId,
          auditorId: authState.auditorId,
          tutorId: authState.tutorId,
          studentId: authState.studentId,
          crmId: authState.crmId,
        });
      } catch (err) {
        return 'unable to parse stored auth state';
      }
    }
  }
  return 'no stored auth state found';
};
