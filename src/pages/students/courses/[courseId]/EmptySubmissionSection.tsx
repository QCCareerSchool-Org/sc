import Image from 'next/image';
import type { FC, MouseEventHandler } from 'react';

import PagesIcon from './pages.svg';
import type { State } from './state';
import { Spinner } from '@/components/Spinner';

type Props = {
  unitLetter: string;
  formState: State['form'];
  expired: boolean;
  onInitializeButtonClick: MouseEventHandler;
};

export const EmptySubmissionSection: FC<Props> = props => {
  const buttonDisabled = props.expired || props.formState.processingState === 'initializing';

  return (
    <div className="d-flex">
      <div className="assignmentsLeft">
        <Image src={PagesIcon} alt="Assignments" />
      </div>
      <div className="assignmentsCenter">
        <h4 className="title h6 mb-2">Assignments Unit {props.unitLetter}</h4>
        <p className="small">Once you've completed all of your lessons for this unit, you're ready to begin your assignments! Click the button below to get started.</p>
        <div className="d-flex align-items-center">
          <button onClick={props.onInitializeButtonClick} className="btn btn-primary" style={{ width: 120 }} disabled={buttonDisabled}>
            {props.formState.processingState === 'initializing'
              ? <Spinner size="sm" />
              : <>Start</>
            }
          </button>
          {props.formState.processingState === 'initialize error' && <span className="text-danger ms-2">{props.formState.errorMessage ?? 'initializing'}</span>}
        </div>
      </div>
      <style jsx>{`
      .title {
        font-size: 1.25rem;
      }
      .assignmentsLeft {
        width: 150px;
        display: flex;
        justify-content: center;
        margin-right: 0.5rem;
      }
      .assignmentsCenter {
        width: calc(100% - 150px - 1rem);
        margin-left: 0.5rem;
      }
      `}</style>
    </div>
  );
};
