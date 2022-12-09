import type { FC } from 'react';

import { CourseButton } from './CourseButton';
import { CourseLink } from './CourseLink';
import type { Course } from '@/domain/course';
import type { Enrollment } from '@/domain/enrollment';

type Props = {
  enrollments: Array<Enrollment & { course: Course }>;
};

export const CourseGrid: FC<Props> = ({ enrollments }) => (
  <div className="row">
    {enrollments.map(e => (
      <div key={e.enrollmentId} className="col-6 col-md-4 mb-4">
        <CourseLink course={e.course}>
          <CourseButton courseId={e.courseId} courseName={e.course.name} />
        </CourseLink>
      </div>
    ))}
  </div>
);
