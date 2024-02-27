import Image from 'next/image';
import Link from 'next/link';
import type { FC, MouseEventHandler } from 'react';
import { Fragment, useEffect, useRef } from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';

import type { Subject } from 'rxjs';
import type { NextUnitResult } from './CourseView';
import { Lesson } from './Lesson';
import { MaterialButton } from './MaterialButton';
import PagesIcon from './pages.svg';
import type { MaterialWithCompletionForm, State } from './state';
import { UnitAccordionSectionPadding } from './UnitAccordionSectionPadding';
import type { MaterialCompleteEvent } from './useMaterialCompletion';
import { Spinner } from '@/components/Spinner';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { NewSubmission } from '@/domain/student/newSubmission';
import type { Unit } from '@/domain/unit';
import { useScreenWidth } from '@/hooks/useScreenWidth';
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
  expired: boolean;
  submission?: NewSubmission;
  nextUnit: NextUnitResult;
  assignmentsDisabled: boolean;
  onInitializeButtonClick: MouseEventHandler<HTMLButtonElement>;
  formState: State['form'];
};

const iconSize = 24;

export const UnitAccordion: FC<Props> = props => {
  const { studentId, enrollmentId, courseId, unit, materialCompletions, materialCompletion$, firstUnit, submission, nextUnit, assignmentsDisabled, formState } = props;
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
        <h3 className="h5 mb-0">{unit.title ? <><strong>Unit {unit.unitLetter}:</strong> {unit.title}</> : <><strong>Unit {unit.unitLetter}</strong></>}</h3>
        {open ? <AiOutlineMinusCircle size={iconSize} /> : <AiOutlinePlusCircle size={iconSize} />}
      </div>
      <Separator />
      {open
        ? (
          <div className="mb-4">
            {unit.materials.filter(m => m.type !== 'assignment').map((m, i, a) => {
              const complete = materialCompletions.some(mc => mc.materialId === m.materialId);
              return (
                <Lesson key={m.materialId} studentId={studentId} enrollmentId={enrollmentId} courseId={courseId} material={m} complete={complete} materialCompletion$={materialCompletion$} last={i === a.length - 1} />
              );
            })}
            {(submission || (!assignmentsDisabled && nextUnit.success && nextUnit.unitLetter === unit.unitLetter)) && (
              <div className="container assignmentContainer">
                <UnitAccordionSectionPadding>
                  {submission
                    ? <SubmissionSection courseId={courseId} unitLetter={unit.unitLetter} submission={submission} />
                    : <EmptySubmissionSection unitLetter={unit.unitLetter} formState={formState} expired={props.expired} onInitializeButtonClick={props.onInitializeButtonClick} />
                  }
                </UnitAccordionSectionPadding>
              </div>
            )}
          </div>
        )
        : <div style={{ height: '1rem' }} />
      }
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
      .assignmentContainer {
        background: black;
        color: white;
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
        margin-bottom: 0;
      }
    `}</style>
  </>
);

type SubmissionSectionProps = {
  courseId: number;
  unitLetter: string;
  submission: NewSubmission;
};

const SubmissionSection: FC<SubmissionSectionProps> = props => {
  const { courseId, submission } = props;
  const { gradeService } = useServices();
  const screenWidth = useScreenWidth();
  const lg = screenWidth >= 992;

  const grade = submission.mark === null ? null : gradeService.calculate(submission.mark, submission.points, submission.created);

  return (
    <>
      <div className="d-flex align-items-center">
        <div className="assignmentsLeft">
          {submission.closed === null
            ? <Image src={PagesIcon} alt="Assignments" />
            : <GreenCircleCheck />
          }
        </div>
        <div className="assignmentsCenter">
          <h4 className="title h6 mb-2">Assignments Unit {props.unitLetter}{lg && submission.title && <span className="fw-normal">: {submission.title}</span>}</h4>
          {submission.description && (
            <div className="mb-2">
              {submission.description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="small mb-0">{p}</p>)}
            </div>
          )}
          <p className="mb-0">
            {submission.closed
              ? <><span className="markedGreen fw-bold">Completed</span>{grade !== null && <> | Grade {grade}</>}</>
              : submission.submitted
                ? <><span className="text-primary fw-bold">{submission.skipped ? 'Skipped' : 'Submitted'}</span> | {formatDate(submission.submitted)}</>
                : <><span className="text-primary fw-bold">Started</span> | {formatDate(submission.created)}</>
            }
          </p>
          {!lg && (
            <div className="mt-4">
              <Link href={`${courseId}/submissions/${submission.submissionId}`}><a><MaterialButton color="blue">View Assignments</MaterialButton></a></Link>
            </div>
          )}
        </div>
        {lg && (
          <div className="assignmentsRight">
            <Link href={`${courseId}/submissions/${submission.submissionId}`}><a><MaterialButton color="blue">View Assignments</MaterialButton></a></Link>
          </div>
        )}
      </div>
      <style jsx>{`
      .markedGreen {
        color: #2dcb70;
      }
      .title {
        font-size: 1.25rem;
      }
      .assignmentsLeft {
        display: flex;
        width: 100px;
        justify-content: center;
        margin-right: 0.5rem;
      }
      .assignmentsRight {
        width: 185px;
        text-align: right;
        margin-left: 0.5rem;
      }
      .assignmentsCenter {
        width: calc(100% - 100px - 1rem);
        margin-left: 0.5rem;
      }
      @media (min-width: 992px) {
        .assignmentsLeft {
          width: 150px;
        }
        .assignmentsCenter {
          width: calc(100% - 150px - 185px - 2rem);
          margin-right: 0.5rem;
        }
      }
      `}</style>
    </>
  );
};

const GreenCircleCheck: FC = () => (
  <>
    <div className="greenCircleCheck" />
    <style jsx>{`
      .greenCircleCheck {
        display: inline-block;
        width: 3rem;
        height: 3rem;
        border-radius: 1.5rem;
        background-color: #2dcb70;
        border-color: #2dcb70;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m5.5 10 3 3 6-6'/%3e%3c/svg%3e");
        color: white;
      }
    `}</style>
  </>
);

type EmptySubmissionSectionProps = {
  unitLetter: string;
  formState: State['form'];
  expired: boolean;
  onInitializeButtonClick: MouseEventHandler;
};

const EmptySubmissionSection: FC<EmptySubmissionSectionProps> = props => {
  const buttonDisabled = props.expired || props.formState.processingState === 'initializing';

  return (
    <div className="d-flex">
      <div className="assignmentsLeft">
        <Image src={PagesIcon} alt="Assignments" />
      </div>
      <div className="assignmentsCenter">
        <h4 className="title h6 mb-2">Assignments Unit {props.unitLetter}</h4>
        <p className="small">Once you've completed all of your lessons for this unit, you're ready to begin your assignments! Click the button below to get started.</p>
        <div className="d-flex align-items-center">
          <button onClick={props.onInitializeButtonClick} className="btn btn-primary" style={{ width: 120 }} disabled={buttonDisabled}>
            {props.formState.processingState === 'initializing'
              ? <Spinner size="sm" />
              : <>Start</>
            }
          </button>
          {props.formState.processingState === 'initialize error' && <span className="text-danger ms-2">{props.formState.errorMessage ?? 'initializing'}</span>}
        </div>
      </div>
      <style jsx>{`
      .title {
        font-size: 1.25rem;
      }
      .assignmentsLeft {
        width: 150px;
        display: flex;
        justify-content: center;
        margin-right: 0.5rem;
      }
      .assignmentsCenter {
        width: calc(100% - 150px - 1rem);
        margin-left: 0.5rem;
      }
      `}</style>
    </div>
  );
};
