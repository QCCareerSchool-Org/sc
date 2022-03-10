import type { MouseEvent, ReactElement } from 'react';
import { memo } from 'react';

import type { Course } from '@/domain/course';

type Props = {
  courses: Course[];
  courseRowClick: (e: MouseEvent<HTMLTableRowElement>, courseId: number) => void;
};

export const CourseList = memo(({ courses, courseRowClick }: Props): ReactElement => (
  <>
    <table id="coursesTable" className="table table-bordered table-hover w-auto bg-white">
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
          <tr key={c.courseId} onClick={e => courseRowClick(e, c.courseId)}>
            <td className="text-center">{c.code}</td>
            <td>{c.name}</td>
            <td className="text-center">{c.version}</td>
            <td className="text-center">{c.unitType === 0 ? 'old' : c.unitType === 1 ? 'new' : 'unknown' }</td>
          </tr>
        ))}
      </tbody>
    </table>

    <style jsx>{`
      #coursesTable tr { cursor: pointer }
    `}</style>
  </>
));

CourseList.displayName = 'CourseList';
