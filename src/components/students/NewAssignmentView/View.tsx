import { useRouter } from 'next/router';
import type { MouseEventHandler, ReactElement } from 'react';

import { NewPartForm } from './NewPartForm';
import type { State } from './state';
import type { TextBoxFunction, UploadSlotFunction } from '.';

type Props = {
  state: State;
  updateText: TextBoxFunction;
  saveText: TextBoxFunction;
  uploadFile: UploadSlotFunction;
  deleteFile: UploadSlotFunction;
  downloadFile: UploadSlotFunction;
};

export const View = ({ state, updateText, saveText, uploadFile, deleteFile, downloadFile }: Props): ReactElement | null => {
  const router = useRouter();

  if (!state.assignment) {
    return null;
  }

  const unitId = state.assignment.unitId;

  const backButtonClick: MouseEventHandler<HTMLButtonElement> = e => {
    void router.push(`/students/units/${unitId}`, undefined, { scroll: false });
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>Assignment {state.assignment.assignmentNumber}{state.assignment.title && <>: {state.assignment.title}</>}</h1>
          {state.assignment.description && <p className="lead">{state.assignment.description}</p>}
        </div>
      </section>
      {state.assignment.parts.map(p => (
        <NewPartForm
          key={p.partId}
          part={p}
          updateText={updateText}
          saveText={saveText}
          uploadFile={uploadFile}
          deleteFile={deleteFile}
          downloadFile={downloadFile}
        />
      ))}
      <section className="bg-dark text-light">
        <div className="container">
          {state.assignment.complete
            ? <p className="lead">All mandatory answers are complete!</p>
            : <p className="lead">Some mandatory answers are incomplete</p>
          }
          <button onClick={backButtonClick} className="btn btn-primary" disabled={state.assignment.saveState !== 'saved'}>Return to Unit Overview</button>
        </div>
      </section>
    </>
  );
};
