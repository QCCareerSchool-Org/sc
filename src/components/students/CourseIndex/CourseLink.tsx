import Link from 'next/link';
import type { FC, ReactNode } from 'react';

import type { Course } from '@/domain/course';

type Props = {
  course: Course;
  children: ReactNode;
};

export const CourseLink: FC<Props> = ({ course, children }) => {
  if (course.submissionType === 1) {
    const href = `/students/courses/${course.courseId}`;
    return <Link href={href}><a>{children}</a></Link>;
  }
  const href = `/students/course-materials/new.php?course_id=${course.courseId}`;
  return <a href={href}>{children}</a>;
};
