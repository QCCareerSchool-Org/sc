import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FC, MouseEvent } from 'react';
import { useCallback, useReducer } from 'react';

import { formatDateTime } from '../../../formatDate';
import { NewAssignmentTemplateAddForm } from './NewAssignmentTemplateAddForm';
import { NewAssignmentTemplateList } from './NewAssignmentTemplateList';
import { NewSubmissionTemplateEditForm } from './NewSubmissionTemplateEditForm';
import type { State } from './state';
import { initialState, reducer } from './state';
import { useAssignmentTemplateInsert } from './useAssignmentTemplateInsert';
import { useInitialData } from './useInitialData';
import { useSubmissionTemplateDelete } from './useSubmissionTemplateDelete';
import { useSubmissionTemplateSave } from './useSubmissionTemplateSave';
import { Section } from '@/components/Section';
import type { Country } from '@/domain/country';
import type { NewSubmissionTemplate } from '@/domain/newSubmissionTemplate';
import type { NewSubmissionTemplatePrice } from '@/domain/newSubmissionTemplatePrice';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';

type Props = {
  administratorId: number;
  submissionId: string;
};

const changesPresent = (submissionTemplate: NewSubmissionTemplate | undefined, formData: State['form']['data']): boolean => {
  if (!submissionTemplate) {
    return false;
  }
  if (submissionTemplate.title !== (formData.title || null)) {
    return true;
  }
  if (submissionTemplate.description !== (formData.description || null)) {
    return true;
  }
  if (submissionTemplate.unitLetter !== formData.unitLetter) {
    return true;
  }
  if (submissionTemplate.optional !== formData.optional) {
    return true;
  }
  if (submissionTemplate.order !== parseInt(formData.order, 10)) {
    return true;
  }
  return false;
};

export const NewSubmissionTemplateEdit: FC<Props> = ({ administratorId, submissionId }) => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPresent(state.newSubmissionTemplate, state.form.data));

  useInitialData(dispatch, administratorId, submissionId);

  const unitSave$ = useSubmissionTemplateSave(dispatch);
  const unitDelete$ = useSubmissionTemplateDelete(dispatch);
  const assignmentInsert$ = useAssignmentTemplateInsert(dispatch);

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'TITLE_CHANGED', payload: e.target.value });
  }, []);

  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const handleMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'MARKING_CRITERIA_CHANGED', payload: e.target.value });
  }, []);

  const handleUnitLetterChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'UNIT_LETTER_CHANGED', payload: e.target.value });
  }, []);

  const handleOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ORDER_CHANGED', payload: e.target.value });
  }, []);

  const handleOptionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  const handleAssignmentRowClick = useCallback((e: MouseEvent<HTMLTableRowElement>, assignmentId: string): void => {
    void router.push(`/administrators/new-assignment-templates/${assignmentId}`);
  }, [ router ]);

  const handleAssignmentTitleChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_TITLE_CHANGED', payload: e.target.value });
  }, []);

  const handleAssignmentDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_DESCRIPTION_CHANGED', payload: e.target.value });
  }, []);

  const handleAssignmentDescriptionTypeChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_DESCRIPTION_TYPE_CHANGED', payload: e.target.value });
  }, []);

  const handleAssignmentMarkingCriteriaChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_MARKING_CRITERIA_CHANGED', payload: e.target.value });
  }, []);

  const handleAssignmentAssignmentNumberChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_ASSIGNMENT_NUMBER_CHANGED', payload: e.target.value });
  }, []);

  const handleAssignmentOptionalChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ASSIGNMENT_TEMPLATE_OPTIONAL_CHANGED', payload: e.target.checked });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newSubmissionTemplate) {
    return null;
  }

  const courseId = state.newSubmissionTemplate.courseId;
  const priceHref = `/administrators/submission-template-prices/edit?courseId=${encodeURIComponent(courseId)}`;

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Submission Template</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewSubmissionTemplateEditForm
                administratorId={administratorId}
                submissionId={submissionId}
                submissionTemplate={state.newSubmissionTemplate}
                formState={state.form}
                save$={unitSave$}
                delete$={unitDelete$}
                onTitleChange={handleTitleChange}
                onDescriptionChange={handleDescriptionChange}
                onMarkingCriteriaChange={handleMarkingCriteriaChange}
                onUnitLetterChange={handleUnitLetterChange}
                onOrderChange={handleOrderChange}
                onOptionalChange={handleOptionalChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto bg-white">
                  <tbody>
                    <tr><th scope="row">Course</th><td>{state.newSubmissionTemplate.course.name}</td></tr>
                    <tr><th scope="row">Assignment Templates</th><td>{state.newSubmissionTemplate.newAssignmentTemplates.length}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newSubmissionTemplate.created)}</td></tr>
                    {state.newSubmissionTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newSubmissionTemplate.modified)}</td></tr>}
                    <tr>
                      <th scope="row">Prices</th>
                      <td>
                        {state.newSubmissionTemplate.prices.sort(priceSort).map(p => {
                          if (p.country === null) {
                            return <div key={p.unitTemplatePriceId}>Default: {p.currency.symbol}{p.price.toFixed(2)} ({p.currency.code}) <Link href={priceHref}><a>Edit</a></Link></div>;
                          }
                          return <div key={p.unitTemplatePriceId}>{p.country.code}: {p.currency.symbol}{p.price.toFixed(2)} ({p.currency.code}) <Link href={priceHref + '&countryId=' + encodeURIComponent(p.country.countryId)}><a>Edit</a></Link></div>;
                        })}
                        {!state.newSubmissionTemplate.prices.some(p => p.country === null) && <div className="text-danger">No default price set <Link href={priceHref}><a>Set Now</a></Link></div>}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          <h2 className="h3">Assignment Templates</h2>
          <div className="row">
            <div className="col-12 col-xl-6">
              <NewAssignmentTemplateList assignments={state.newSubmissionTemplate.newAssignmentTemplates} onClick={handleAssignmentRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewAssignmentTemplateAddForm
                administratorId={administratorId}
                submissionId={submissionId}
                formState={state.newAssignmentTemplateForm}
                insert$={assignmentInsert$}
                onTitleChange={handleAssignmentTitleChange}
                onDescriptionChange={handleAssignmentDescriptionChange}
                onDescriptionTypeChange={handleAssignmentDescriptionTypeChange}
                onMarkingCriteriaChange={handleAssignmentMarkingCriteriaChange}
                onAssignmentNumberChange={handleAssignmentAssignmentNumberChange}
                onOptionalChange={handleAssignmentOptionalChange}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

type Price = NewSubmissionTemplatePrice & { country: Country | null };

const priceSort = (a: Price, b: Price): number => {
  if (a.country === null && b.country === null) {
    return 0;
  } else if (a.country === null) {
    return 1;
  } else if (b.country === null) {
    return -1;
  }
  return a.country.code.localeCompare(b.country.code);
};
