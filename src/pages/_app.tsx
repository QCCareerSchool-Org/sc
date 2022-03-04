import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';

import { DebugWindow } from '../components/DebugWindow';
import { Layout } from '../components/Layout';
import { RouteGuard } from '../components/RouteGuard';
import StateProvider from '../providers';

import '../style.scss';

const SCApp = ({ Component, pageProps }: AppProps): ReactElement => {
  const router = useRouter();

  useEffect(() => {
    import('bootstrap');

    // stop Next.js's automatic scrolling to top when hitting the back button
    router.beforePopState(state => {
      state.options.scroll = false;
      return true;
    });
  }, [ router ]);

  return (
    <StateProvider>
      <Layout>
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </Layout>
      {/* {process.env.NODE_ENV === 'development' && <DebugWindow />} */}
    </StateProvider>
  );
};

export default SCApp;
