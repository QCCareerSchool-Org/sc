import type { MutableRefObject, Ref } from 'react';

const isMutableRefObject = <T>(thing: unknown): thing is MutableRefObject<T> => (thing as MutableRefObject<T>) !== undefined;

// https://www.davedrinks.coffee/how-do-i-use-two-react-refs/

export const mergeRefs = <T>(...refs: Ref<T>[]): Ref<T> | null => {
  const filteredRefs = refs.filter(Boolean); // remove falsy elements

  if (!filteredRefs.length) {
    return null;
  }

  if (filteredRefs.length === 1) {
    return filteredRefs[0];
  }

  return (inst: T) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (isMutableRefObject<T>(ref)) {
        ref.current = inst;
      }
    }
  };
};
