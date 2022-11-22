import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  id?: string;
  className?: string;
  children: ReactNode;
};

const minDistance = 750;

export const Section: FC<Props> = ({ id, className, children }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [ scrollOffset, setScrollOffset ] = useState(false);

  useEffect(() => {
    if (id && sectionRef.current) {
      const ref = sectionRef.current;

      const calculateDistance = (): void => {
        const distanceFromTop = ref.getBoundingClientRect().top + window.scrollY;
        setScrollOffset(distanceFromTop < minDistance);
        console.log(`#${id}`, distanceFromTop, distanceFromTop < minDistance);
      };
      calculateDistance();

      const config = { attributes: true, childList: true, subtree: true };
      const observer = new MutationObserver(calculateDistance);
      observer.observe(document, config);
      return () => observer.disconnect();
    }
  }, [ sectionRef, id ]);

  const sectionClassName = scrollOffset ? `menuScrollOffset${className ? ' ' + className : ''}` : className;

  return <section ref={sectionRef} id={id} className={sectionClassName}>{children}</section>;
};
