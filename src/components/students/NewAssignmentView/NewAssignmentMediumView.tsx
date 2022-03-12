import type { ReactElement } from 'react';

import type { NewAssignmentMedium } from '@/domain/newAssignmentMedium';
import { endpoint } from 'src/basePath';

type Props = {
  studentId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  newAssignmentMedium: NewAssignmentMedium;
};

export const NewAssignmentMediumView = ({ studentId, courseId, unitId, assignmentId, newAssignmentMedium }: Props): ReactElement | null => {
  if (newAssignmentMedium.type === 'image') {
    return <img src={`${endpoint}/students/${studentId}/courses/${courseId}/newUnits/${unitId}/assignment/${assignmentId}/media/${newAssignmentMedium.assignmentMediumId}/file`} alt={newAssignmentMedium.caption} />;
  }

  return null;
};
