import type { FC } from 'react';

type Props = {
  courseId: number;
  courseName: string;
};

export const CourseButton: FC<Props> = ({ courseId, courseName }) => {
  const src = '';
  return <img src={src} alt={courseName} />;
};
