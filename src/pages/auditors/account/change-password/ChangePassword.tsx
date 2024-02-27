import { useId, useReducer } from 'react';
import type { ChangeEventHandler, FC, FormEventHandler } from 'react';

import { initialState, reducer } from './state';
import { useSubmit } from './useSubmit';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  auditorId: number;
};

export const ChangePassword: FC<Props> = ({ auditorId }) => {
  const id = useId();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const submit$ = useSubmit(dispatch);

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    submit$.next({
      auditorId,
      newPassword: state.form.data.newPassword,
      newPasswordRepeat: state.form.data.newPasswordRepeat,
      password: state.form.data.password,
      processingState: state.form.processingState,
    });
  };

  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'PASSWORD_CHANGED', payload: e.target.value });
  };

  const handleNewPasswordChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'NEW_PASSWORD_CHANGED', payload: e.target.value });
  };

  const handleNewPasswordRepeatChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'NEW_PASSWORD_REPEAT_CHANGED', payload: e.target.value });
  };

  return (
    <Section>
      <div className="container">
        <h1>Change Password</h1>
        <div className="row">
          <div className="col-12 col-lg-10 col-xl-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor={`${id}password`} className="form-label">Current Password</label>
                <input type="password" name="password" id={`${id}password`} className="form-control" autoComplete="password" value={state.form.data.password} onChange={handlePasswordChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor={`${id}newPassword`} className="form-label">New Password</label>
                <input type="password" name="newPassword" id={`${id}newPassword`} className="form-control" autoComplete="new-password" value={state.form.data.newPassword} onChange={handleNewPasswordChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor={`${id}newPasswordRepeat`} className="form-label">New Password</label>
                <input type="password" name="newPasswordRepeat" id={`${id}newPasswordRepeat`} className="form-control" autoComplete="new-password" value={state.form.data.newPasswordRepeat} onChange={handleNewPasswordRepeatChange} required />
              </div>
              <div className="d-flex align-items-center">
                <button type="submit" className="btn btn-primary">Update Password</button>
                {state.form.processingState === 'submitting' && <div className="ms-2"><Spinner size="sm" /></div>}
                {state.form.processingState === 'error' && <div className="ms-2 text-danger">{state.form.errorMessage ?? 'Update failed'}</div>}
                {state.form.processingState === 'success' && <div className="ms-2 text-success">Password updated</div>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Section>
  );
};
