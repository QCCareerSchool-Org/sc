import type { FC } from 'react';
import { Section } from '../Section';

export const DatabaseLinkError: FC = () => (
  <Section>
    <div className="container">
      <h1>Database Link Error</h1>
      <p className="lead">No database link detected.</p>
    </div>
  </Section>
);
