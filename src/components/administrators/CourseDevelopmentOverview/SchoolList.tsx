import type { FC, MouseEvent } from 'react';
import { memo } from 'react';
import type { School } from '@/domain/school';

type Props = {
  schools: School[];
  onClick: (e: MouseEvent<HTMLTableRowElement>, schoolId: number) => void;
};

export const SchoolList: FC<Props> = memo(props => (
  <>
    <table className="schoolTable table table-bordered table-hover w-auto bg-white">
      <thead>
        <tr>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {props.schools.map(s => (
          <tr key={s.schoolId} onClick={e => props.onClick(e, s.schoolId)}>
            <td>{s.name}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <style jsx>{`
    .schoolTable tr { cursor: pointer }
    `}</style>
  </>
));

SchoolList.displayName = 'SchoolList';
