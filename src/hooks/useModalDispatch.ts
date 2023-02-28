import type { Dispatch, SetStateAction } from 'react';
import { useContext } from 'react';

import type { ModalState } from '../providers/ModalProvider';
import { ModalDispatchContext } from '../providers/ModalProvider';

export const useModalDispatch = (): Dispatch<SetStateAction<ModalState>> => {
  const dispatch = useContext(ModalDispatchContext);
  if (typeof dispatch === 'undefined') {
    throw Error('useModalDispatch must be used within an ModalProvider');
  }
  return dispatch;
};
