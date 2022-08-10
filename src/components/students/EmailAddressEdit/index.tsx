import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { useId, useReducer } from 'react';

import { initialState, reducer } from './state';
import { useEmailAddressChange } from './useEmailAddressChange';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  studentId: number;
  crmId?: number;
};

export const EmailAddressEdit = ({ studentId, crmId }: Props): ReactElement | null => {
  const id = useId();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, studentId, crmId);

  const emailAddressChange$ = useEmailAddressChange(dispatch);

  if (!state.student) {
    return null;
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    emailAddressChange$.next({
      studentId,
      crmId,
      emailAddress: state.form.data.emailAddress,
      processingState: state.form.processingState,
    });
  };

  const handleEmailAddressChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'EMAIL_ADDRESS_UPDATED', payload: e.target.value });
  };

  const disabled = state.form.processingState === 'saving' || state.form.data.emailAddress.length === 0 || state.form.data.emailAddress === state.emailAddress;

  return (
    <Section>
      <div className="container">
        <h1>Change Email Address</h1>
        {state.emailAddress
          ? <p>The email address we have on file for you is <strong>{state.emailAddress}</strong>. If you would like the change it, please use the form below.</p>
          : <p>You don't have an email address on file. Please supply one using the form below.</p>
        }
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor={id + '_emailAddress'} className="form-label">New Telephone Number</label>
                <input onChange={handleEmailAddressChange} value={state.form.data.emailAddress} type="email" id={id + '_emailAddress'} className="form-control" autoComplete="email" />
              </div>
              <div className="d-flex align-items-center">
                <button className="btn btn-primary" style={{ width: 80 }} disabled={disabled}>
                  {state.form.processingState === 'saving' ? <Spinner size="sm" /> : 'Update'}
                </button>
                {state.form.processingState === 'save error' && <span className="text-danger ms-2">{state.form.errorMessage ? state.form.errorMessage : 'Error'}</span>}
              </div>
            </form>
            {state.form.processingState === 'success' && <div className="alert alert-success mt-4">Email address updated</div>}
          </div>
        </div>
      </div>
    </Section>
  );
};
