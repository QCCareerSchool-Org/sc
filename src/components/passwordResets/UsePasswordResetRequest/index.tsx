import ErrorPage from 'next/error';
import Link from 'next/link';
import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { memo, useReducer, useRef } from 'react';

import { Invalid } from './Invalid';
import { PasswordTips } from './PasswordTips';
import type { State } from './state';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { usePasswordChange } from './usePasswordChange';
import { Section } from '@/components/Section';

type Props = {
  id: number;
  code: string;
};

export const UsePasswordResetRequest = memo(({ id, code }: Props): ReactElement | null => {
  const formId = useRef(Math.random().toString(32).slice(2));

  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(id, code, dispatch);
  const passwordChange$ = usePasswordChange(dispatch);

  if (state.error) {
    return <ErrorPage statusCode={state.errorCode ?? 500} />;
  }

  if (!state.passwordResetRequest) {
    return null;
  }

  if (state.passwordResetRequest.used) {
    return <Invalid type="already used" />;
  }

  if (state.passwordResetRequest.expiryDate && state.passwordResetRequest.expiryDate <= new Date()) {
    return <Invalid type="expired" />;
  }

  const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = () => { /* empty */ };

  const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'PASSWORD_CHANGED', payload: e.target.value });
  };

  const handlePasswordRepeatChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'PASSWORD_REPEAT_CHANGED', payload: e.target.value });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    passwordChange$.next({
      processingState: state.form.processingState,
      id,
      code,
      password: state.form.data.password,
    });
  };

  let valid = true;
  // check if there are any validation messages
  for (const key in state.form.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(state.form.validationMessages, key)) {
      const validationMessage = key as keyof State['form']['validationMessages'];
      if (state.form.validationMessages[validationMessage]) {
        valid = false;
      }
    }
  }

  const buttonDisabled = !valid || state.form.processingState === 'processing' || state.form.processingState === 'success';

  return (
    <Section>
      <div className="container">
        {state.complete
          ? (
            <>
              <h1>Password Updated</h1>
              <p className="lead">Your password has been updated. You can now <Link href="/login"><a>log in</a></Link>.</p>
            </>
          )
          : (
            <div className="row">
              <div className="col-12 col-md-8 col-lg-6 mb-4 mb-lg-0">
                <h1>Set a New Password</h1>
                <form onSubmit={handleSubmit}>
                  <div className="d-none">
                    <input onChange={handleUsernameChange} value={state.passwordResetRequest.username} type="text" autoComplete="username" id={formId.current + '_username'} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor={formId.current + '_password'} className="form-label">New Password</label>
                    <input onChange={handlePasswordChange} value={state.form.data.password} type="password" autoComplete="new-password" id={formId.current + '_password'} className={`form-control ${state.form.validationMessages.password ? 'is-invalid' : ''}`} required />
                    {state.form.validationMessages.password && <div className="invalid-feedback">{state.form.validationMessages.password}</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor={formId.current + '_passwordRepeat'} className="form-label">Repeat New Password</label>
                    <input onChange={handlePasswordRepeatChange} value={state.form.data.passwordRepeat} autoComplete="new-password" type="password" id={formId.current + '_passwordRepeat'} className={`form-control ${state.form.validationMessages.passwordRepeat ? 'is-invalid' : ''}`} required />
                    {state.form.validationMessages.passwordRepeat && <div className="invalid-feedback">{state.form.validationMessages.passwordRepeat}</div>}
                  </div>
                  {state.form.validationMessages.form && (
                    <div className="alert alert-danger mb-3">{state.form.validationMessages.form}</div>
                  )}
                  <button disabled={buttonDisabled} className="btn btn-primary" style={{ width: 160 }}>Change Password</button>
                </form>
              </div>
              <div className="col-12 col-md-8 col-lg-6">
                <PasswordTips />
              </div>
            </div>
          )
        }
      </div>
    </Section>
  );
});

UsePasswordResetRequest.displayName = 'UsePasswordResetRequest';
