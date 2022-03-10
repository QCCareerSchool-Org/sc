import type { MouseEvent, ReactElement } from 'react';
import { memo } from 'react';

import type { NewAssignmentMedium } from '@/domain/newAssignmentMedium';

type Props = {
  media: NewAssignmentMedium[];
  mediumRowClick: (e: MouseEvent<HTMLTableRowElement>, mediaId: string) => void;
};

export const NewAssignmentMediumList = memo(({ media, mediumRowClick }: Props): ReactElement => (
  <>
    {media.length === 0
      ? <p>no media</p>
      : (
        <table id="newAssignmentMediaTable" className="table table-bordered table-hover w-auto bg-white">
          <thead>
            <tr>
              <th>Caption</th>
              <th>Type</th>
              <th className="text-center">Order</th>
            </tr>
          </thead>
          <tbody>
            {media.map(m => (
              <tr key={m.assignmentMediumId} onClick={e => mediumRowClick(e, m.assignmentMediumId)}>
                <td>{m.caption}</td>
                <td>{m.type}</td>
                <td className="text-center">{m.order}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    <style jsx>{`
      #newAssignmentMediaTable tr { cursor: pointer }
    `}</style>
  </>
));

NewAssignmentMediumList.displayName = 'NewAssignmentMediumList';
