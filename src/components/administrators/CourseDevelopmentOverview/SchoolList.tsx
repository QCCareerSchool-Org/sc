import type { MouseEvent, ReactElement } from 'react';
import type { School } from '@/domain/index';

type Props = {
  schools: School[];
  schoolRowClick: (e: MouseEvent<HTMLTableRowElement>, schoolId: number) => void;
};

export const SchoolList = ({ schools, schoolRowClick }: Props): ReactElement => (
  <>
    <table id="schoolTable" className="table table-bordered table-hover w-auto bg-white">
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {schools.map(s => (
          <tr key={s.schoolId} onClick={e => schoolRowClick(e, s.schoolId)}>
            <td>{s.name}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <style jsx>{`
      #schoolTable tr { cursor: pointer }
    `}</style>
  </>
);
