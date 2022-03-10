import { memo, ReactElement } from 'react';

import type { NewUnitWithCourseAndChildren } from '@/services/students/newUnitService';

type Props = {
  unit: NewUnitWithCourseAndChildren;
};

export const NewUnitStatus = memo(({ unit }: Props): ReactElement | null => {
  if (unit.marked) {
    return (
      <div className="alert alert-success">
        <h5>Unit Marked</h5>
        <p className="fw-bold">Your unit has been marked. Please listen to your tutor's audio feedback below.</p>
        <audio controls preload="meta">
          <source src="http://google.com/askldjhsakjdh" type="audio/mpeg" />
        </audio>
      </div>
    );
  }

  if (unit.skipped) {
    return (
      <div className="alert alert-info">
        <h5>Unit Skipped</h5>
        <p className="fw-bold mb-0">This unit has been skipped. You won't receive a grade for this unit.</p>
      </div>
    );
  }

  if (unit.submitted) {
    return (
      <div className="alert alert-success">
        <h5>Unit Submitted</h5>
        <p className="fw-bold mb-0">Your unit has been submitted to your tutor. Please check back in a few days to review your tutor's audio feeback.</p>
      </div>
    );
  }

  if (unit.adminComment) {
    return (
      <>
        <div className="alert alert-danger">
          <h5>Unit Has Been Returned</h5>
          <p className="fw-bold">Your unit has been returned by your tutor for changes. Please review the comments below, make the required changes, and then resubmit your unit.</p>
          <div className="ms-4 mt-4 comments">
            {unit.adminComment.replace(/\r\n/gu, '\n').split('\n\n').map((line, i) => <p key={i} className="fst-italic">{line}</p>)}
          </div>
        </div>
        <style jsx>{`
          .comments > p:last-of-type { margin-bottom: 0; }
        `}</style>
      </>
    );
  }

  return (
    <div className="alert alert-info">
      <h5>Unit in Progress</h5>
      <p className="fw-bold mb-0">Your unit is currently in progress. Once the assignments below are complete, please submit your unit to your tutor using the &ldquo;Submit Unit&rdquo; button below.</p>
    </div>
  );
});

NewUnitStatus.displayName = 'NewUnitStatus';
