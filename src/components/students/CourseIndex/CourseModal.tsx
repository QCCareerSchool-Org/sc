import type { FC, MouseEventHandler, PropsWithChildren } from 'react';
import { RiArrowGoBackFill } from 'react-icons/ri';

type Props = {
  title: string;
  onClose: () => void;
};

export const CourseModal: FC<PropsWithChildren<Props>> = ({ title, onClose, children }) => {
  const handleClose: MouseEventHandler<HTMLButtonElement> = () => {
    onClose();
  };

  return (
    <>
      <div className="modalWrapper">
        <div className="modalHeader">
          <button onClick={handleClose} className="closeButton" aria-label="Close"><RiArrowGoBackFill size="24" /></button>
          <h4 className="modalTitle">{title}</h4>
        </div>
        <div className="modalBody">
          {children}
        </div>
      </div>
      <style jsx>{`
      .modalWrapper { background: white; }
      .modalHeader {
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        overflow: hidden;
        padding: 1rem;
        background: rgb(0, 0, 64);
        color: white;
        height: 180px;
      }
      @media only screen and (min-width: 576px) {
        .modalHeader { height: 200px; }
      }
      @media only screen and (min-width: 768px) {
        .modalHeader { height: 220px; }
      }
      @media only screen and (min-width: 992px) {
        .modalHeader { height: 240px; }
      }
      @media only screen and (min-width: 1200px) {
        .modalHeader { height: 260px; }
      }
      .closeButton {
        position: absolute;
        color: white;
        background: none;
        top: 1rem;
        right: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
      .modalTitle {
        font-size: 1.5rem;
      }
      .modalBody {
        padding: 1rem;
      }
      `}</style>
    </>
  );
};
