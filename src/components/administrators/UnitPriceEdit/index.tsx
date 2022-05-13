import { HtmlProps } from 'next/dist/shared/lib/html-context';
import NextError from 'next/error';
import type { ChangeEvent, FormEventHandler, MouseEventHandler, ReactElement } from 'react';
import { memo, useReducer } from 'react';

import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { usePricesDelete } from './usePricesDelete';
import { usePricesSave } from './usePricesSave';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  administratorId: number;
  courseId: number;
  countryId: number | null;
};

export const UnitPriceEdit = memo(({ administratorId, courseId, countryId }: Props): ReactElement | null => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(administratorId, courseId, countryId, dispatch);

  const save$ = usePricesSave(dispatch);
  const delete$ = usePricesDelete(dispatch);

  if (state.processingState === 'load error') {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (state.processingState === 'initial' || state.processingState === 'loading') {
    return null;
  }

  if (typeof state.currencies === 'undefined') {
    throw Error('currencies is undefined');
  }
  if (typeof state.course === 'undefined') {
    throw Error('course is undefined');
  }
  if (typeof state.country === 'undefined') {
    throw Error('country is undefined');
  }

  const currencies = state.currencies;

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>, unitTemplateId: string): void => {
    dispatch({ type: 'PRICE_CHANGED', payload: { unitTemplateId, price: e.target.value } });
  };

  const handlePriceBlur = (e: ChangeEvent<HTMLInputElement>, unitTemplateId: string): void => {
    dispatch({ type: 'PRICE_BLURRED', payload: unitTemplateId });
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>, unitTemplateId: string): void => {
    dispatch({ type: 'CURRENCY_CHANGED', payload: { unitTemplateId, currencyId: e.target.value } });
  };

  const handleFormSubmit: FormEventHandler = e => {
    e.preventDefault();
    save$.next({
      administratorId,
      courseId,
      countryId,
      payload: state.form.data.map(d => ({
        unitTemplateId: d.unitTemplateId,
        price: parseFloat(d.price),
        currencyId: parseInt(d.currencyId, 10),
      })),
      processingState: state.form.processingState,
    });
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    const message = 'Are you sure you want to delete all prices for this course/country combination?';
    if (confirm(message)) {
      delete$.next({
        administratorId,
        courseId,
        countryId,
        processingState: state.form.processingState,
      });
    }
  };

  return (
    <Section>
      <div className="container">
        <h1>Unit Price Edit</h1>
        <p>{state.course.name} v{state.course.version}<br />{state.country === null ? 'Default Prices' : `Prices for ${state.country.name}`}</p>
        <div className="row">
          <div className="col-12 col-lg-6">
            <form onSubmit={handleFormSubmit}>
              <table className="table table-bordered w-auto">
                <thead>
                  <tr>
                    <th className="text-center">Unit</th>
                    <th className="text-end" style={{ minWidth: 90 }}>Price</th>
                    <th>Currency</th>
                  </tr>
                </thead>
                <tbody>
                  {state.form.data.map(d => (
                    <tr key={d.unitTemplateId}>
                      <td className="text-center align-middle">{d.unitLetter}</td>
                      <td>
                        <input onChange={e => handlePriceChange(e, d.unitTemplateId)} onBlur={e => handlePriceBlur(e, d.unitTemplateId)} value={d.price} type="number" min={0} max={100} step={0.01} placeholder="(none)" className="form-control form-control-sm text-end" required />
                      </td>
                      <td>
                        <select onChange={e => handleCurrencyChange(e, d.unitTemplateId)} value={d.currencyId} className="form-select form-select-sm">
                          {currencies.map(c => (
                            <option key={c.currencyId} value={c.currencyId}>{c.code}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex align-items-center">
                <button className="btn btn-primary" style={{ width: 80 }} disabled={state.form.processingState === 'saving'}>
                  {state.form.processingState === 'saving' ? <Spinner size="sm" /> : 'Save'}
                </button>
                <button type="button" onClick={handleDeleteClick} className="btn btn-danger ms-2" style={{ width: 80 }} disabled={state.form.processingState === 'deleting'}>
                  {state.form.processingState === 'deleting' ? <Spinner size="sm" /> : 'Delete'}
                </button>
                {state.form.processingState === 'save error' && <span className="ms-2">{state.form.errorMessage ?? 'Save error'}</span>}
                {state.form.processingState === 'delete error' && <span className="ms-2">{state.form.errorMessage ?? 'Delete error'}</span>}
              </div>
            </form>
          </div>
          {(state.inconsistentCurrencies || state.nonStandardCurrencies) && (
            <div className="col-12 col-lg-6 mt-3 mt-lg-0">
              {state.inconsistentCurrencies && (
                <div className="alert alert-warning"><strong>Warning:</strong> Not all units are using the same currency</div>
              )}
              {state.nonStandardCurrencies && (
                <div className="alert alert-warning"><strong>Warning:</strong> Non-standard currencies for {state.country?.name ?? 'default'}</div>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
      /* Chrome, Safari, Edge, Opera */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      input[type=number] {
        -moz-appearance: textfield;
      }
      `}</style>
    </Section>
  );
});

UnitPriceEdit.displayName = 'UnitPriceEdit';
