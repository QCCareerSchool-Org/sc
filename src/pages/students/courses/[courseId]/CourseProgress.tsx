import type { FC } from 'react';
import { memo, useMemo } from 'react';

import type { EnrollmentState, MaterialWithCompletionForm } from './state';

type Props = {
  enrollment: EnrollmentState;
};

/** the relative weight a submission compared to an assignment */
const submissionWeight = 3;

const onlyLessons = (m: MaterialWithCompletionForm): boolean => m.type === 'lesson' || m.type === 'scorm2004';

export const CourseProgress: FC<Props> = memo(({ enrollment }) => {
  const [ progress, max ] = useMemo(() => {
    let p = 0;
    for (const unit of enrollment.course.units) {
      for (const material of unit.materials.filter(onlyLessons)) {
        if (material.materialData['cmi.completion_status'] === 'completed') { // SCORM data indicated material is completed
          p++;
        } else {
          if (enrollment.materialCompletions.findIndex(c => c.materialId === material.materialId) !== -1) { // we have a materialCompletion recorded
            p++;
          }
        }
      }
    }

    return [
      p + (enrollment.newSubmissions.filter(s => s.submitted !== null).length * submissionWeight),
      enrollment.course.units.reduce((prev, u) => prev + u.materials.filter(onlyLessons).length, 0) + (enrollment.course.newSubmissionTemplates.length * submissionWeight),
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
