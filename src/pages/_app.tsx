import type { AppProps } from 'next/app';
import { ReactElement, useEffect } from 'react';

import { DebugWindow } from '../components/DebugWindow';
import { Layout } from '../components/Layout';
import { RouteGuard } from '../components/RouteGuard';
import StateProvider from '../providers';

import '../style.scss';

const SCApp = ({ Component, pageProps }: AppProps): ReactElement => {
  useEffect(() => {
    import('bootstrap');
  }, []);

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
