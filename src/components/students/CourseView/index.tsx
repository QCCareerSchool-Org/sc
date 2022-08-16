import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { MouseEvent, MouseEventHandler, ReactElement } from 'react';
import { useCallback, useMemo, useReducer } from 'react';

import { endpoint } from '../../../basePath';
import { CourseHeaderImage } from './CourseHeaderImage';
import { MaterialUnit } from './MaterialUnit';
import { initialState, reducer } from './state';
import { UnitsTable } from './UnitsTable';
import { useInitialData } from './useInitialData';
import { useInitializeNextUnit } from './useInitializeNextUnit';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';
import { useStayLoggedIn } from '@/hooks/useStayLoggedIn';
import type { EnrollmentWithStudentCourseAndUnits } from '@/services/students/enrollmentService';

type Props = {
  studentId: number;
  courseId: number;
};

export const CourseView = ({ studentId, courseId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  // we're going to be linking to static resources that require the user to be
  // logged in, and those resources don't have a refresh mechanism
  useStayLoggedIn();

  useInitialData(dispatch, studentId, courseId);

  const initializeNextUnit$ = useInitializeNextUnit(dispatch);

  const handleNewUnitClick = useCallback((e: MouseEvent<HTMLTableRowElement>, unitId: string): void => {
    void router.push(router.asPath + '/units/' + unitId);
  }, [ router ]);

  const nextUnit = useMemo(() => getNextUnit(state.enrollment), [ state.enrollment ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.enrollment) {
    return (
      <>
        <Section>
          <CourseHeaderImage courseId={courseId} />
          <div className="container text-white" aria-hidden="true">
            <div className="row">
              <div className="col-12 col-lg-6">
                <h1 className="mb-0 placeholder-glow"><span className="placeholder col-8" /></h1>
                <p className="lead mb-0 placeholder-glow"><span className="placeholder col-6" /></p>
                <p className="lead mb-0 placeholder-glow"><span className="placeholder col-6" /></p>
              </div>
              <div className="col-12 col-lg-6">
                <h2 className="h4 placeholder-glow"><span className="placeholder col-6" /></h2>
                <div className="placeholder-glow mb-4" style={{ height: 80 }}><span className="placeholder col-12 h-100" /></div>
                <button className="btn btn-primary disabled placeholder" style={{ width: 120 }} />
              </div>
            </div>
          </div>
        </Section>
        <Section>
          <div className="container" aria-hidden="true">
            <h2>Lessons</h2>
          </div>
        </Section>
      </>
    );
  }

  if (state.enrollment.course.unitType !== 1) {
    // courses with the old units system should use the old page
    window.location.href = `/students/course-materials/new.bs.php?course_id=${courseId}`;
    return null;
  }

  const handleInitializeButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    initializeNextUnit$.next({
      processingState: state.form.processingState,
      studentId,
      courseId,
    });
  };

  return (
    <>
      <Section>
        <CourseHeaderImage courseId={courseId} />
        <div className="container text-white">
          <div className="row">
            <div className="col-12 col-lg-6">
              <h1 className="mb-0 text-shadow">{state.enrollment.course.name}</h1>
              <p className="lead mb-0 text-shadow">Student Number: <strong>{state.enrollment.course.code}&thinsp;{state.enrollment.studentNumber}</strong></p>
              {state.enrollment.tutor && <p className="lead mb-0 text-shadow">Tutor: <strong>{state.enrollment.tutor.firstName} {state.enrollment.tutor.lastName}</strong></p>}
            </div>
            <div className="col-12 col-lg-6">
              <UnitsTable newUnits={state.enrollment.newUnits} onNewUnitClick={handleNewUnitClick} />
              {nextUnit.success
                ? (
                  <div className="d-flex align-items-center">
                    <button onClick={handleInitializeButtonClick} className="btn btn-primary" style={{ width: 120 }}>
                      {state.form.processingState === 'initializing'
                        ? <Spinner size="sm" />
                        : <>Start Unit {nextUnit.unitLetter}</>
                      }
                    </button>
                    {state.form.processingState === 'initialize error' && <span className="text-danger ms-2">{state.form.errorMessage ?? 'initializing'}</span>}
                  </div>
                )
                : <NextUnitMessage nextUnit={nextUnit} />
              }
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2>Lessons</h2>
          {state.enrollment.course.newMaterialUnits.map(u => (
            <MaterialUnit key={u.materialUnitId} courseId={courseId} unit={u} />
          ))}
          <Link href={`${endpoint}/students/${studentId}/static/lessons/95/6630b210-de75-11ec-bbd6-b5db70b35693/content`}><a target="_blank" rel="noopener noreferrer">sdkjfhsdkjfhdsf</a></Link>
        </div>
      </Section>
    </>
  );
};

const NextUnitMessage = ({ nextUnit }: { nextUnit: NextUnitResult }): ReactElement | null => {
  if (nextUnit.success) {
    return null;
  }
  switch (nextUnit.error) {
    case 'loading':
      return null;
    case 'arrears':
      return <p>Account is in arrears. Please contact the school.</p>;
    case 'on hold':
      return <p>Account is on hold. Please contact the school.</p>;
    case 'incomplete':
      return null;
    case 'disabled':
      return <p>This course is undergoing maintenance. Please check back in a few minutes.</p>;
    case 'complete':
      return <p>Assignments complete!</p>;
  }
};

type NextUnitResult = {
  success: true;
  unitLetter: string;
} | {
  success: false;
  error: 'loading' | 'arrears' | 'on hold' | 'incomplete' | 'disabled' | 'complete';
};

const getNextUnit = (enrollment?: EnrollmentWithStudentCourseAndUnits): NextUnitResult => {
  if (!enrollment) {
    return { success: false, error: 'loading' };
  }

  if (enrollment.student.arrears) {
    return { success: false, error: 'arrears' };
  }

  if (enrollment.onHold) {
    return { success: false, error: 'on hold' };
  }

  // make sure there are no open (unskipped or unmarked) units
  if (!enrollment.newUnits.every(u => u.skipped || u.closed)) {
    return { success: false, error: 'incomplete' };
  }

  if (!enrollment.course.newUnitsEnabled) {
    return { success: false, error: 'disabled' };
  }

  const sortedUnitTemplates = enrollment.course.newUnitTemplates.sort((a, b) => {
    if (a.order === b.order) {
      return a.unitLetter.localeCompare(b.unitLetter);
    }
    return a.order - b.order;
  });
  for (const t of sortedUnitTemplates) {
    if (!enrollment.newUnits.some(u => u.unitLetter === t.unitLetter)) {
      return { success: true, unitLetter: t.unitLetter };
    }
  }
  return { success: false, error: 'complete' };
};
