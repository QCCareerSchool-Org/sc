import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export const Section: FC<Props> = ({ id, className, children }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [ scrollOffset, setScrollOffset ] = useState(false);

  useEffect(() => {
    if (sectionRef.current) {
      const distanceFromTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      if (distanceFromTop < 780) {
        setScrollOffset(true);
      }
    }
  }, []);

  const sectionClassName = scrollOffset ? `menuScrollOffset${className ? ' ' + className : ''}` : className;

  return <section ref={sectionRef} id={id} className={sectionClassName}>{children}</section>;
};
