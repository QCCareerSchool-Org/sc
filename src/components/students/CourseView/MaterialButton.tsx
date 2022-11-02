import type { FC, ReactNode } from 'react';
import { FaArrowUp, FaBookOpen } from 'react-icons/fa';

type Props = {
  type: 'lesson' | 'assignment';
  children: ReactNode;
};

export const MaterialButton: FC<Props> = ({ type, children }) => (
  <>
    <div className="lessonButton"><span className="icon">{type === 'lesson' ? <FaBookOpen /> : <FaArrowUp />}</span>{children}</div>
    <style jsx>{`
    .lessonButton {
      background-color: black;
      color: white;
      text-align: center;
      padding: 0.375rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }
    .icon {
      margin-right: 0.375rem;
    }
    `}</style>
  </>
);
