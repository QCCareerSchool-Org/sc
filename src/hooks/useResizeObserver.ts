import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

export const useResizeObserver = (ref: RefObject<HTMLElement>, options?: ResizeObserverOptions): ResizeObserverEntry | undefined => {
  const [ entry, setEntry ] = useState<ResizeObserverEntry>();

  useEffect(() => {
    if (ref.current) {
      const currentRef = ref.current;
      const observer = new ResizeObserver(entries => {
        setEntry(entries[0]);
      });
      observer.observe(currentRef, options);
      return () => {
        observer.unobserve(currentRef);
      };
    }
  }, [ ref, options ]);

  return entry;
};
