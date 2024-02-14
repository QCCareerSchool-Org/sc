import type { ChangeEventHandler, Dispatch, FC, FormEventHandler } from 'react';
import { useId } from 'react';
import type { Subject } from 'rxjs';

import type { Action, State } from './state';
import type { StudentFilterEvent } from './useFilter';
import { Spinner } from '@/components/Spinner';

type Props = {
  auditorId: number;
  dispatch: Dispatch<Action>;
  formState: State['form'];
  filter$: Subject<StudentFilterEvent>;
};

export const StudentListFilterForm: FC<Props> = ({ auditorId, dispatch, formState, filter$ }) => {
  const id = useId();

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'NAME_CHANGED', payload: e.target.value });
  };

  const handleGroupChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'GROUP_CHANGED', payload: e.target.value });
  };

  const handleLocationChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'LOCATION_CHANGED', payload: e.target.value });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    filter$.next({
      auditorId,
      name: formState.data.name,
      group: formState.data.group,
      location: formState.data.location,
    });
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit}>
        <div className="row mb-3 g-3">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <label htmlFor={`${id}name`} className="form-label">Name</label>
            <input type="text" name="name" id={`${id}name`} value={formState.data.name} maxLength={191} onChange={handleNameChange} className="form-control" />
          </div>
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <label htmlFor={`${id}location`} className="form-label">Location</label>
            <input type="text" name="location" id={`${id}location`} value={formState.data.location} maxLength={191} onChange={handleLocationChange} className="form-control" />
          </div>
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <label htmlFor={`${id}group`} className="form-label">Group</label>
            <input type="text" name="group" id={`${id}group`} value={formState.data.group} maxLength={191} onChange={handleGroupChange} className="form-control" />
          </div>
        </div>
        <div className="d-flex align-items-center">
          <button type="submit" className="btn btn-primary">Filter</button>
          {formState.processingState === 'submitting' && <div className="ms-2"><Spinner size="sm" /></div>}
        </div>
      </form>
    </div>
  );
};
