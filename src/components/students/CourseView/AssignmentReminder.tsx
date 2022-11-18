import type { FC, MouseEventHandler } from 'react';
import { MaterialButton } from './MaterialButton';
import { scrollToId } from 'src/scrollToId';

type Props = {
  title: string;
  description: string;
};

export const AssignmentReminder: FC<Props> = ({ title, description }) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
    scrollToId('assignments');
  };

  return (
    <div className="container">
      <div className="row py-4">
        <div className="col-12 col-lg-4 col-xxl-3 mb-3 mb-lg-0">{title}</div>
        <div className="col-12 col-lg-5 col-xxl-6 mb-3 mb-lg-0" dangerouslySetInnerHTML={{ __html: description }} />
        <div className="col-8 col-sm-6 col-md-5 col-lg-3">
          <a onClick={handleClick}><MaterialButton type="assignment">Go To Assignments</MaterialButton></a>
        </div>
      </div>
    </div>
  );
};
