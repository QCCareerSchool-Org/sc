import type { FC } from 'react';

import type { EnrollmentData } from './state';
import { useServices } from '@/hooks/useServices';

type Props = {
  enrollment: EnrollmentData;
};

export const UnitsTable: FC<Props> = ({ enrollment }) => {
  const { gradeService } = useServices();

  return (
    <div className="mt-4">
      <h2>Units</h2>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th className="text-center">Unit</th>
            <th>Title</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          {enrollment.course.units.map(u => (
            <tr key={u.unitId}>
              <td className="text-center">{u.unitLetter}</td>
              <td>{u.title}</td>
              <td />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
