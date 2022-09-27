import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { memo, useReducer } from 'react';

import { Section } from '../../Section';
import { Spinner } from '../../Spinner';
import { initialState, reducer } from './state';
import { usePasswordResetRequest } from './usePasswordResetRequest';

export const CreatePasswordResetRequest: FC = memo(() => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const passwordResetRequest$ = usePasswordResetRequest(dispatch);

  const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'USERNAME_CHANGED', payload: e.target.value });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    passwordResetRequest$.next({
      processingState: state.form.processingState,
      username: state.form.data.username,
    });
  };

  const buttonDisabled = state.form.processingState === 'processing' || state.form.processingState === 'success' || state.form.data.username.length === 0;

  return (
    <>
      <Section>
        <div className="container">
          {state.result
            ? (
              <div className="row">
                <div className="col-12 col-lg-10 col-xl-8">
                  <h1>Email Sent</h1>
                  <p>Please check your inbox for further instructions. Instructions were sent to the email address <strong>{state.result.maskedEmailAddress}</strong>.</p>
                  <p>We use asterisks (&ldquo;*&rdquo;) to hide a portion of your email address and protect your privacy. If you can't identify the email address, you can contact Student Support for further assistance. If you wish to change this address in the future, you can log into the student center and click the &ldquo;Change Email Address&rdquo; button under the &ldquo;Account&rdquo; menu.</p>
                  <p>If you did not receive the email, please <strong className="text-danger">check your spam folder</strong>. If you no longer have access to the email address we have on file, please contact the School for more information.</p>
                </div>
              </div>
            )
            : (
              <>
                <h1>Password Reset</h1>
                <div className="row">
                  <div className="col-12 col-md-6 col-lg-4">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="username">Username / Student Number</label>
                        <input onChange={handleUsernameChange} value={state.form.data.username} id="username" className="form-control" />
                      </div>
                      <div className="d-flex align-items-center">
                        <button className="btn btn-primary" disabled={buttonDisabled} style={{ width: 140 }}>
                          {state.form.processingState === 'processing' ? <Spinner size="sm" /> : 'Request Reset'}
                        </button>
                        {state.form.processingState === 'error' && <span className="ms-2 text-danger">{state.form.errorMessage ?? 'Error'}</span>}
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}
        </div>
      </Section>
    </>
  );
});

CreatePasswordResetRequest.displayName = 'CreatePasswordResetRequest';
