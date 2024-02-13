import type { FC } from 'react';

import type { StudentData } from './state';
import { formatDateTime } from 'src/formatDate';

type Props = {
  student: StudentData;
};

export const StudentDetails: FC<Props> = ({ student }) => {
  return (
    <table className="table table-bordered w-auto">
      <tbody>
        <tr><th scope="row">Name</th><td>{student.firstName} {student.lastName}</td></tr>
        <tr><th scope="row">Location</th><td>{student.province ? `${student.province.name}, ${student.country.code}` : student.country.code}</td></tr>
        <tr><th scope="row">Groups</th><td /></tr>
        <tr><th scope="row">Last Log In</th><td>{student.lastLogin ? formatDateTime(student.lastLogin) : 'never'}</td></tr>
      </tbody>
    </table>
  );
};
