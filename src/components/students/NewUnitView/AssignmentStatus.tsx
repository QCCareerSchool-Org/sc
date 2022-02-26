import { ReactElement } from 'react';

import type { NewUnitWithAssignments } from '@/services/students';

type Props = {
  unit: NewUnitWithAssignments;
};

export const AssignmentStatus = ({ unit }: Props): ReactElement | null => {
  if (unit.marked) {
    return (
      <>
        <p className="lead">Your unit is marked.</p>
        <audio preload="meta">
          <source src="" type="audio/mpeg" />
        </audio>
      </>
    );
  }

  if (unit.submitted) {
    return (
      <>
        <p className="lead">Your unit has been submitted to your tutor.</p>
        <p>Please check back in a few days to review your tutor's audio feeback.</p>
      </>
    );
  }

  if (unit.adminComment) {
    return (
      <>
        <p className="lead">Your unit has been returned by your tutor for changes.</p>
        <p>Please review the comments below, make the required changes and resubmit your unit.</p>
        {unit.adminComment && (
          <div className="alert alert-danger">
            {unit.adminComment.split('\n').map(line => <>{line}<br /></>)}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <p className="lead">Your unit is currently in progress.</p>
      <p>When you are ready, please submit your unit to your tutor using the button below.</p>
    </>
  );
};
