import type { AppProps } from 'next/app';
import type { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';
import { DebugWindow } from '../components/DebugWindow';

import { Layout } from '../components/Layout';
import { RouteGuard } from '../components/RouteGuard';
import { GlobalStyle } from '../GlobalStyle';
import StateProvider from '../providers';
import { theme } from '../theme';

const SCApp = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <StateProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Layout>
          <RouteGuard>
            <Component {...pageProps} />
          </RouteGuard>
        </Layout>
        {process.env.NODE_ENV === 'development' && <DebugWindow />}
      </ThemeProvider>
    </StateProvider>
  );
};

export default SCApp;
