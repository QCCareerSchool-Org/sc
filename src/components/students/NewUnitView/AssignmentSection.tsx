import { useRouter } from 'next/router';
import type { MouseEvent, ReactElement } from 'react';

import { basePath } from '../../../basePath';
import { Section } from '@/components/Section';
import type { NewUnitWithCourseAndChildren } from '@/services/students/newUnitService';

type Props = {
  unit: NewUnitWithCourseAndChildren;
};

export const AssignmentSection = ({ unit }: Props): ReactElement | null => {
  const router = useRouter();

  const handleAssignmentClick = (e: MouseEvent<HTMLTableRowElement>, assignmentId: string): void => {
    const url = `${router.asPath}/assignments/${assignmentId}`;
    if (e.ctrlKey || e.metaKey) {
      window.open(basePath + url, '_ blank');
    } else {
      void router.push(url);
    }
  };

  return (
    <Section className="assignmentSection">
      <div className="container">
        <h2>Assignments</h2>
        {unit.description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
        <table className="table table-bordered table-hover bg-white w-auto">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {unit.newAssignments.map(a => (
              <tr key={a.assignmentId} onClick={e => handleAssignmentClick(e, a.assignmentId)} style={{ cursor: 'pointer' }}>
                <th scope="row">{a.assignmentNumber}</th>
                <td>{a.title}{a.optional && <span className="ms-1 text-danger">*</span>}</td>
                <td>{a.complete ? 'Complete' : 'Incomplete'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {unit.newAssignments.some(a => a.optional) && <p><span className="ms-1 text-danger">*</span> Optional assignment</p>}
      </div>
    </Section>
  );
};
