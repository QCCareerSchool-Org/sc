import type { FC } from 'react';
import { memo, useMemo } from 'react';

import type { EnrollmentState } from './state';

type Props = {
  enrollment: EnrollmentState;
};

export const CourseProgress: FC<Props> = memo(({ enrollment }) => {
  const [ progress, max ] = useMemo(() => {
    // const uniqueSubmissions = enrollment.newSubmissions.filter((item, pos, arr) => arr.findIndex(v => v.unitLetter === item.unitLetter) === pos);
    return [
      enrollment.materialCompletions.length + enrollment.newSubmissions.filter(s => s.submitted !== null).length,
      enrollment.course.units.reduce((prev, u) => prev + u.materials.filter(m => m.type === 'lesson').length, 0) + enrollment.course.newSubmissionTemplates.length,
    ];
  }, [ enrollment ]);

  if (max <= 0) {
    return null;
  }

  const percentage = Math.round(progress / max * 100);

  return (
    <>
      <div className="mt-4">
        <p className="lead mb-1">Course Progress</p>
        <div className="progress" style={{ height: '1.25rem' }} role="progressbar" aria-label="Lesson Progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={max}>
          <div className="progress-bar" style={{ width: `${percentage}%` }}>{percentage}%</div>
        </div>
      </div>
    </>
  );
});

CourseProgress.displayName = 'CourseProgress';
