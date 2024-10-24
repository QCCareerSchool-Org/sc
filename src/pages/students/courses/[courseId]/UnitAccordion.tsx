import type { FC, MouseEventHandler } from 'react';
import { useEffect, useRef } from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import type { Subject } from 'rxjs';

import type { NextUnitResult } from './CourseView';
import { EmptySubmissionSection } from './EmptySubmissionSection';
import { Lesson } from './Lesson';
import { Separator } from './Separator';
import type { MaterialWithCompletionForm, State } from './state';
import { SubmissionSection } from './SubmissionSection';
import { UnitAccordionSectionPadding } from './UnitAccordionSectionPadding';
import type { MaterialCompleteEvent } from './useMaterialCompletion';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { NewSubmission } from '@/domain/student/newSubmission';
import type { Unit } from '@/domain/unit';
import { useUnitToggleDispatch } from '@/hooks/useUnitToggleDispatch';
import { useUnitToggleState } from '@/hooks/useUnitToggleState';

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
            {unit.materials.filter(m => m.type !== 'assignment').map((m, i, a) => (
              <Lesson key={m.materialId} studentId={studentId} enrollmentId={enrollmentId} courseId={courseId} material={m} materialCompletion$={materialCompletion$} last={i === a.length - 1} />
            ))}
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
