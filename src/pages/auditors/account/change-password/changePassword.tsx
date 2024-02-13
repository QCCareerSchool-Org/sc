import type { FC } from 'react';
import { Section } from '@/components/Section';

type Props = {
  auditorId: number;
};

export const ChangePassword: FC<Props> = ({ auditorId }) => {
  return (
    <Section>
      <div className="container">
        <h1>Change Password</h1>
      </div>
    </Section>
  );
};
