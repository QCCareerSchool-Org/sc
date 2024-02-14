import type { FC, FormEventHandler } from 'react';
import { useId, useReducer } from 'react';

import { initialState, reducer } from './state';
import { Section } from '@/components/Section';

type Props = {
  auditorId: number;
};

export const ChangeEmailAddress: FC<Props> = ({ auditorId }) => {
  const id = useId();

  const [ state, dispatch ] = useReducer(reducer, initialState);

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
  };

  return (
    <Section>
      <div className="container">
        <h1>Change Email Address</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor={`${id}emailAddress`}>New Email Address</label>
            <input type="email" name="emailAddress" id={`${id}emailAddress`} value={state.form.data.newEmailAddress} />
          </div>
          <div className="mb-3">
            <label htmlFor={`${id}password`}>Password</label>
            <input type="password" name="password" id={`${id}password`} value={state.form.data.password} />
          </div>
          <button type="submit" className="btn btn-primary">Update Email Address</button>
        </form>
      </div>
    </Section>
  );
};
