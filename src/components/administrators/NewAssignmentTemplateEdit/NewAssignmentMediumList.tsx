import type { FC, MouseEvent } from 'react';
import { memo } from 'react';

import { humanReadableFileSize } from '../../../humanReadableFilesize';
import type { NewAssignmentMedium } from '@/domain/newAssignmentMedium';

type Props = {
  media: NewAssignmentMedium[];
  onClick: (e: MouseEvent<HTMLTableRowElement>, mediaId: string) => void;
};

export const NewAssignmentMediumList: FC<Props> = memo(props => {
  const { media } = props;
  return (
    <>
      {media.length === 0
        ? <p>no media</p>
        : (
          <table className="newAssignmentMediaTable table table-bordered table-hover w-auto bg-white">
            <thead>
              <tr>
                <th>Caption</th>
                <th>Type</th>
                <th className="text-end">Size</th>
                <th className="text-center">Order</th>
              </tr>
            </thead>
            <tbody>
              {media.map(m => (
                <tr key={m.assignmentMediumId} onClick={e => props.onClick(e, m.assignmentMediumId)}>
                  <td>{m.caption}</td>
                  <td>{m.type}</td>
                  <td className="text-end">{humanReadableFileSize(m.filesize)}</td>
                  <td className="text-center">{m.order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }

      <style jsx>{`
      .newAssignmentMediaTable tr { cursor: pointer }
      `}</style>
    </>
  );
});

NewAssignmentMediumList.displayName = 'NewAssignmentMediumList';
