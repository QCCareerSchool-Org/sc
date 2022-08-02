import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
import { useReducer, useRef } from 'react';

import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useTelephoneNumberChange } from './useTelephoneNumberChange';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  crmId: number;
};

export const TelephoneNumberEdit = ({ crmId }: Props): ReactElement | null => {
  // const id = useId(); // react 18
  const id = useRef('x' + Math.random().toString(32).slice(2));
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, crmId);

  const telephoneNumberChange$ = useTelephoneNumberChange(dispatch);

  if (!state.crmStudent || !state.crmTelephoneCountryCodes) {
    return null;
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    telephoneNumberChange$.next({
      crmId,
      telephoneCountryCode: state.form.telephoneCountryCode,
      telephoneNumber: state.form.data.telephoneNumber,
      processingState: state.form.processingState,
    });
  };

  const handleTelephoneCountryCodeChange: ChangeEventHandler<HTMLSelectElement> = e => {
    dispatch({ type: 'TELEPHONE_COUNTY_CODE_ID_UPDATED', payload: e.target.value });
  };

  const handleTelephoneNumberChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'TELEPHONE_NUMBER_UPDATED', payload: e.target.value });
  };

  const disabled = state.form.processingState === 'saving' || state.form.data.telephoneNumber.length === 0 || (state.form.telephoneCountryCode === state.crmStudent.telephoneCountryCode && state.form.data.telephoneNumber === state.crmStudent.telephoneNumber);

  return (
    <Section>
      <div className="container">
        <h1>Change Telephone Number</h1>
        {state.crmStudent.telephoneNumber
          ? <p>The telephone number we have on file for you is <strong>{state.crmStudent.telephoneNumber}</strong>. If you would like the change it, please use the form below.</p>
          : <p>You don't have a telephone number on file. Please supply one using the form below.</p>
        }
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor={id.current + '_telephoneCountryCode'} className="form-label">Country Dialing Code</label>
                <select onChange={handleTelephoneCountryCodeChange} value={state.form.data.telephoneCountryCodeId} id={id.current + '_telephoneCountryCode'} className="form-control" autoComplete="tel-country-code">
                  {state.crmTelephoneCountryCodes.map(t => (
                    <option key={t.telephoneCountryCodeId} value={t.telephoneCountryCodeId}>+{t.code} {t.region}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor={id.current + '_telephoneNumber'} className="form-label">New Telephone Number</label>
                <input onChange={handleTelephoneNumberChange} value={state.form.data.telephoneNumber} type="tel" id={id.current + '_telephoneNumber'} className="form-control" autoComplete="tel-national" />
              </div>
              <div className="d-flex align-items-center">
                <button className="btn btn-primary" style={{ width: 80 }} disabled={disabled}>
                  {state.form.processingState === 'saving' ? <Spinner size="sm" /> : 'Update'}
                </button>
                {state.form.processingState === 'save error' && <span className="text-danger ms-2">{state.form.errorMessage ? state.form.errorMessage : 'Error'}</span>}
              </div>
            </form>
            {state.form.processingState === 'success' && <div className="alert alert-success mt-4">Telephone number updated</div>}
          </div>
        </div>

      </div>
    </Section>
  );
};
