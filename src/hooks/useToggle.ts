import { useState } from 'react';

export const useToggle = (initial?: boolean): readonly [ open: boolean, toggle: () => void ] => {
  const [ open, setOpen ] = useState(!!initial);
  const toggle = (): void => setOpen(o => !o);
  return [ open, toggle ] as const;
};
