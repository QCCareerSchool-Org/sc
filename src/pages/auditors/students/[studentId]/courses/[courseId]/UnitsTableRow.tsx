import { type FC, useMemo } from 'react';

import type { EnrollmentData } from './state';
import { useServices } from '@/hooks/useServices';

type Props = {
  unit: EnrollmentData['course']['units'][0];
  materialCompletions: EnrollmentData['materialCompletions'];
};

export const UnitsTableRow: FC<Props> = ({ unit, materialCompletions }) => {
  const { gradeService } = useServices();

  const [ progress, total ] = useMemo(() => {
    let p = 0;
    let t = 0;

    for (const material of unit.materials) {
      if (material.type === 'lesson') {
        t++;
        if (materialCompletions.findIndex(m => m.materialId === material.materialId) !== -1) {
          p++;
        }
      } else if (material.type === 'scorm2004') {
        t++;
        if (material.materialData['cmi.completion_status'] === 'completed') { // SCORM data indicated material is completed
          p++;
        }
      }
    }

    return [ p, t ];
  }, [ unit, materialCompletions ]);

  return (
    <tr>
      <td className="text-center">{unit.unitLetter}</td>
      <td>{unit.title}</td>
      <td className="text-center">{total > 0 ? `${Math.round(progress / total * 100)}%` : 'N/A'}</td>
      <td className="text-center">N/A</td>
    </tr>
  );
};
