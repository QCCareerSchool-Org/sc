import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, MouseEvent, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { NewUnitTemplateAddForm } from './NewUnitTemplateAddForm';
import { NewUnitTemplateList } from './NewUnitTemplateList';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useUnitInsert } from './useUnitInsert';
import { Section } from '@/components/Section';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
};

export const CourseView = ({ administratorId, schoolId, courseId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(administratorId, schoolId, courseId, dispatch);

  const unitInsert$ = useUnitInsert(dispatch);

  const unitRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, unitId: string): void => {
    void router.push(`${router.asPath}/unitTemplates/${unitId}`);
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
      <Section>
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
      </Section>
      {state.course.unitType === 1 && (
        <Section>
          <div className="container">
            <h2 className="h3">Unit Templates</h2>
            <div className="row">
              <div className="col-12 col-xl-6">
                <NewUnitTemplateList units={state.course.newUnitTemplates} onClick={unitRowClick} />
                <div className="alert alert-info"><h3 className="h6">Unit Ordering</h3>Units are ordered by &ldquo;order&rdquo; then &ldquo;unit letter&rdquo;. As long as you follow a standard unit lettering scheme (e.g., &ldquo;A, B, C, ...&rdquo; or &ldquo;1, 2, 3, ...&rdquo;), you can leave each unit's &ldquo;order&rdquo; value set to 0.</div>
              </div>
              <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
                <NewUnitTemplateAddForm
                  administratorId={administratorId}
                  schoolId={schoolId}
                  courseId={courseId}
                  formState={state.newUnitTemplateForm}
                  insert$={unitInsert$}
                  titleChange={unitTitleChange}
                  descriptionChange={unitDescriptionChange}
                  unitLetterChange={unitUnitLetterChange}
                  orderChange={unitOrderChange}
                  optionalChange={unitOptionalChange}
                />
              </div>
            </div>
          </div>
        </Section>
      )}
    </>
  );
};
