import NextError from 'next/error';
import { useRouter } from 'next/router';
import { FormEventHandler, ReactElement, useCallback, useEffect, useReducer } from 'react';
import { catchError, EMPTY, Observable, Subject, takeUntil, tap } from 'rxjs';

import { NewTextBoxEditForm } from './NewTextBoxEditForm';
import { initialState, reducer, State } from './state';
import { NewTextBoxTemplate } from '@/domain/newTextBoxTemplate';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { NewTextBoxPayload, newTextBoxTemplateService } from '@/services/administrators';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
  partId: string;
  textBoxId: string;
};

const changesPreset = (textBoxTemplate: NewTextBoxTemplate | undefined, formData: State['form']['data']): boolean => {
  if (!textBoxTemplate) {
    return false;
  }
  if (textBoxTemplate.description !== (formData.description || null)) {
    return true;
  }
  if (textBoxTemplate.points !== formData.points) {
    return true;
  }
  if (textBoxTemplate.lines !== (formData.lines === '' ? null : parseInt(formData.lines, 10))) {
    return true;
  }
  if (textBoxTemplate.order !== formData.order) {
    return true;
  }
  if (textBoxTemplate.optional !== formData.optional) {
    return true;
  }
  return false;
};

export const NewTextBoxTemplateEdit = ({ administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useWarnIfUnsavedChanges(changesPreset(state.textBoxTemplate, state.form.data));

  useEffect(() => {
    const destroy$ = new Subject<void>();

    newTextBoxTemplateService.getTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: textBoxTemplate => {
        dispatch({ type: 'TEXT_BOX_TEMPLATE_LOAD_SUCCEEDED', payload: textBoxTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.refresh) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'TEXT_BOX_TEMPLATE_LOAD_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId ]);

  const saveTextBox = useCallback((payload: NewTextBoxPayload): Observable<NewTextBoxTemplate> => {
    return newTextBoxTemplateService.saveTextBox(administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId, payload).pipe(
      tap({
        next: textBoxTemplate => {
          dispatch({ type: 'TEXT_BOX_TEMPLATE_SAVE_SUCCEEDED', payload: textBoxTemplate });
        },
        error: err => {
          let message = 'Save failed';
          if (err instanceof HttpServiceError) {
            if (err.refresh) {
              return navigateToLogin(router);
            }
            if (err.message) {
              message = err.message;
            }
          }
          dispatch({ type: 'TEXT_BOX_TEMPLATE_SAVE_FAILED', payload: message });
        },
      }),
      catchError(() => EMPTY),
    );
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId, partId, textBoxId ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.textBoxTemplate) {
    return null;
  }

  const descriptionChange: FormEventHandler<HTMLTextAreaElement> = e => {
    const target = e.target as HTMLTextAreaElement;
    dispatch({ type: 'DESCRIPTION_UPDATED', payload: target.value });
  };

  const pointsChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'POINTS_UPDATED', payload: Math.max(parseInt(target.value, 10), 1) });
  };

  const linesChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'LINES_UPDATED', payload: target.value });
  };

  const orderChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'ORDER_UPDATED', payload: Math.max(parseInt(target.value, 10), 0) });
  };

  const optionalChange: FormEventHandler<HTMLInputElement> = e => {
    const target = e.target as HTMLInputElement;
    dispatch({ type: 'OPTIONAL_UPDATED', payload: target.checked });
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              <h1>Edit Text Box</h1>
              <NewTextBoxEditForm
                formState={state.form}
                save={saveTextBox}
                descriptionChange={descriptionChange}
                pointsChange={pointsChange}
                linesChange={linesChange}
                orderChange={orderChange}
                optionalChange={optionalChange}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
