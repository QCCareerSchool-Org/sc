import type { FC } from 'react';

import type { NewMaterial } from '@/domain/newMaterial';
import { endpoint } from 'src/basePath';

type Props = {
  material: NewMaterial;
};

export const Material: FC<Props> = ({ material }) => {
  const href = `${endpoint}/students/50/static/lessons/${material.materialId}${material.entryPoint}`;
  return (
    <div className="row">
      <div className="col-12 col-lg-4">
        <a href={href} target="_blank" rel="noopener noreferrer">xxxxxxxxxxxxx</a>
      </div>
      <div className="col-12 col-lg-4">
        <h4 className="h6">{material.title}</h4>
      </div>
      <div className="col-12 col-lg-4">
        x
      </div>

    </div>
  );
};
