import NextError from 'next/error';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, MouseEvent, ReactElement } from 'react';
import { useCallback, useReducer } from 'react';

import { formatDateTime } from '../../../formatDate';
import { NewAssignmentTemplateAddForm } from './NewAssignmentTemplateAddForm';
import { NewAssignmentTemplateList } from './NewAssignmentTemplateList';
import { NewUnitTemplateEditForm } from './NewUnitTemplateEditForm';
import type { State } from './state';
import { initialState, reducer } from './state';
import { useAssignmentInsert } from './useAssignmentInsert';
import { useInitialData } from './useInitialData';
import { useUnitDelete } from './useUnitDelete';
import { useUnitSave } from './useUnitSave';
import { Section } from '@/components/Section';
import type { Country } from '@/domain/country';
import type { NewUnitTemplate } from '@/domain/newUnitTemplate';
import type { NewUnitTemplatePrice } from '@/domain/newUnitTemplatePrice';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';

type Props = {
  administratorId: number;
  unitId: string;
};

const changesPreset = (unitTemplate: NewUnitTemplate | undefined, formData: State['form']['data']): boolean => {
  if (!unitTemplate) {
    return false;
  }
  if (unitTemplate.title !== (formData.title || null)) {
    return true;
  }
  if (unitTemplate.description !== (formData.description || null)) {
    return true;
  }
  if (unitTemplate.unitLetter !== formData.unitLetter) {
    return true;
  }
  if (unitTemplate.optional !== formData.optional) {
    return true;
  }
  if (unitTemplate.order !== parseInt(formData.order, 10)) {
    return true;
  }
  return false;
};

export const NewUnitTemplateEdit = ({ administratorId, unitId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPreset(state.newUnitTemplate, state.form.data));

  useInitialData(dispatch, administratorId, unitId);

  const unitSave$ = useUnitSave(dispatch);
  const unitDelete$ = useUnitDelete(dispatch);
  const assignmentInsert$ = useAssignmentInsert(dispatch);

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

  if (!state.newUnitTemplate) {
    return null;
  }

  const courseId = state.newUnitTemplate.courseId;

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Unit Template</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewUnitTemplateEditForm
                administratorId={administratorId}
                unitId={unitId}
                unitTemplate={state.newUnitTemplate}
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
                <table className="table table-bordered w-auto ms-lg-auto">
                  <tbody>
                    <tr><th scope="row">Course</th><td>{state.newUnitTemplate.course.name}</td></tr>
                    <tr><th scope="row">Assignment Templates</th><td>{state.newUnitTemplate.newAssignmentTemplates.length}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newUnitTemplate.created)}</td></tr>
                    {state.newUnitTemplate.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newUnitTemplate.modified)}</td></tr>}
                    <tr>
                      <th scope="row">Prices</th>
                      <td>
                        {state.newUnitTemplate.prices.length === 0
                          ? <span className="text-danger">None</span>
                          : state.newUnitTemplate.prices.sort(priceSort).map(p => {
                            const href = `/administrators/unit-prices/edit?courseId=${encodeURIComponent(courseId)}`;
                            if (p.country === null) {
                              return <Link key={p.unitTemplatePriceId} href={href}><a className="me-1">Default</a></Link>;
                            }
                            return <Link key={p.unitTemplatePriceId} href={href + '&countryId=' + encodeURIComponent(p.country.countryId)}><a className="me-1">{p.country.code}</a></Link>;
                          })
                        }
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
              <NewAssignmentTemplateList assignments={state.newUnitTemplate.newAssignmentTemplates} onClick={handleAssignmentRowClick} />
            </div>
            <div className="col-12 col-md-10 col-lg-8 col-xl-6 mb-3 mb-xl-0">
              <NewAssignmentTemplateAddForm
                administratorId={administratorId}
                unitId={unitId}
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

type Price = NewUnitTemplatePrice & { country: Country | null };

const priceSort = (a: Price, b: Price): number => {
  if (a.country === null && b.country === null) {
    return 0;
  } else if (a.country === null) {
    return -1;
  } else if (b.country === null) {
    return 1;
  }
  return a.country.code.localeCompare(b.country.code);
};
