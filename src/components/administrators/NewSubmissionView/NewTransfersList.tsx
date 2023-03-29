import type { FC } from 'react';
import type { Tutor } from '@/domain/administrator/tutor';
import type { NewTransfer } from '@/domain/newTransfer';
import { formatDateTime } from 'src/formatDate';

type Props = {
  transfers: Array<NewTransfer & {
    preTutor: Tutor;
    postTutor: Tutor;
  }>;
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
          <td>{t.preTutor.firstName} {t.preTutor.lastName}</td>
          <td>{t.postTutor.firstName} {t.postTutor.lastName}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
