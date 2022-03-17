import NextError from 'next/error';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import { useEffect, useReducer } from 'react';
import { Subject, takeUntil } from 'rxjs';

import { NewAssignmentMediumView } from './NewAssignmentMediumView';
import { NewPartTemplatePreview } from './NewPartTemplatePreview';
import { initialState, reducer } from './state';
import { useScreenWidth } from '@/hooks/useScreenWidth';
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
  const screenWidth = useScreenWidth();

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
            return void navigateToLogin(router);
          }
          errorCode = err.code;
        }
        dispatch({ type: 'LOAD_ASSIGNMENT_TEMPLATE_FAILED', payload: errorCode });
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, administratorId, schoolId, courseId, unitId, assignmentId ]);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.assignmentTemplate) {
    return null;
  }

  return (
    <>
      <section>
        <div className="container">
          {state.assignmentTemplate.optional && <span className="text-danger">OPTIONAL</span>}
          <h1>Assignment {state.assignmentTemplate.assignmentNumber}{state.assignmentTemplate.title && <>: {state.assignmentTemplate.title}</>}</h1>
          {state.assignmentTemplate.description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
          <div className="row">
            {state.assignmentTemplate.newAssignmentMedia.filter(m => m.type !== 'download').map(m => (
              <div key={m.assignmentMediumId} className="col-12 col-lg-10 col-xl-8">
                <figure className={`figure ${m.type}Figure`}>
                  <NewAssignmentMediumView className="figure-img mb-0 mw-100" administratorId={administratorId} schoolId={schoolId} courseId={courseId} unitId={unitId} assignmentId={assignmentId} newAssignmentMedium={m} />
                  <figcaption className="figure-caption">{m.caption}</figcaption>
                </figure>
              </div>
            ))}
          </div>
          <div className="d-flex flex-wrap align-items-top">
            {state.assignmentTemplate.newAssignmentMedia.filter(m => m.type === 'download').map(m => (
              <figure key={m.assignmentMediumId} className={`figure ${m.type}Figure`}>
                <NewAssignmentMediumView className="figure-img mb-0 mw-100" administratorId={administratorId} schoolId={schoolId} courseId={courseId} unitId={unitId} assignmentId={assignmentId} newAssignmentMedium={m} />
                <figcaption className="figure-caption">{m.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      {state.assignmentTemplate.newPartTemplates.map(p => (
        <NewPartTemplatePreview
          key={p.partTemplateId}
          administratorId={administratorId}
          schoolId={schoolId}
          courseId={courseId}
          unitId={unitId}
          assignmentId={assignmentId}
          newPartTemplate={p}
        />
      ))}
      <style jsx>{`
      .downloadFigure {
        ${screenWidth >= 992 ? 'width: 128px; margin-right: 1rem' : screenWidth >= 360 ? 'width: 96px; margin-right: 1rem' : 'width: 100%'}
      }
      `}</style>
    </>
  );
};
