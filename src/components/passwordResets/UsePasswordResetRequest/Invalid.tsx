import Link from 'next/link';
import type { ReactElement } from 'react';
import { memo } from 'react';

import { Section } from '@/components/Section';

type Props = {
  type: 'already used' | 'expired';
};

export const Invalid = memo(({ type }: Props): ReactElement => (
  <Section>
    <div className="container">
      {type === 'already used' && (
        <>
          <h1>Already Used</h1>
          <p className="lead">This password reset request was already used.</p>
        </>
      )}
      {type === 'expired' && (
        <>
          <h1>Expired</h1>
          <p className="lead">This password reset request is expired.</p>
        </>
      )}
      <p>If you still need to reset your password, please <Link href="/password-resets"><a>make another request</a></Link>.</p>
    </div>
  </Section>
));

Invalid.displayName = 'AlreadyUsed';
