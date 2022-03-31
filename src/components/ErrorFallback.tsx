import Link from 'next/link';
import type { ReactElement } from 'react';

export const ErrorFallback = (): ReactElement => (
  <section>
    <div className="container">
      <h1>An Error Has Occurred</h1>
      <p className="lead">Please click the button below or try refreshing the page.</p>
      <Link href="/"><a><button className="btn btn-primary">Reload</button></a></Link>
    </div>
  </section>
);
