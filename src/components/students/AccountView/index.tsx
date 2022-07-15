import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { useStudentServices } from '@/hooks/useStudentServices';

type Props = {
  studentId: number;
};

export const AccountView = ({ studentId }: Props): ReactElement | null => {
  const { crmStudentService } = useStudentServices();

  useEffect(() => {
    crmStudentService.getCRMStudent(studentId).subscribe(console.log);
  }, [ studentId, crmStudentService ]);

  return null;
};
