import type { FC, PropsWithChildren } from 'react';

type Props = {
  color?: 'black' | 'blue';
};

export const MaterialButton: FC<PropsWithChildren<Props>> = ({ color = 'black', children }) => {
  return (
    <>
      <div className="lessonButton">{children}</div>
      <style jsx>{`
      .lessonButton {
        display: inline-block;
        background-color: ${color === 'black' ? 'black' : '#0d6efd'};
        color: white;
        text-align: center;
        padding: 0.375rem 2rem;
        border-radius: 1rem;
        font-size: 0.875rem;
      }
      .lessonButton:hover {
        background-color: ${color === 'black' ? '#333' : '#0b5ed7'};
      }
      `}</style>
    </>
  );
};
