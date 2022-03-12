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
  const src = `${endpoint}/students/${studentId}/courses/${courseId}/newUnits/${unitId}/assignments/${assignmentId}/media/${newAssignmentMedium.assignmentMediumId}/file`;

  if (newAssignmentMedium.type === 'image') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} className="mediaContent" alt={newAssignmentMedium.caption} />;
  }

  if (newAssignmentMedium.type === 'video') {
    return (
      <video controls className="mediaContent">
        <source type={newAssignmentMedium.mimeTypeId} src={src} />
      </video>
    );
  }

  if (newAssignmentMedium.type === 'audio') {
    return (
      <audio controls>
        <source type={newAssignmentMedium.mimeTypeId} src={src} />
      </audio>
    );
  }

  return null;
};
