import type { FC, MouseEvent } from 'react';
import { useReducer } from 'react';

import { initialState, reducer } from './state';
import { StudentListFilterForm } from './StudentListFilterForm';
import { StudentTable } from './StudentTable';
import { useFilter } from './useFilter';
import { useInitialData } from './useInitialData';

type Props = {
  auditorId: number;
};

export const StudentList: FC<Props> = ({ auditorId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, auditorId);
  const filter$ = useFilter(dispatch);

  const handleGroupClick = (e: MouseEvent, group: string): void => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'GROUP_CHANGED', payload: group });
    filter$.next({
      auditorId,
      name: state.form.data.name,
      location: state.form.data.location,
      group,
      processingState: state.form.processingState,
    });
  };

  return (
    <section>
      <div className="container">
        <h1>Student List</h1>
        <StudentListFilterForm auditorId={auditorId} dispatch={dispatch} formState={state.form} filter$={filter$} />
        <StudentTable students={state.students} onGroupClick={handleGroupClick} />
      </div>
    </section>
  );
};
