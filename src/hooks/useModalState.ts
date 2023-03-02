import { useContext } from 'react';

import type { ModalState } from '../providers/ModalProvider';
import { ModalStateContext } from '../providers/ModalProvider';

export const useModalState = (): ModalState => {
  const state = useContext(ModalStateContext);
  if (typeof state === 'undefined') {
    throw Error('useModalState must be used within an ModalProvider');
  }
  return state;
};
