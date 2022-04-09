import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class QCDocument extends Document {
  public render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:300,400,500,700,300italic,400italic,500italic,700italic|Material+Icons&display=swap" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
