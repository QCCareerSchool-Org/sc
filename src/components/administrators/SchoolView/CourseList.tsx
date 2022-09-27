import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import type { Course } from '@/domain/course';

type Props = {
  courses: Course[];
  onClick: (e: MouseEvent<HTMLTableRowElement>, courseId: number) => void;
};

export const CourseList: FC<Props> = memo(props => {
  const { courses } = props;
  return (
    <>
      <table className="coursesTable table table-bordered table-hover w-auto bg-white">
        <thead>
          <tr>
            <th className="text-center">Code</th>
            <th>Name</th>
            <th className="text-center">Version</th>
            <th className="text-center">Unit Type</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.courseId} onClick={e => props.onClick(e, c.courseId)}>
              <td className="text-center">{c.code}</td>
              <td>{c.name}</td>
              <td className="text-center">{c.version}</td>
              <td className="text-center">{c.submissionType === 0 ? 'old' : c.submissionType === 1 ? 'new' : 'unknown'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
      .coursesTable tr { cursor: pointer }
      `}</style>
    </>
  );
});

CourseList.displayName = 'CourseList';
