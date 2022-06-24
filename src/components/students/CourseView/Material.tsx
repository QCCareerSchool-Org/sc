import type { ReactElement } from 'react';

import type { NewMaterial } from '@/domain/newMaterial';

type Props = {
  material: NewMaterial;
};

export const Material = ({ material }: Props): ReactElement => {
  return (
    <>
      <h4>{material.title}</h4>
    </>
  );
};
