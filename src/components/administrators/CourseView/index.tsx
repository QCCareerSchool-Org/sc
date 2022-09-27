import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC, MouseEvent, MouseEventHandler } from 'react';
import { useCallback, useReducer } from 'react';

import { NewSubmissionTemplateAddForm } from './NewSubmissionTemplateAddForm';
import { NewSubmissionTemplateTable } from './NewSubmissionTemplateTable';
import { initialState, reducer } from './state';
import { UnitAddForm } from './UnitAddForm';
import { UnitsTable } from './UnitsTable';
import { useCourseEnable } from './useCourseEnable';
import { useInitialData } from './useInitialData';
import { useSubmissionTemplateInsert } from './useSubmissionTemplateInsert';
import { useUnitInsert } from './useUnitInsert';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  courseId: number;
};

export const CourseView: FC<Props> = ({ administratorId, courseId }) => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId, courseId);

  const submissionTemplateInsert$ = useSubmissionTemplateInsert(dispatch);
  const unitInsert$ = useUnitInsert(dispatch);
  const courseEnable$ = useCourseEnable(dispatch);

  const handleUnitRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, unitId: string): void => {
    void router.push(`/administrators/new-submission-templates/${unitId}`);
  }, [ router ]);

  const handleUnitTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'SUBMISSION_TEMPLATE_TITLE_CHANGED', payload: e.target.value });
  }, []);

  const handleUnitDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'SUBMISSION_TEMPLATE_DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const handleUnitMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'SUBMISSION_TEMPLATE_MARKING_CRITERIA_CHANGED', payload: e.target.value });
  }, []);

  const handleUnitUnitLetterChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'SUBMISSION_TEMPLATE_UNIT_LETTER_CHANGED', payload: e.target.value });
  }, []);

  const handleUnitOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'SUBMISSION_TEMPLATE_ORDER_CHANGED', payload: e.target.value });
  }, []);

  const handleUnitOptionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'SUBMISSION_TEMPLATE_OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  const handleMaterialUnitTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UNIT_TITLE_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialUnitUnitLetterChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UNIT_UNIT_LETTER_CHANGED', payload: e.target.value });
  }, []);

  const handleMaterialUnitOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UNIT_ORDER_CHANGED', payload: e.target.value });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.course) {
    return null;
  }

  const enableCourse = (enable: boolean): void => {
    courseEnable$.next({
      administratorId,
      courseId,
      enable,
      processingState: state.enableForm.processingState,
    });
  };

  const handleDisableClick: MouseEventHandler<HTMLButtonElement> = () => {
    if (confirm('Enabling editing will prevent students from initializing a new unit')) {
      enableCourse(false);
    }
  };

  const handleEnableClick: MouseEventHandler<HTMLButtonElement> = () => {
    enableCourse(true);
  };

  return (
    <>
      <Section>
        <div className="container">
          <h1>Course: {state.course.name}</h1>
          {!state.course.enabled && (
            <div className="alert alert-danger">
              This course is disabled. No additional students will be enrolled in this course.
            </div>
          )}
          <table className="table table-bordered w-auto bg-white">
            <tbody>
              <tr><th scope="row">School</th><td>{state.course.school.name}</td></tr>
              <tr><th scope="row">Code</th><td>{state.course.code}</td></tr>
              <tr><th scope="row">Version</th><td>{state.course.version}</td></tr>
              <tr><th scope="row">Course Guide</th><td>{state.course.courseGuide ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">Quizzes Enabled</th><td>{state.course.quizzesEnabled ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">No Tutor</th><td>{state.course.noTutor ? 'yes' : 'no'}</td></tr>
              <tr><th scope="row">Submission Type</th><td>{state.course.submissionType === 0 ? 'old' : state.course.submissionType === 1 ? 'new' : 'unknown'}</td></tr>
              <tr><th scope="row">Submission Templates</th><td>{state.course.newSubmissionTemplates.length}</td></tr>
            </tbody>
          </table>
        </div>
      </Section>
      {state.course.submissionType === 1 && (
        <>
          <Section>
            <div className="container">
              <h2 className="h3">Submission Templates</h2>
              <p className="lead">A <em>submission template</em> describes what will be submitted to a tutor, as a single package, for marking. It contains one or more <em>assignments</em>. When a student <strong>initializes</strong> his or her next <em>submission</em>, the content in the associated <em>submission template</em> will be used to create that <em>submission</em>. Changes made to a <em>submission template</em> the changes will only affect <em>submissions</em> <strong>initialized</strong> after that point.</p>
              {state.course.submissionType === 1 && (
                <div className="mb-4">
                  {state.course.submissionsEnabled
                    ? (
                      <>
                        <div className="d-flex align-items-center mb-3">
                          <button onClick={handleDisableClick} className="btn btn-secondary" style={{ width: 140 }} disabled={state.enableForm.processingState === 'saving'}>
                            {state.enableForm.processingState === 'saving' ? <Spinner size="sm" /> : 'Enable Editing'}
                          </button>
                          {state.enableForm.processingState === 'save error' && <span className="text-danger ms-2">{state.enableForm.errorMessage ?? 'Unable to save'}</span>}
                        </div>
                        <div className="alert alert-info">
                          <strong>Info:</strong> Editing is disabled. You will not be able to make changes to submissions until editing has been enbabled.
                        </div>
                      </>
                    )
                    : (
                      <>
                        <div className="d-flex align-items-center mb-3">
                          <button onClick={handleEnableClick} className="btn btn-secondary" style={{ width: 140 }} disabled={state.enableForm.processingState === 'saving'}>
                            {state.enableForm.processingState === 'saving' ? <Spinner size="sm" /> : 'Disable Editing'}
                          </button>
                          {state.enableForm.processingState === 'save error' && <span className="text-danger ms-2">{state.enableForm.errorMessage ?? 'Unable to save'}</span>}
                        </div>
                        <div className="alert alert-warning">
                          <strong>Warning:</strong> Editing is enabled. Students will not be able to initialize new units until editing has been disabled.
                        </div>
                      </>
                    )
                  }
                  {state.enableForm.processingState === 'save error' && <span className="text-danger ms-2">{state.enableForm.errorMessage ? state.enableForm.errorMessage : 'Error'}</span>}
                </div>
              )}
              <div className="row">
                <div className="col-12 col-xl-6">
                  {state.course.newSubmissionTemplates.length === 0
                    ? <p>No submission templates found.</p>
                    : <NewSubmissionTemplateTable submissions={state.course.newSubmissionTemplates} onClick={handleUnitRowClick} />
                  }
                  <div className="alert alert-info">
                    <h3 className="h6">Ordering</h3>
                    Submission templates are ordered by &ldquo;order&rdquo; then &ldquo;unit letter&rdquo;. As long as you follow a standard unit lettering scheme (e.g., &ldquo;A, B, C, ...&rdquo; or &ldquo;1, 2, 3, ...&rdquo;), you can leave each unit's &ldquo;order&rdquo; value set to 0.
                  </div>
                </div>
                <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
                  <NewSubmissionTemplateAddForm
                    administratorId={administratorId}
                    courseId={courseId}
                    formState={state.newSubmissionTemplateForm}
                    insert$={submissionTemplateInsert$}
                    onTitleChange={handleUnitTitleChange}
                    onDescriptionChange={handleUnitDescriptionChange}
                    onMarkingCriteriaChange={handleUnitMarkingCriteriaChange}
                    onUnitLetterChange={handleUnitUnitLetterChange}
                    onOrderChange={handleUnitOrderChange}
                    onOptionalChange={handleUnitOptionalChange}
                  />
                </div>
              </div>
            </div>
          </Section>
          <Section>
            <div className="container">
              <h2 className="h3">Units</h2>
              <p className="lead"><em>Units</em> are used to separate course materials into groups.</p>
              <div className="row">
                <div className="col-12 col-xl-6">
                  {state.course.units.length === 0
                    ? <p>No units found.</p>
                    : <UnitsTable units={state.course.units} />
                  }
                </div>
                <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
                  <UnitAddForm
                    administratorId={administratorId}
                    courseId={courseId}
                    formState={state.unitForm}
                    insert$={unitInsert$}
                    onTitleChange={handleMaterialUnitTitleChange}
                    onUnitLetterChange={handleMaterialUnitUnitLetterChange}
                    onOrderChange={handleMaterialUnitOrderChange}
                  />
                </div>
              </div>
            </div>
          </Section>
        </>
      )}
    </>
  );
};
