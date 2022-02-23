import Error from 'next/error';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { HttpServiceError } from '@/services/httpService';
import { newUnitService, NewUnitWithAssignments } from '@/services/students';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  studentId: number;
  unitId: string;
};

export const NewUnitView = ({ studentId, unitId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ unit, setUnit ] = useState<NewUnitWithAssignments>();
  const [ error, setError ] = useState<number | undefined>();
  const [ submitUnit, setSubmitUnit ] = useState<() => void>();
  const [ skipUnit, setSkipUnit ] = useState<() => void>();

  const subscription = useMemo(() => ({
    next: (data: NewUnitWithAssignments) => setUnit(data),
    error: (err: unknown) => {
      if (err instanceof HttpServiceError) {
        if (err.refresh) {
          return navigateToLogin(router);
        }
        return setError(err.code ?? -1);
      }
      setError(-1);
    },
  }), [ router ]);

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newUnitService.getUnit(studentId, unitId).pipe(
      takeUntil(destroy$),
    ).subscribe(subscription);

    setSubmitUnit(() => (): void => {
      newUnitService.submitUnit(studentId, unitId).pipe(
        takeUntil(destroy$),
      ).subscribe(subscription);
    });

    setSkipUnit(() => (): void => {
      newUnitService.submitUnit(studentId, unitId).pipe(
        takeUntil(destroy$),
      ).subscribe(subscription);
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ subscription, studentId, unitId ]);

  if (error) {
    return <Error statusCode={error} />;
  }

  if (!unit) {
    return null;
  }

  return (
    <>
      <section>
        <div className="container">
          <h1>Unit {unit.unitLetter}</h1>
          <h6>Assignments</h6>
          <table className="table table-bordered bg-white w-auto">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {unit.assignments.map(a => (
                <tr key={a.assignmentId} onClick={async () => router.push(`${router.asPath}/assignments/${a.assignmentId}`, undefined, { scroll: false })} style={{ cursor: 'pointer' }}>
                  <th scope="row">{a.assignmentNumber}</th>
                  <td>{a.title}{a.optional && <span className="ms-1 text-danger">*</span>}</td>
                  <td>{a.complete ? 'Complete' : 'Incomplete'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {unit.assignments.some(a => a.optional) && <p><span className="ms-1 text-danger">*</span> Optional assignment</p>}
        </div>
      </section>
      <section>
        <div className="container">
          <h2>Submit Unit</h2>
          {unit.complete
            ? <p>Your unit is complete. Please click the Submit button below to send it to your tutor for marking. Once you have submitted your unit, you will not be able to make any further changes to it.</p>
            : <p>Your unit is not yet complete. Please complete all assignments before submitting your unit.</p>
          }
          <button onClick={submitUnit} className="btn btn-primary" disabled={!unit.complete}>Submit Unit</button>
        </div>
      </section>
      {unit.optional && (
        <section>
          <div className="container">
            <h2>Skip Unit</h2>
            <p>This unit is optional. You can skip it and move on to the next unit.</p>
            <p>By skipping this unit, your tutor will not review it and you will not receive a mark.</p>
            <button onClick={skipUnit} className="btn btn-secondary">Skip Unit</button>
          </div>
        </section>
      )}
    </>
  );
};
