import { ReactElement } from 'react';

type Props = {
  min?: number;
  max?: number;
  progress: number;
};

export const ProgressBar = ({ min = 0, max = 100, progress }: Props): ReactElement => (
  <div className="progress" style={{ height: 38 }}>
    <div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin={min} aria-valuemax={max} />
  </div>
);
