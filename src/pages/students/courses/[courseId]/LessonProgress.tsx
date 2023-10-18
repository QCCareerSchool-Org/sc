import type { FC } from 'react';
import { memo, useMemo } from 'react';

import type { EnrollmentState } from './state';

type Props = {
  enrollment: EnrollmentState;
};

export const LessonProgress: FC<Props> = memo(({ enrollment }) => {
  const [ progress, max ] = useMemo(() => {
    return [
      enrollment.materialCompletions.length,
      enrollment.course.units.reduce((prev, u) => prev + u.materials.filter(m => m.type === 'lesson').length, 0),
    ];
  }, [ enrollment ]);

  if (max === 0) {
    return null;
  }

  const ratio = Math.round(progress / max * 100);

  return (
    <>
      <p className="lead mb-1 mt-4">Lesson Progress</p>
      <div className="progress" role="progressbar" aria-label="Lesson Progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={max}>
        <div className="progress-bar" style={{ width: `${ratio}%` }} />
      </div>
    </>
  );
});

LessonProgress.displayName = 'LessonProgress';
