import type { ChangeEventHandler, FC, FormEventHandler } from 'react';
import { useId, useReducer } from 'react';

import type { State } from './state';
import { initialState, reducer } from './state';
import { useBillingAddressChange } from './useBillingAddressChange';
import { useCountryCodeChange } from './useCountryCodeChange';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  crmId: number;
};

export const BillingAddressEdit: FC<Props> = ({ crmId }) => {
  const id = useId();
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, crmId);

  const billingAddressChange$ = useBillingAddressChange(dispatch);
  const countryCodeChange$ = useCountryCodeChange(dispatch);

  if (!state.crmStudent || !state.crmCountries) {
    return null;
  }

  let valid = true;
  // check if there are any validation messages
  for (const key in state.form.validationMessages) {
    if (Object.prototype.hasOwnProperty.call(state.form.validationMessages, key)) {
      const validationMessage = key as keyof State['form']['validationMessages'];
      if (state.needsPostalCode || validationMessage !== 'postalCode') { // ignore the postal code error for countries that don't need one
        if (state.form.validationMessages[validationMessage]) {
          valid = false;
        }
      }
    }
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    billingAddressChange$.next({
      crmId,
      address1: state.form.data.address1,
      address2: state.form.data.address2,
      city: state.form.data.city,
      provinceCode: state.form.data.provinceCode,
      postalCode: state.needsPostalCode ? state.form.data.postalCode : '',
      countryCode: state.form.data.countryCode,
      processingState: state.form.processingState,
    });
  };

  const handleAddress1Change: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'ADDRESS1_UPDATED', payload: e.target.value });
  };

  const handleAddress2Change: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'ADDRESS2_UPDATED', payload: e.target.value });
  };

  const handleCityChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'CITY_UPDATED', payload: e.target.value });
  };

  const handleProvinceCodeChange: ChangeEventHandler<HTMLSelectElement> = e => {
    dispatch({ type: 'PROVINCE_CODE_UPDATED', payload: e.target.value });
  };

  const handlePostalCodeChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'POSTAL_CODE_UPDATED', payload: e.target.value });
  };

  const handleCountryCodeChange: ChangeEventHandler<HTMLSelectElement> = e => {
    countryCodeChange$.next({ countryCode: e.target.value, crmProvinces: state.crmProvinces });
  };

  const disabled = state.form.processingState === 'saving' || !valid;

  return (
    <Section>
      <div className="container">
        <h1>Change Billing Address</h1>
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor={id + '_countryCode'} className="form-label">Country</label>
                <select onChange={handleCountryCodeChange} value={state.form.data.countryCode} id={id + '_countryCode'} className={`form-select ${state.form.validationMessages.countryCode ? 'is-invalid' : ''}`} autoComplete="country" required>
                  {state.crmCountries.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                {state.form.validationMessages.countryCode && <div className="invalid-feedback">{state.form.validationMessages.countryCode}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor={id + '_address1'} className="form-label">Address Line 1</label>
                <input onChange={handleAddress1Change} value={state.form.data.address1} type="text" id={id + '_address1'} className={`form-control ${state.form.validationMessages.address1 ? 'is-invalid' : ''}`} autoComplete="address-line1" required />
                {state.form.validationMessages.address1 && <div className="invalid-feedback">{state.form.validationMessages.address1}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor={id + '_address2'} className="form-label">Address Line 2</label>
                <input onChange={handleAddress2Change} value={state.form.data.address2} type="text" id={id + '_address2'} className={`form-control ${state.form.validationMessages.address2 ? 'is-invalid' : ''}`} autoComplete="address-line2" required />
                {state.form.validationMessages.address2 && <div className="invalid-feedback">{state.form.validationMessages.address2}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor={id + '_city'} className="form-label">City</label>
                <input onChange={handleCityChange} value={state.form.data.city} type="text" id={id + '_city'} className={`form-control ${state.form.validationMessages.city ? 'is-invalid' : ''}`} autoComplete="address-level2" required />
                {state.form.validationMessages.city && <div className="invalid-feedback">{state.form.validationMessages.city}</div>}
              </div>
              {state.crmProvinces[state.form.data.countryCode].length > 0 && (
                <div className="mb-4">
                  <label htmlFor={id + '_provinceCode'} className="form-label">Province / State</label>
                  <select onChange={handleProvinceCodeChange} value={state.form.data.provinceCode} id={id + '_provinceCode'} className={`form-select ${state.form.validationMessages.provinceCode ? 'is-invalid' : ''}`} autoComplete="address-level1" required>
                    {state.crmProvinces[state.form.data.countryCode].map(p => (
                      <option key={`${state.form.data.countryCode}-${p.code}`} value={p.code}>{p.name}</option>
                    ))}
                  </select>
                  {state.form.validationMessages.provinceCode && <div className="invalid-feedback">{state.form.validationMessages.provinceCode}</div>}
                </div>
              )}
              {state.needsPostalCode && (
                <div className="mb-4">
                  <label htmlFor={id + '_postalCode'} className="form-label">Postal Code</label>
                  <input onChange={handlePostalCodeChange} value={state.form.data.postalCode} type="text" id={id + '_postalCode'} className={`form-control ${state.form.validationMessages.postalCode ? 'is-invalid' : ''}`} autoComplete="postal-code" required />
                  {state.form.validationMessages.postalCode && <div className="invalid-feedback">{state.form.validationMessages.postalCode}</div>}
                </div>
              )}
              <div className="d-flex align-items-center">
                <button className="btn btn-primary" style={{ width: 80 }} disabled={disabled}>
                  {state.form.processingState === 'saving' ? <Spinner size="sm" /> : 'Update'}
                </button>
                {state.form.processingState === 'save error' && <span className="text-danger ms-2">{state.form.errorMessage ? state.form.errorMessage : 'Error'}</span>}
              </div>
            </form>
            {state.form.processingState === 'success' && <div className="alert alert-success mt-4">Billing address updated</div>}
          </div>
        </div>
      </div>
    </Section>
  );
};
