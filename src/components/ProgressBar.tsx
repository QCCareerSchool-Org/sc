import type { FC, ReactNode } from 'react';

type Props = {
  min?: number;
  max?: number;
  progress: number;
  children?: ReactNode;
};

export const ProgressBar: FC<Props> = ({ min = 0, max = 100, progress, children }) => (
  <div className="progress" style={{ height: 38 }}>
    <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin={min} aria-valuemax={max}>{children}</div>
  </div>
);
