import type { FC } from 'react';

export const GreenCircleCheck: FC = () => (
  <>
    <div className="greenCircleCheck" />
    <style jsx>{`
      .greenCircleCheck {
        display: inline-block;
        width: 3rem;
        height: 3rem;
        border-radius: 1.5rem;
        background-color: #2dcb70;
        border-color: #2dcb70;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m5.5 10 3 3 6-6'/%3e%3c/svg%3e");
        color: white;
      }
    `}</style>
  </>
);
