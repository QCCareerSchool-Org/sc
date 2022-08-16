import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { useEffect } from 'react';

import { StateProvider } from '../providers';
import { TrackJS } from '../trackjs-isomorphic';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Layout } from '@/components/Layout';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { RouteGuard } from '@/components/RouteGuard';
import { ScrollPreventer } from '@/components/ScrollPreventer';

import '../style.scss';

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

const SCApp = ({ Component, pageProps }: AppProps): ReactElement => {
  const router = useRouter();

  useEffect(() => {
    import('bootstrap'); // load the boostrap javascript library on the client only
  }, [ router ]);

  return (
    <AppErrorBoundary>
      <ScrollPreventer />
      <StateProvider>
        <Layout>
          <RouteGuard>
            <PageErrorBoundary fallback={<ErrorFallback />}>
              <Component {...pageProps} />
            </PageErrorBoundary>
          </RouteGuard>
        </Layout>
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
