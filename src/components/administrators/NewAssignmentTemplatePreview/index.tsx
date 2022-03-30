import NextError from 'next/error';
import type { ReactElement } from 'react';
import { useReducer } from 'react';

import { NewAssignmentMediumView } from './NewAssignmentMediumView';
import { NewPartTemplatePreview } from './NewPartTemplatePreview';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { DownloadMedium } from '@/components/DownloadMedium';
import { Section } from '@/components/Section';
import { endpoint } from 'src/basePath';

type Props = {
  administratorId: number;
  schoolId: number;
  courseId: number;
  unitId: string;
  assignmentId: string;
};

export const NewAssignmentTemplatePreview = ({ administratorId, schoolId, courseId, unitId, assignmentId }: Props): ReactElement | null => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(administratorId, schoolId, courseId, unitId, assignmentId, dispatch);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.assignmentTemplate) {
    return null;
  }

  return (
    <>
      <Section>
        <div className="container">
          {state.assignmentTemplate.optional && <span className="text-danger">OPTIONAL</span>}
          <h1>Assignment {state.assignmentTemplate.assignmentNumber}{state.assignmentTemplate.title && <>: {state.assignmentTemplate.title}</>}</h1>
          {state.assignmentTemplate.description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
          <div className="row">
            <div className="col-12 col-lg-10 col-xl-8">
              {state.assignmentTemplate.newAssignmentMedia.filter(m => m.type !== 'download').map(m => (
                <figure key={m.assignmentMediumId} className={`figure ${m.type}Figure d-block`}>
                  <NewAssignmentMediumView className="figure-img mb-0 mw-100" administratorId={administratorId} schoolId={schoolId} courseId={courseId} unitId={unitId} assignmentId={assignmentId} newAssignmentMedium={m} />
                  <figcaption className="figure-caption">{m.caption}</figcaption>
                </figure>
              ))}
              {state.assignmentTemplate.newAssignmentMedia.filter(m => m.type === 'download').map(m => {
                const href = `${endpoint}/administrators/${administratorId}/schools/${schoolId}/courses/${courseId}/newUnitTemplates/${unitId}/assignments/${assignmentId}/media/${m.assignmentMediumId}/file`;
                return (
                  <div key={m.assignmentMediumId} className="downloadMedium">
                    <a href={href} download>
                      <DownloadMedium medium={m} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>
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
      .downloadMedium {
        margin-bottom: 1rem;
      }
      .downloadMedium:last-of-type {
        margin-bottom: 0;
      }
      .downloadMedium a {
        text-decoration: none;
        color: inherit;
      }
      `}</style>
    </>
  );
};
