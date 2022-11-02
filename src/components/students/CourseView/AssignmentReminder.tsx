import type { FC } from 'react';

type Props = {
  title: string;
  description: string;
};

export const AssignmentReminder: FC<Props> = ({ title, description }) => (
  <>{title}<div dangerouslySetInnerHTML={{ __html: description }} /></>
);
