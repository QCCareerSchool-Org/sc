import NextError from 'next/error';
import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { useCallback, useReducer } from 'react';

import { NewPartMediumEditForm } from './NewPartMediumEditForm';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useMediumDelete } from './useMediumDelete';
import { useMediumSave } from './useMediumSave';
import { Audio } from '@/components/Audio';
import { FileIcon } from '@/components/FileIcon';
import { Section } from '@/components/Section';
import { Video } from '@/components/Video';
import { useAdminServices } from '@/hooks/useAdminServices';
import { endpoint } from 'src/basePath';
import { formatDateTime } from 'src/formatDate';
import { humanReadableFileSize } from 'src/humanReadableFilesize';

type Props = {
  administratorId: number;
  mediumId: string;
};

export const NewPartMediumEdit: FC<Props> = ({ administratorId, mediumId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  const { newPartMediumService } = useAdminServices();

  useInitialData(dispatch, administratorId, mediumId);

  const mediumSave$ = useMediumSave(dispatch);
  const mediumDelete$ = useMediumDelete(dispatch);

  const handleCaptionChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'CAPTION_CHANGED', payload: e.target.value });
  }, []);

  const handleOrderChange: ChangeEventHandler<HTMLInputElement> = useCallback(e => {
    dispatch({ type: 'ORDER_CHANGED', payload: e.target.value });
  }, []);

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.newPartMedium) {
    return null;
  }

  const src = `${endpoint}/administrators/${administratorId}/newPartMedia/${state.newPartMedium.partMediumId}/file`;

  const handleDownloadClick: MouseEventHandler = e => {
    e.preventDefault();
    newPartMediumService.downloadPartMediumFile(administratorId, mediumId).subscribe();
  };

  return (
    <>
      <Section>
        <div className="container">
          <h1>Edit Part Media</h1>
          <div className="row">
            <div className="col-12 col-md-10 col-lg-7 col-xl-6 order-1 order-lg-0">
              <NewPartMediumEditForm
                administratorId={administratorId}
                mediumId={mediumId}
                formState={state.form}
                save$={mediumSave$}
                delete$={mediumDelete$}
                onCaptionChange={handleCaptionChange}
                onOrderChange={handleOrderChange}
              />
            </div>
            <div className="col-12 col-lg-5 col-xl-6 order-0 order-lg-1 d-flex flex-column flex-fill justify-content-between">
              <div>
                <table className="table table-bordered w-auto ms-lg-auto bg-white">
                  <tbody>
                    <tr><th scope="row">Part Template</th><td>{state.newPartMedium.newPartTemplate.title}</td></tr>
                    <tr><th scope="row">Linked Parts</th><td>{state.newPartMedium.newParts.length}</td></tr>
                    <tr><th scope="row">Filename</th><td>{state.newPartMedium.filename}</td></tr>
                    <tr><th scope="row">Type</th><td>{state.newPartMedium.type}</td></tr>
                    <tr><th scope="row">Mime Type</th><td>{state.newPartMedium.mimeTypeId}</td></tr>
                    <tr><th scope="row">Size</th><td>{humanReadableFileSize(state.newPartMedium.filesize)}</td></tr>
                    <tr><th scope="row">Created</th><td>{formatDateTime(state.newPartMedium.created)}</td></tr>
                    {state.newPartMedium.modified && <tr><th scope="row">Modified</th><td>{formatDateTime(state.newPartMedium.modified)}</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section>
        <div className="container">
          {state.newPartMedium.type === 'image' && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} className="mediaContent" alt={state.newPartMedium.caption} />
          )}
          {state.newPartMedium.type === 'video' && (
            <>
              <div>
                <Video src={src} className="mediaContent" controls preload="auto" playsInline />
              </div>
              <a href={src}>Download</a>
            </>
          )}
          {state.newPartMedium.type === 'audio' && (
            <>
              <div>
                <Audio src={src} controls preload="auto" />
              </div>
              <a href={src}>Download</a>
            </>
          )}
          {state.newPartMedium.type === 'download' && (
            <a onClick={handleDownloadClick} href={src} download><FileIcon mimeType={state.newPartMedium.mimeTypeId} size={96} /></a>
          )}
        </div>
      </Section>
    </>
  );
};
