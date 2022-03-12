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
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`${endpoint}/students/${studentId}/courses/${courseId}/newUnits/${unitId}/assignment/${assignmentId}/media/${newAssignmentMedium.assignmentMediumId}/file`} className="mediaContent" alt={newAssignmentMedium.caption} />;
  }

  if (newAssignmentMedium.type === 'video') {
    return (
      <video controls className="mediaContent">
        <source type={newAssignmentMedium.mimeTypeId} src={`${endpoint}/students/${studentId}/courses/${courseId}/newUnits/${unitId}/assignment/${assignmentId}/media/${newAssignmentMedium.assignmentMediumId}/file`} />
      </video>
    );
  }

  if (newAssignmentMedium.type === 'audio') {
    return (
      <audio controls>
        <source type={newAssignmentMedium.mimeTypeId} src={`${endpoint}/students/${studentId}/courses/${courseId}/newUnits/${unitId}/assignment/${assignmentId}/media/${newAssignmentMedium.assignmentMediumId}/file`} />
      </audio>
    );
  }

  return null;
};
