import type { FC } from 'react';
import { memo, useMemo } from 'react';

import type { NewSubmission } from '@/domain/auditor/newSubmission';
import type { Course } from '@/domain/course';
import type { Enrollment } from '@/domain/enrollment';
import type { Material } from '@/domain/material';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { NewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { Unit } from '@/domain/unit';

type Props = {
  enrollment: Enrollment & {
    course: Course & {
      units: Array<Unit & {
        materials: Array<Material & {
          materialData: Record<string, string>;
        }>;
      }>;
      newSubmissionTemplates: NewSubmissionTemplate[];
    };
    newSubmissions: NewSubmission[];
    materialCompletions: MaterialCompletion[];
  };
};

/** the relative weight a submission compared to an assignment */
const submissionWeight = 3;

const onlyLessons = (m: Material): boolean => m.type === 'lesson' || m.type === 'scorm2004';

export const CourseProgress: FC<Props> = memo(({ enrollment }) => {
  const [ progress, max ] = useMemo(() => {
    let p = 0;
    for (const unit of enrollment.course.units) {
      for (const material of unit.materials.filter(onlyLessons)) {
        if (material.materialData['cmi.completion_status'] === 'completed' || // SCORM data indicates material is completed
          enrollment.materialCompletions.findIndex(c => c.materialId === material.materialId) !== -1 // we have a matching MaterialCompletion
        ) {
          p++;
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
    <div className="progress" style={{ height: '1.25rem' }} role="progressbar" aria-label="Lesson Progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={max}>
      <div className="progress-bar" style={{ width: `${percentage}%` }}>{percentage}%</div>
    </div>
  );
});

CourseProgress.displayName = 'CourseProgress';
