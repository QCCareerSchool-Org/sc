import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { useStudentServices } from '@/hooks/useStudentServices';

type Props = {
  crmId: number;
};

export const AccountView = ({ crmId }: Props): ReactElement | null => {
  const { crmStudentService } = useStudentServices();

  useEffect(() => {
    crmStudentService.getCRMStudent(crmId).subscribe(console.log);
  }, [ crmId, crmStudentService ]);

  return null;
};
