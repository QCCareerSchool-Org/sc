import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useModalState } from '@/hooks/useModalState';

type Visibility = 'hidden' | 'showing' | 'show' | 'hiding';

export const ModalBackdrop: FC = () => {
  const modalState = useModalState();

  const [ visibility, setVisibility ] = useState<Visibility>('hidden');

  useEffect(() => {
    if (modalState) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibility('showing');
      const id = setTimeout(() => setVisibility('show'), 0);
      return () => clearTimeout(id);
    }
    setVisibility('hiding');
    const id = setTimeout(() => setVisibility('hidden'), 150);
    return () => clearTimeout(id);
  }, [ modalState ]);

  if (visibility === 'hidden') {
    return null;
  }

  const className = visibility === 'showing' || visibility === 'hiding'
    ? 'modal-backdrop fade'
    : 'modal-backdrop fade show';

  return <div className={className} />;
};
