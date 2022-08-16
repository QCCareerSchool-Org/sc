import NextError from 'next/error';
import type { FC } from 'react';
import { useReducer } from 'react';

import { endpoint } from '../../../basePath';
import { NewAssignmentMediumView } from './NewAssignmentMediumView';
import { NewPartTemplatePreview } from './NewPartTemplatePreview';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { DownloadMedium } from '@/components/DownloadMedium';
import { Section } from '@/components/Section';
import type { NewDescriptionType } from '@/domain/newDescriptionType';

type Props = {
  administratorId: number;
  assignmentId: string;
};

export const NewAssignmentTemplatePreview: FC<Props> = ({ administratorId, assignmentId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, administratorId, assignmentId);

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
          {state.assignmentTemplate.description && <Description description={state.assignmentTemplate.description} descriptionType={state.assignmentTemplate.descriptionType} />}
          <div className="row">
            <div className="col-12 col-lg-10 col-xl-8">
              {state.assignmentTemplate.newAssignmentMedia.filter(m => m.type !== 'download').map(m => (
                <figure key={m.assignmentMediumId} className={`figure ${m.type}Figure d-block`}>
                  <NewAssignmentMediumView className="figure-img mb-0 mw-100" administratorId={administratorId} newAssignmentMedium={m} />
                  <figcaption className="figure-caption">{m.caption}</figcaption>
                </figure>
              ))}
              {state.assignmentTemplate.newAssignmentMedia.filter(m => m.type === 'download').map(m => {
                const href = `${endpoint}/administrators/${administratorId}/newAssignmentMedia/${m.assignmentMediumId}/file`;
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

type DescriptionProps = {
  description: string;
  descriptionType: NewDescriptionType;
};

const Description: FC<DescriptionProps> = ({ description, descriptionType }) => {
  if (descriptionType === 'text') {
    return (
      <>
        {description?.replace(/\r\n/gu, '\n').split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
      </>
    );
  }
  if (descriptionType === 'html') {
    return <div className="htmlDescription" dangerouslySetInnerHTML={{ __html: description }} />;
  }
  return null;
};
