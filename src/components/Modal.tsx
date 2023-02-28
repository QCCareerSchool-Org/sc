import { useEffect, useState } from 'react';
import type { FC, MouseEventHandler, PropsWithChildren } from 'react';

import { useModalDispatch } from '@/hooks/useModalDispatch';
import { useScrollbarWidth } from '@/hooks/useScrollbarWidth';

type ModalSize = 'sm' | 'lg' | 'xl';

type Props = {
  size?: ModalSize;
  show: boolean;
  onClose: () => void;
};

const getModalClassName = (show: boolean): string => {
  let className = 'modal fade';
  if (show) {
    className += ' show';
  }
  return className;
};

const getModalDialogClassName = (size?: ModalSize): string => {
  let className = 'modal-dialog';
  if (size === 'sm') {
    className += ' modal-sm';
  } else if (size === 'lg') {
    className += ' modal-lg';
  } else if (size === 'xl') {
    className += ' modal-xl';
  }
  return className;
};

export const Modal: FC<PropsWithChildren<Props>> = props => {
  const scrollbarWidth = useScrollbarWidth();
  const modalDispatch = useModalDispatch();

  const [ show, setShow ] = useState(props.show);

  const modalClassName = getModalClassName(show);
  const modalDialogClassName = getModalDialogClassName(props.size);

  const { onClose } = props;

  useEffect(() => {
    modalDispatch(props.show);
    if (props.show) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      const id = setTimeout(() => setShow(true), 0);
      return () => clearTimeout(id);
    }
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
    setShow(false);
  }, [ modalDispatch, props.show, scrollbarWidth ]);

  useEffect(() => {
    const handler = (ev: KeyboardEvent): void => {
      if (ev.defaultPrevented) {
        return;
      }
      if (ev.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [ onClose ]);

  const handleOverlayClick: MouseEventHandler = () => props.onClose();

  const handleInnerClick: MouseEventHandler = e => e.stopPropagation();

  return (
    <div onClick={handleOverlayClick} className={modalClassName} tabIndex={-1} style={props.show ? { display: 'block' } : undefined} aria-modal={show ? true : undefined} role={show ? 'dialog' : undefined}>
      <div className={modalDialogClassName}>
        <div onClick={handleInnerClick} style={{ position: 'relative', width: '100%', pointerEvents: 'auto', outline: 0 }}>
          {props.children}
        </div>
      </div>
    </div>
  );
};
