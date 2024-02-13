import type { FC } from 'react';
import { Section } from '@/components/Section';

type Props = {
  auditorId: number;
};

export const ChangeEmailAddress: FC<Props> = ({ auditorId }) => {
  return (
    <Section>
      <div className="container">
        <h1>Change Email Address</h1>
      </div>
    </Section>
  );
};
