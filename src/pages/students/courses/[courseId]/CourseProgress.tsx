import type { FC } from 'react';
import { memo, useMemo } from 'react';

import type { EnrollmentState, MaterialWithCompletionForm } from './state';

type Props = {
  enrollment: EnrollmentState;
  onProgressResetDismissed: () => void;
};

/** the relative weight a submission compared to an assignment */
const submissionWeight = 3;

const onlyLessons = (m: MaterialWithCompletionForm): boolean => m.type === 'lesson' || m.type === 'scorm2004';

export const CourseProgress: FC<Props> = memo(props => {
  const [ progress, max ] = useMemo(() => {
    let p = 0;
    for (const unit of props.enrollment.course.units) {
      for (const material of unit.materials.filter(onlyLessons)) {
        if (material.materialData['cmi.completion_status'] === 'completed') { // SCORM data indicated material is completed
          p++;
        } else {
          if (props.enrollment.materialCompletions.findIndex(c => c.materialId === material.materialId) !== -1) { // we have a materialCompletion recorded
            p++;
          }
        }
      }
    }

    return [
      p + (props.enrollment.newSubmissions.filter(s => s.submitted !== null).length * submissionWeight),
      props.enrollment.course.units.reduce((prev, u) => prev + u.materials.filter(onlyLessons).length, 0) + (props.enrollment.course.newSubmissionTemplates.length * submissionWeight),
    ];
  }, [ props.enrollment ]);

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
        {(!(props.enrollment.metadata.find(m => m.name === 'progressResetDismissed')?.value === '1')) && props.enrollment.course.code === 'DG' && props.enrollment.course.version === 2 && props.enrollment.enrollmentDate && props.enrollment.enrollmentDate < new Date(Date.UTC(2024, 3, 12)) && (
          <div className="alert alert-success alert-dismissible fade show mt-4">
            <p>Exciting news! We have updated our lesson format to track your course progress automatically. Your place in the lesson will now be saved so you can return to where you left off, and your progress bar will update automatically as you complete your lessons!</p>
            <p className="mb-0">As a result, your progress bar may show that you have not completed the lessons in this new format. <strong>Please rest assured that our system tracks your course completion separately. This update does not mean that you have lost your work and will not affect your current progress in any way.</strong></p>
            <button onClick={props.onProgressResetDismissed} type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" />
          </div>
        )}
      </div>
    </>
  );
});

CourseProgress.displayName = 'CourseProgress';
