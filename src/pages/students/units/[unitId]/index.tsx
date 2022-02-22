import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { NewUnit } from '../../../../domain/students/newUnit';
import { useAuthState } from '../../../../hooks/useAuthState';
import { ObservableHttpServiceError } from '@/services/observableHttpService';
import { newUnitService, NewUnitWithAssignments } from '@/services/students';

type Props = {
  protectedPage: true;
  unitId: string | null;
};

const UnitViewPage: NextPage<Props> = ({ unitId }: Props) => {
  const router = useRouter();
  const authState = useAuthState();
  const [ unit, setUnit ] = useState<NewUnitWithAssignments>();
  const [ error, setError ] = useState<number | undefined>();
  const [ submitUnit, setSubmitUnit ] = useState<() => void>();
  const [ skipUnit, setSkipUnit ] = useState<() => void>();

  const subscription = useMemo(() => ({
    next: (data: NewUnitWithAssignments) => setUnit(data),
    error: (err: unknown) => {
      if (err instanceof ObservableHttpServiceError) {
        if (err.refresh) {
          return router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
        }
        return setError(err.code ?? -1);
      }
      setError(-1);
    },
  }), [ router ]);

  useEffect(() => {
    if (typeof authState.studentId !== 'undefined' && unitId) {
      const destroy$ = new Subject<void>();

      newUnitService.getUnit(authState.studentId, unitId).pipe(
        takeUntil(destroy$),
      ).subscribe(subscription);

      setSubmitUnit(() => (): void => {
        if (typeof authState.studentId !== 'undefined' && unitId) {
          newUnitService.submitUnit(authState.studentId, unitId).pipe(
            takeUntil(destroy$),
          ).subscribe(subscription);
        }
      });

      setSkipUnit(() => (): void => {
        if (typeof authState.studentId !== 'undefined' && unitId) {
          newUnitService.submitUnit(authState.studentId, unitId).pipe(
            takeUntil(destroy$),
          ).subscribe(subscription);
        }
      });

      return () => { destroy$.next(); destroy$.complete(); };
    }
  }, [ subscription, authState.studentId, unitId ]);

  if (error) {
    return <>{error}</>;
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
                <tr key={a.assignmentId} onClick={async () => router.push(`${router.asPath}/assignments/${a.assignmentId}`)} style={{ cursor: 'pointer' }}>
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

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const unitIdParam = ctx.params?.unitId;
  const unitId = typeof unitIdParam === 'string' ? unitIdParam : null;
  console.log(ctx.params);
  return { props: { protectedPage: true, unitId } };
};

export default UnitViewPage;
