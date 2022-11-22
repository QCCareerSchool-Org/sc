import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

export const useIntersectionObserver = (ref: RefObject<HTMLElement>, options?: IntersectionObserverInit): IntersectionObserverEntry | undefined => {
  const [ entry, setEntry ] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    if (ref.current) {
      const currentRef = ref.current;
      const observer = new IntersectionObserver(entries => {
        setEntry(entries[0]);
      }, options);
      observer.observe(currentRef);
      return () => {
        observer.unobserve(currentRef);
      };
    }
  }, [ ref, options ]);

  return entry;
};

export const useIntersectionObserver2 = (options?: IntersectionObserverInit, ...refs: RefObject<HTMLElement>[]): IntersectionObserverEntry[] | undefined => {
  const [ entries, setEntries ] = useState<IntersectionObserverEntry[]>();

  useEffect(() => {
    const observedElements: HTMLElement[] = [];
    const observer = new IntersectionObserver(e => {
      setEntries(e);
    }, options);
    for (const ref of refs) {
      if (ref.current) {
        observer.observe(ref.current);
        observedElements.push(ref.current);
      }
    }
    return () => {
      for (const element of observedElements) {
        observer.unobserve(element);
      }
    };
  }, [ options, ...refs ]);

  return entries;
};
