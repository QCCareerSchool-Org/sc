import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { NewUnit } from '../../../../domain/students/newUnit';
import { useAuthState } from '../../../../hooks/useAuthState';
import { newUnitService } from '../../../../services';

type Props = {
  unitId: string | null;
};

const UnitViewPage: NextPage<Props> = ({ unitId }: Props) => {
  const router = useRouter();
  const authState = useAuthState();
  const [ unit, setUnit ] = useState<NewUnit>();
  const [ error, setError ] = useState<number | undefined>();

  useEffect(() => {
    if (typeof authState.studentId !== 'undefined' && unitId) {
      newUnitService.getUnit(authState.studentId, unitId).then(response => {
        if (response.refresh) {
          return router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
        }
        if (response.code === 200) {
          setUnit(response.data);
        } else {
          setError(response.code);
        }
      }).catch(err => {
        console.error(err);
      });
    }
  }, [ authState.studentId, unitId, router ]);

  if (error) {
    return <>{error}</>;
  }

  if (!unit) {
    return null;
  }

  const submitUnit = (): void => {
    if (typeof authState.studentId !== 'undefined' && unitId) {
      newUnitService.submitUnit(authState.studentId, unitId).then(response => {
        if (response.refresh) {
          return router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
        }
        if (response.code === 200) {
          setUnit(response.data);
        } else {
          setError(response.code);
        }
      }).catch(err => {
        console.error(err);
      });
    }
  };

  const skipUnit = (): void => {
    if (typeof authState.studentId !== 'undefined' && unitId) {
      newUnitService.submitUnit(authState.studentId, unitId).then(response => {
        if (response.refresh) {
          return router.push({ pathname: '/login', query: { returnUrl: router.asPath } });
        }
        if (response.code === 200) {
          setUnit(response.data);
        } else {
          setError(response.code);
        }
      }).catch(err => {
        console.error(err);
      });
    }
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>Unit {unit.unitLetter}</h1>
          <h2>Assignments</h2>
          <table className="table table-bordered bg-white w-auto">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {unit.assignments.map(a => (
                <tr key={a.assignmentId} onClick={async () => router.push(`${router.asPath}/assignments/${a.assignmentId}`)} style={{ cursor: 'pointer' }}>
                  <th scope="row">{a.assignmentNumber}</th>
                  <td>{a.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
  return { props: { unitId } };
};

export default UnitViewPage;
