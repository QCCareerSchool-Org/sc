import Link from 'next/link';
import type { FC, MouseEventHandler } from 'react';
import { Fragment, useEffect, useRef } from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';

import type { Subject } from 'rxjs';
import { AssignmentReminder } from './AssignmentReminder';
import type { NextUnitResult } from './CourseView';
import { Lesson } from './Lesson';
import { LessonBorder } from './LessonBorder';
import type { MaterialWithCompletionForm, State } from './state';
import type { MaterialCompleteEvent } from './useMaterialCompletion';
import { Spinner } from '@/components/Spinner';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { NewSubmission } from '@/domain/student/newSubmission';
import type { Unit } from '@/domain/unit';
import { useServices } from '@/hooks/useServices';
import { useUnitToggleDispatch } from '@/hooks/useUnitToggleDispatch';
import { useUnitToggleState } from '@/hooks/useUnitToggleState';
import { formatDate } from 'src/formatDate';

type Props = {
  studentId: number;
  enrollmentId: number;
  courseId: number;
  unit: Unit & {
    materials: MaterialWithCompletionForm[];
  };
  materialCompletions: MaterialCompletion[];
  materialCompletion$: Subject<MaterialCompleteEvent>;
  firstUnit: boolean;
  submission?: NewSubmission;
  nextUnit: NextUnitResult;
  onInitializeButtonClick: MouseEventHandler<HTMLButtonElement>;
  formState: State['form'];
};

const iconSize = 24;

export const UnitAccordion: FC<Props> = props => {
  const { studentId, enrollmentId, courseId, unit, materialCompletions, materialCompletion$, firstUnit, submission, nextUnit, formState } = props;
  const unitToggleState = useUnitToggleState();
  const unitToggleDispatch = useUnitToggleDispatch();
  const firstRender = useRef(true);

  const handleClick = (): void => {
    unitToggleDispatch({ type: 'TOGGLE', payload: { courseId, unitLetter: unit.unitLetter } });
  };

  // on the first render, toggle the unit if we don't have any previous toggle data
  useEffect(() => {
    if (firstRender.current && typeof unitToggleState[courseId] === 'undefined' && firstUnit) {
      console.log('calling dispatch automatically', unitToggleState);
      unitToggleDispatch({ type: 'TOGGLE', payload: { courseId, unitLetter: unit.unitLetter } });
    }
    firstRender.current = false;
  }, [ courseId, firstUnit, unit.unitLetter, unitToggleDispatch, unitToggleState ]);

  const open = !!unitToggleState[courseId]?.[unit.unitLetter];

  return (
    <>
      <div onClick={handleClick} className="d-flex justify-content-between" style={{ cursor: 'pointer' }}>
        <h3 className="h5 mb-0">Unit {unit.unitLetter}</h3>
        {open ? <AiOutlineMinusCircle size={iconSize} /> : <AiOutlinePlusCircle size={iconSize} />}
      </div>
      <Separator />
      {open && (
        <div className="my-4">
          {unit.materials.filter(m => m.type !== 'assignment').map((m, i) => {
            const complete = materialCompletions.some(mc => mc.materialId === m.materialId);
            return (
              <Fragment key={m.materialId}>
                {i > 0 && <hr />}
                {m.type === 'lesson' && <Lesson studentId={studentId} enrollmentId={enrollmentId} material={m} complete={complete} materialCompletion$={materialCompletion$} />}
                {m.type === 'assignment' && <AssignmentReminder title={m.title} description={m.description} />}
              </Fragment>
            );
          })}
          {(submission || (nextUnit.success && nextUnit.unitLetter === unit.unitLetter)) && (
            <>
              <hr />
              <LessonBorder complete={false}>
                <div className="py-4">
                  {submission
                    ? <SubmissionSection courseId={courseId} submission={submission} />
                    : (
                      <>
                        <h4 className="title h6 mb-2">Assignments</h4>
                        <p className="small">Once you've completed all of your lessons for this unit, you're ready to begin your assignments! Click the button below to get started.</p>
                        <div className="d-flex align-items-center">
                          <button onClick={props.onInitializeButtonClick} className="btn btn-primary" style={{ width: 120 }}>
                            {formState.processingState === 'initializing'
                              ? <Spinner size="sm" />
                              : <>Start</>
                            }
                          </button>
                          {formState.processingState === 'initialize error' && <span className="text-danger ms-2">{formState.errorMessage ?? 'initializing'}</span>}
                        </div>
                      </>
                    )
                  }
                </div>
              </LessonBorder>
            </>
          )}
        </div>
      )}
      <style jsx>{`
      @media (min-width: 992px) {
        .title {
           font-size: 1.25rem;
        }
      }
      @media (min-width: 1400px) {
        .title {
           font-size: 1.25rem;
        }
      }
      `}</style>
    </>
  );
};

const Separator: FC = () => (
  <>
    <hr className="unitSeparator" />
    <style jsx>{`
      .unitSeparator {
        opacity: 1;
        border-top:0;
        border-left:0;
        border-bottom: 2px solid #c70c27;
        border-right:0;
      }
    `}</style>
  </>
);

type SubmissionSectionProps = {
  courseId: number;
  submission: NewSubmission;
};

const SubmissionSection: FC<SubmissionSectionProps> = props => {
  const { courseId, submission } = props;
  const { gradeService } = useServices();

  const grade = submission.mark === null ? null : gradeService.calculate(submission.mark, submission.points, submission.created);

  return (
    <>
      <h4 className="title h6 mb-2">Submission {submission.unitLetter}{submission.title && <>: {submission.title}</>}</h4>

      <p className="lead">
        Status: {submission.closed
          ? <>Marked {formatDate(submission.closed)}</>
          : submission.submitted
            ? <>{submission.skipped ? 'Skipped' : 'Submitted'} {formatDate(submission.submitted)}</>
            : <>In Progress</>
        }

        {submission.closed && grade !== null && <><br />Grade: {grade}</>}
      </p>

      <Link href={`${courseId}/submissions/${submission.submissionId}`}><a className="btn btn-primary">View</a></Link>
    </>
  );
};
