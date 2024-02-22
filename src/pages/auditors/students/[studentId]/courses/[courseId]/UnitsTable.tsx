import type { FC } from 'react';

import type { EnrollmentData } from './state';
import { UnitsTableRow } from './UnitsTableRow';

type Props = {
  enrollment: EnrollmentData;
};

export const UnitsTable: FC<Props> = ({ enrollment }) => (
  <div className="mt-4">
    <h2>Coursse Materials</h2>
    <table className="table table-bordered w-auto">
      <thead>
        <tr>
          <th className="text-center">Unit</th>
          <th>Title</th>
          <th className="text-center">Progress</th>
        </tr>
      </thead>
      <tbody>
        {enrollment.course.units.map(u => <UnitsTableRow key={u.unitId} unit={u} materialCompletions={enrollment.materialCompletions} />)}
      </tbody>
    </table>
  </div>
);
