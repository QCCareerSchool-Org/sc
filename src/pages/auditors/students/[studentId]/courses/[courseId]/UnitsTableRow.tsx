import { type FC, memo, useMemo } from 'react';

import type { EnrollmentData } from './state';
import { useServices } from '@/hooks/useServices';

type Props = {
  unit: EnrollmentData['course']['units'][0];
  materialCompletions: EnrollmentData['materialCompletions'];
};

export const UnitsTableRow: FC<Props> = memo(({ unit, materialCompletions }) => {
  const { gradeService } = useServices();

  const [ progress, total, quizMark, quizPoints ] = useMemo(() => {
    let p = 0;
    let t = 0;
    let qMark = 0;
    let qPoints = 0;

    for (const material of unit.materials) {
      if (material.type === 'lesson') {
        t++;
        if (materialCompletions.findIndex(m => m.materialId === material.materialId) !== -1) { // there is a material completion recorded
          p++;
        }
      } else if (material.type === 'scorm2004') {
        t++;
        if (material.materialData['cmi.completion_status'] === 'completed') { // SCORM data indicates material is completed
          p++;
        }
        if (typeof material.materialData['cmi.score.raw'] !== 'undefined' && typeof material.materialData['cmi.score.max'] !== 'undefined') {
          qMark += parseInt(material.materialData['cmi.score.raw'], 10);
          qPoints += parseInt(material.materialData['cmi.score.max'], 10);
        }
      }
    }

    return [ p, t, qMark, qPoints ];
  }, [ unit, materialCompletions ]);

  return (
    <tr>
      <td className="text-center">{unit.unitLetter}</td>
      <td>{unit.title}</td>
      <td className="text-center">{total > 0 ? `${Math.round(progress / total * 100)}%` : 'N/A'}</td>
      <td className="text-center">{quizPoints > 0 ? gradeService.calculate(quizMark, quizPoints, new Date(Date.UTC(2024, 1, 23))) : 'N/A'}</td>
    </tr>
  );
});

UnitsTableRow.displayName = 'UnitsTableRow';
