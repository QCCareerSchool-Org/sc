import type { FC } from 'react';
import { Fragment, useEffect, useRef } from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';

import type { Subject } from 'rxjs';
import { AssignmentReminder } from './AssignmentReminder';
import { Lesson } from './Lesson';
import type { MaterialWithCompletionForm } from './state';
import type { MaterialCompleteEvent } from './useMaterialCompletion';
import type { MaterialCompletion } from '@/domain/materialCompletion';
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
};

const iconSize = 24;

export const UnitAccordion: FC<Props> = ({ studentId, enrollmentId, courseId, unit, materialCompletions, materialCompletion$, firstUnit }) => {
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
          {unit.materials.map((m, i) => {
            const complete = materialCompletions.some(mc => mc.materialId === m.materialId);
            return (
              <Fragment key={m.materialId}>
                {i > 0 && <hr />}
                {m.type === 'lesson' && <Lesson studentId={studentId} enrollmentId={enrollmentId} material={m} complete={complete} materialCompletion$={materialCompletion$} />}
                {m.type === 'assignment' && <AssignmentReminder title={m.title} description={m.description} />}
              </Fragment>
            );
          })}
        </div>
      )}
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
