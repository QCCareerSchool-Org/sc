import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';

import { GreenCircleCheck } from './GreenCircleCheck';
import { MaterialButton } from './MaterialButton';
import PagesIcon from './pages.svg';
import type { NewSubmission } from '@/domain/student/newSubmission';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { useServices } from '@/hooks/useServices';
import { formatDate } from 'src/formatDate';

type Props = {
  courseId: number;
  unitLetter: string;
  submission: NewSubmission;
};

export const SubmissionSection: FC<Props> = props => {
  const { courseId, submission } = props;
  const { gradeService } = useServices();
  const screenWidth = useScreenWidth();
  const lg = screenWidth >= 992;

  const grade = submission.mark === null ? null : gradeService.calculate(submission.mark, submission.points, submission.created);

  return (
    <>
      <div className="d-flex align-items-center">
        <div className="assignmentsLeft">
          {submission.closed === null
            ? <Image src={PagesIcon} alt="Assignments" />
            : <GreenCircleCheck />
          }
        </div>
        <div className="assignmentsCenter">
          <h4 className="title h6 mb-2">Assignments Unit {props.unitLetter}{lg && submission.title && <span className="fw-normal">: {submission.title}</span>}</h4>
          {submission.description && (
            <div className="mb-2">
              {submission.description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="small mb-0">{p}</p>)}
            </div>
          )}
          <p className="mb-0">
            {submission.closed
              ? <><span className="markedGreen fw-bold">Completed</span>{grade !== null && <> | Grade {grade}</>}</>
              : submission.submitted
                ? <><span className="text-primary fw-bold">{submission.skipped ? 'Skipped' : 'Submitted'}</span> | {formatDate(submission.submitted)}</>
                : <><span className="text-primary fw-bold">Started</span> | {formatDate(submission.created)}</>
            }
          </p>
          {!lg && (
            <div className="mt-4">
              <Link href={`${courseId}/submissions/${submission.submissionId}`}><MaterialButton color="blue">View Assignments</MaterialButton></Link>
            </div>
          )}
        </div>
        {lg && (
          <div className="assignmentsRight">
            <Link href={`${courseId}/submissions/${submission.submissionId}`}><MaterialButton color="blue">View Assignments</MaterialButton></Link>
          </div>
        )}
      </div>
      <style jsx>{`
      .markedGreen {
        color: #2dcb70;
      }
      .title {
        font-size: 1.25rem;
      }
      .assignmentsLeft {
        display: flex;
        width: 100px;
        justify-content: center;
        margin-right: 0.5rem;
      }
      .assignmentsRight {
        width: 185px;
        text-align: right;
        margin-left: 0.5rem;
      }
      .assignmentsCenter {
        width: calc(100% - 100px - 1rem);
        margin-left: 0.5rem;
      }
      @media (min-width: 992px) {
        .assignmentsLeft {
          width: 150px;
        }
        .assignmentsCenter {
          width: calc(100% - 150px - 185px - 2rem);
          margin-right: 0.5rem;
        }
      }
      `}</style>
    </>
  );
};
