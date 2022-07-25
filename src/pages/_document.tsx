import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class QCDocument extends Document {
  public render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" />
          { /* eslint-disable-next-line @next/next/no-sync-scripts */ }
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
