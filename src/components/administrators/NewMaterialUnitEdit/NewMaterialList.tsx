import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import type { NewMaterial, NewMaterialType } from '@/domain/newMaterial';

type Props = {
  newMaterials: NewMaterial[];
  onClick: (e: MouseEvent<HTMLTableRowElement>, materialId: string) => void;
};

export const NewMaterialList: FC<Props> = memo(props => {
  if (props.newMaterials.length === 0) {
    return <p>no materials</p>;
  }
  return (
    <>
      <table className="table table-bordered table-hover w-auto bg-white">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th className="text-center">Image</th>
            <th className="text-center">Order</th>
          </tr>
        </thead>
        <tbody>
          {props.newMaterials.map(m => (
            <tr key={m.materialId} onClick={e => props.onClick(e, m.materialId)}>
              <td>{m.title ?? '(none)'}</td>
              <td>{materialTypeName(m.type)}</td>
              <td className="text-center">{m.imageMimeTypeId ? <span className="text-success">yes</span> : <span>no</span>}</td>
              <td className="text-center">{m.order}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
});

const materialTypeName = (type: NewMaterialType): string => {
  switch (type) {
    case 'lesson':
      return 'Lesson';
    case 'video':
      return 'Video';
    case 'download':
      return 'Download';
    case 'assignment':
      return 'Assignment Reminder';
    default:
      throw Error('Invalid material type');
  }
};

NewMaterialList.displayName = 'NewMaterialList';
