import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';
import { createContext, useState } from 'react';

export type ModalState = boolean;

export const ModalStateContext = createContext<ModalState | undefined>(undefined);
export const ModalDispatchContext = createContext<Dispatch<SetStateAction<ModalState>> | undefined>(undefined);

export const ModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ show, setShow ] = useState<ModalState>(false);

  return (
    <ModalStateContext.Provider value={show}>
      <ModalDispatchContext.Provider value={setShow}>
        {children}
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
};
