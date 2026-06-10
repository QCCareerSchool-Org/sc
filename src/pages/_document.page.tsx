import Document, { Head, Html, Main, NextScript } from 'next/document';
import type { JSX } from 'react';

import { getGoogleAnalyticsScript, getGoogleAnalyticsSrc } from 'src/lib/marketingScripts';

const googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID;

export default class QCDocument extends Document {
  public render(): JSX.Element {
    return (
      <Html>
        <Head>
          {googleAnalyticsId && (
            <>
              <script async src={getGoogleAnalyticsSrc(googleAnalyticsId)} />
              <script dangerouslySetInnerHTML={{ __html: getGoogleAnalyticsScript(googleAnalyticsId) }} />
            </>
          )}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Great+Vibes&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
          { /* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src="https://hosted.paysafe.com/js/v1/latest/paysafe.min.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
