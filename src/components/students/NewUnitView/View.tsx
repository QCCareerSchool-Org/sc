import { ReactElement } from 'react';
import { Subject } from 'rxjs';

import { formatDate } from '../../../formatDate';
import { AssignmentSection } from './AssignmentSection';
import { AssignmentStatus } from './AssignmentStatus';
import { SkipSection } from './SkipSection';
import type { State } from './state';
import { SubmitSection } from './SubmitSection';

type Props = {
  state: State;
  submit$: Subject<void>;
  skip$: Subject<void>;
};

export const View = ({ state, submit$, skip$ }: Props): ReactElement | null => {
  if (!state.unit) {
    return null;
  }

  const showAssignments = (!!state.unit.marked || !(!!state.unit.skipped || !!state.unit.submitted));

  const status = state.unit.marked
    ? 'Marked'
    : state.unit.submitted
      ? 'Submitted'
      : state.unit.adminComment
        ? 'Returned for Changes'
        : 'In Progress';

  return (
    <>
      <section>
        <div className="container">
          <h1>Unit {state.unit.unitLetter}{state.unit.title && <>: {state.unit.title}</>}</h1>
          {state.unit.description && <p>{state.unit.description}</p>}
          <table className="table table-bordered bg-white w-auto">
            <tbody>
              <tr><th scope="row">Started</th><td>{formatDate(state.unit.created)}</td></tr>
              <tr><th scope="row">Submitted</th><td>{state.unit.submitted ? formatDate(state.unit.submitted) : '---'}</td></tr>
              <tr><th scope="row">Marked</th><td>{state.unit.marked ? formatDate(state.unit.marked) : '---'}</td></tr>
              <tr><th scope="row">Status</th><td>{status}</td></tr>
            </tbody>
          </table>
          <AssignmentStatus unit={state.unit} />
        </div>
      </section>
      {showAssignments && <AssignmentSection unit={state.unit} />}
      {!state.unit.submitted && (
        <>
          <SubmitSection unit={state.unit} submitState={state.submit} skipState={state.skip} submit$={submit$} errorMessage={state.submitErrorMessage} />
          {state.unit.optional && <SkipSection submitState={state.submit} skipState={state.skip} skip$={skip$} errorMessage={state.skipErrorMessage} />}
        </>
      )}
    </>
  );
};
