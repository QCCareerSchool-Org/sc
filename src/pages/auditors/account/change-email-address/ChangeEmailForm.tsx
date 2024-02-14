import type { ChangeEventHandler, Dispatch, FC, FormEventHandler } from 'react';
import { useId } from 'react';
import type { Subject } from 'rxjs';

import type { Action, State } from './state';
import type { EmailChangeEvent } from './useSubmit';
import { Spinner } from '@/components/Spinner';

type Props = {
  auditorId: number;
  formState: State['form'];
  dispatch: Dispatch<Action>;
  submit$: Subject<EmailChangeEvent>;
};

export const ChangeEmailForm: FC<Props> = props => {
  const id = useId();

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();
    props.submit$.next({
      auditorId: props.auditorId,
      newEmailAddress: props.formState.data.newEmailAddress,
      password: props.formState.data.password,
      processingState: props.formState.processingState,
    });
  };

  const handleNewEmailAddressChange: ChangeEventHandler<HTMLInputElement> = e => {
    props.dispatch({ type: 'NEW_EMAIL_ADDRESS_CHANGED', payload: e.target.value });
  };

  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = e => {
    props.dispatch({ type: 'PASSWORD_CHANGED', payload: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <div className="mb-3">
        <label htmlFor={`${id}emailAddress`} className="form-label">New Email Address</label>
        <input type="email" name="emailAddress" id={`${id}emailAddress`} className="form-control" autoComplete="off" value={props.formState.data.newEmailAddress} onChange={handleNewEmailAddressChange} />
      </div>
      <div className="mb-3">
        <label htmlFor={`${id}password`} className="form-label">Password</label>
        <input type="password" name="password" id={`${id}password`} className="form-control" autoComplete="off" value={props.formState.data.password} onChange={handlePasswordChange} />
      </div>
      <div className="d-flex align-items-center">
        <button type="submit" className="btn btn-primary">Update Email Address</button>
        {props.formState.processingState === 'submitting' && <div className="ms-2"><Spinner size="sm" /></div>}
        {props.formState.processingState === 'error' && <div className="ms-2 text-danger">{props.formState.errorMessage ?? 'Update failed'}</div>}
        {props.formState.processingState === 'success' && <div className="ms-2 text-success">Email address updated</div>}
      </div>
    </form>
  );
};
