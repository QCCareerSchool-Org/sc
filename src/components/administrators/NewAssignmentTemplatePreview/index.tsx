import { useRouter } from 'next/router';
import { ReactElement, useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { NewPartTemplatePreview } from './NewPartTemplatePreview';
import { initialState, reducer } from './state';
import { newAssignmentTemplateService } from '@/services/administrators';
import { HttpServiceError } from '@/services/httpService';
import { navigateToLogin } from 'src/navigateToLogin';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
};

export const NewAssignmentTemplatePreview = ({ administratorId, schoolId, courseId, unitId, assignmentId }: Props): ReactElement | null => {
  const router = useRouter();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useEffect(() => {
    const destroy$ = new Subject<void>();

    // load the initial data
    newAssignmentTemplateService.getAssignmentWithInputs(administratorId, schoolId, courseId, unitId, assignmentId).pipe(
      takeUntil(destroy$),
    ).subscribe({
      next: assignmentTemplate => {
        dispatch({ type: 'LOAD_ASSIGNMENT_TEMPLATE_SUCCEEDED', payload: assignmentTemplate });
      },
      error: err => {
        let errorCode: number | undefined;
        if (err instanceof HttpServiceError) {
          if (err.login) {
            return navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_ASSIGNMENT_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId ]);

  if (!state.assignmentTemplate) {
    return null;
  }

  return (
    <>
      <section>
        <div className="container">
          <h1>{state.assignmentTemplate.title ?? `Assignment ${state.assignmentTemplate.assignmentNumber}`}</h1>
          {state.assignmentTemplate.description && <p className="lead">{state.assignmentTemplate.description}</p>}
        </div>
      </section>
      {state.assignmentTemplate.newPartTemplates.map(p => <NewPartTemplatePreview key={p.partTemplateId} newPartTemplate={p} />)}
    </>
  );
};
