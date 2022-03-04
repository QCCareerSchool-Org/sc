import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';

import { Layout } from '../components/Layout';
import { RouteGuard } from '../components/RouteGuard';
import { StateProvider } from '../providers';
import { ScrollPreventer } from '@/components/ScrollPreventer';

import '../style.scss';

const SCApp = ({ Component, pageProps }: AppProps): ReactElement => {
  const router = useRouter();

  useEffect(() => {
    import('bootstrap'); // load the boostrap javascript library on the client only
  }, [ router ]);

  return (
    <>
      <ScrollPreventer />
      <StateProvider>
        <Layout>
          <RouteGuard>
            <Component {...pageProps} />
          </RouteGuard>
        </Layout>
      </StateProvider>
    </>
  );
};

export default SCApp;
