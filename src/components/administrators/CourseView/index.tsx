import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, MouseEvent, ReactElement } from 'react';
import { memo, useCallback, useEffect, useReducer, useRef } from 'react';
import { catchError, EMPTY, exhaustMap, filter, Subject, takeUntil, tap } from 'rxjs';

import { NewUnitTemplateAddForm } from './NewUnitTemplateAddForm';
import { NewUnitTemplateList } from './NewUnitTemplateList';
import type { State } from './state';
import { initialState, reducer } from './state';
import { courseService, newUnitTemplateService } from '@/services/administrators';
import type { NewUnitTemplatePayload } from '@/services/administrators/newUnitTemplateService';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
};

export const CourseView = ({ administratorId, schoolId, courseId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const unitInsert$ = useRef(new Subject<{ processingState: State['newUnitTemplateForm']['processingState']; payload: NewUnitTemplatePayload }>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    courseService.getCourse(administratorId, schoolId, courseId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: schools => {
        dispatch({ type: 'LOAD_COURSE_SUCCEEDED', payload: schools });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_COURSE_FAILED', payload: errorCode });
      },
    });

    unitInsert$.current.pipe(
      filter(({ processingState }) => processingState !== 'inserting'),
      tap(() => dispatch({ type: 'ADD_UNIT_TEMPLATE_STARTED' })),
      exhaustMap(({ payload }) => newUnitTemplateService.addUnit(administratorId, schoolId, courseId, payload).pipe(
        tap({
          next: insertedUnit => dispatch({ type: 'ADD_UNIT_TEMPLATE_SUCCEEDED', payload: insertedUnit }),
          error: err => {
            let message = 'Insert failed';
            if (err instanceof HttpServiceError) {
              if (err.login) {
                return void navigateToLogin(router);
              }
              if (err.message) {
                message = err.message;
              }
            }
            dispatch({ type: 'ADD_UNIT_TEMPLATE_FAILED', payload: message });
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId ]);

  const unitRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, unitId: string): void => {
    void router.push(`${router.asPath}/newUnitTemplates/${unitId}`);
  }, [ router ]);

  const unitTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UNIT_TEMPLATE_TITLE_CHANGED', payload: e.target.value });
  }, []);

  const unitDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'UNIT_TEMPLATE_DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const unitUnitLetterChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UNIT_TEMPLATE_UNIT_LETTER_CHANGED', payload: e.target.value });
  }, []);

  const unitOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UNIT_TEMPLATE_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const unitOptionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UNIT_TEMPLATE_OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.course) {
    return null;
  }

  return (
    <>
      <section>
        <div className="container">
          <h1>Course: {state.course.name}</h1>
          <table className="table table-bordered w-auto">
            <tbody>
              <tr><th scope="row">School</th><td>{state.course.school.name}</td></tr>
              <tr><th scope="row">Code</th><td>{state.course.code}</td></tr>
              <tr><th scope="row">Version</th><td>{state.course.version}</td></tr>
              <tr><th scope="row">Course Guide</th><td>{state.course.courseGuide ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">Quizzes Enabled</th><td>{state.course.quizzesEnabled ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">No Tutor</th><td>{state.course.noTutor ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">Unit Type</th><td>{state.course.unitType === 0 ? 'old' : state.course.unitType === 1 ? 'new' : 'unknown'}</td></tr>
              <tr><th scope="row">Unit Templates</th><td>{state.course.newUnitTemplates.length}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
      {state.course.unitType === 1 && (
        <section>
          <div className="container">
            <h2 className="h3">Unit Templates</h2>
            <div className="row">
              <div className="col-12 col-xl-6">
                <NewUnitTemplateList units={state.course.newUnitTemplates} unitRowClick={unitRowClick} />
                <div className="alert alert-info"><h3 className="h6">Unit Ordering</h3>Units are ordered by &ldquo;order&rdquo; then &ldquo;unit letter&rdquo;. As long as you follow a standard unit lettering scheme (e.g., &ldquo;A, B, C, ...&rdquo; or &ldquo;1, 2, 3, ...&rdquo;), you can leave each unit's &ldquo;order&rdquo; value set to 0.</div>
              </div>
              <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
                <NewUnitTemplateAddForm
                  formState={state.newUnitTemplateForm}
                  insert$={unitInsert$.current}
                  titleChange={unitTitleChange}
                  descriptionChange={unitDescriptionChange}
                  unitLetterChange={unitUnitLetterChange}
                  orderChange={unitOrderChange}
                  optionalChange={unitOptionalChange}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
