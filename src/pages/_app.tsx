import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { useEffect } from 'react';

import { StateProvider } from '../providers';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { ErrorFallback } from '@/components/ErrorFallback';
import { Layout } from '@/components/Layout';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
import { RouteGuard } from '@/components/RouteGuard';
import { ScrollPreventer } from '@/components/ScrollPreventer';
import { TrackJS } from 'src/trackjs-isomorphic';

import '../style.scss';

if (!TrackJS.isInstalled()) {
  TrackJS.install({
    token: '0377457a8a0c41c2a11da5e34f786bba',
    application: 'react-student-center',
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
