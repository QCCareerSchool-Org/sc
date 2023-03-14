import type { FC } from 'react';
import { endpoint } from 'src/basePath';

type Props = {
  courseId: number;
  courseName: string;
};

export const CourseButton: FC<Props> = ({ courseId, courseName }) => {
  const src = `${endpoint}/courseIconImages/${courseId}`;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={courseName} className="shadow" style={{ width: '100%', height: 'auto' }} />;
};
