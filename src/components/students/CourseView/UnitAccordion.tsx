import type { FC } from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';

import type { Subject } from 'rxjs';
import { MaterialItem } from './MaterialItem';
import type { MaterialWithCompletionForm } from './state';
import type { MaterialCompleteEvent } from './useMaterialCompletion';
import { Video as VideoComponent } from '@/components/Video';
import type { MaterialCompletion } from '@/domain/materialCompletion';
import type { Unit } from '@/domain/unit';
import type { Video } from '@/domain/video';
import { useUnitToggleDispatch } from '@/hooks/useUnitToggleDispatch';
import { useUnitToggleState } from '@/hooks/useUnitToggleState';
import { endpoint } from 'src/basePath';

type Props = {
  studentId: number;
  enrollmentId: number;
  courseId: number;
  unit: Unit & {
    materials: MaterialWithCompletionForm[];
    videos: Video[];
  };
  materialCompletions: MaterialCompletion[];
  materialCompletion$: Subject<MaterialCompleteEvent>;
};

const iconSize = 24;

export const UnitAccordion: FC<Props> = ({ studentId, enrollmentId, courseId, unit, materialCompletions, materialCompletion$ }) => {
  const unitToggleState = useUnitToggleState();
  const unitToggleDispatch = useUnitToggleDispatch();

  const handleClick = (): void => {
    unitToggleDispatch({ type: 'TOGGLE', payload: { courseId, unitLetter: unit.unitLetter } });
  };

  const open = !!unitToggleState?.[courseId]?.[unit.unitLetter];

  return (
    <>
      <div onClick={handleClick} className="d-flex justify-content-between" style={{ cursor: 'pointer' }}>
        <h3 className="h5 mb-0">Unit {unit.unitLetter}</h3>
        {open ? <AiOutlineMinusCircle size={iconSize} /> : <AiOutlinePlusCircle size={iconSize} />}
      </div>
      <Separator />
      {open && (
        <>
          {unit.materials.map((m, i) => {
            const complete = materialCompletions.some(mc => mc.materialId === m.materialId);
            return (
              <>
                {i > 0 && <hr />}
                <MaterialItem key={m.materialId} studentId={studentId} enrollmentId={enrollmentId} material={m} complete={complete} materialCompletion$={materialCompletion$} />
              </>
            );
          })}
          {unit.videos.length > 0 && (
            <>
              {unit.materials.length > 0 && <hr />}
              <h4 className="h5">Videos in Unit {unit.unitLetter}</h4>
              <div className="row my-4">
                {unit.videos.map(v => (
                  <div key={v.videoId} className="col-12 col-md-6 col-lg-4">
                    <VideoComponent controls src={v.src} poster={v.posterSrc} captionSrc={v.captionSrc ?? undefined} style={{ maxWidth: '100%' }} />
                    <h6>{v.title}</h6>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
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
