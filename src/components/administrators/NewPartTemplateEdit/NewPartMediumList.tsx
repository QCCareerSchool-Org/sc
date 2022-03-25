import type { MouseEvent, ReactElement } from 'react';
import { memo } from 'react';

import type { NewPartMedium } from '@/domain/newPartMedium';
import { humanReadableFileSize } from 'src/humanReadableFilesize';

type Props = {
  media: NewPartMedium[];
  onClick: (e: MouseEvent<HTMLTableRowElement>, mediaId: string) => void;
};

export const NewPartMediumList = memo(({ media, onClick }: Props): ReactElement => (
  <>
    {media.length === 0
      ? <p>no media</p>
      : (
        <table className="newPartMediaTable table table-bordered table-hover w-auto bg-white">
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
              <tr key={m.partMediumId} onClick={e => onClick(e, m.partMediumId)}>
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
      .newPartMediaTable tr { cursor: pointer }
    `}</style>
  </>
));

NewPartMediumList.displayName = 'NewPartMediumList';
