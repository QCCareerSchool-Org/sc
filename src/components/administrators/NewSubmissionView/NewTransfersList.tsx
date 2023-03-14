import type { FC } from 'react';
import type { NewTransfer } from '@/domain/newTransfer';
import { formatDateTime } from 'src/formatDate';

type Props = {
  transfers: NewTransfer[];
};

export const NewTransfersList: FC<Props> = ({ transfers }) => (
  <table className="table table-bordered bg-white">
    <thead>
      <tr>
        <th>Date</th>
        <th>From</th>
        <th>To</th>
      </tr>
    </thead>
    <tbody>
      {transfers.map(t => (
        <tr key={t.transferId}>
          <td>{formatDateTime(t.created)}</td>
          <td>{t.preTutorId}</td>
          <td>{t.postTutorId}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
