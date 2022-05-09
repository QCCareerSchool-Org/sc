import NextError from 'next/error';
import type { ChangeEvent, MouseEventHandler, ReactElement } from 'react';
import { memo, useReducer } from 'react';

import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { usePriceSave } from './usePriceSave';
import { Section } from '@/components/Section';

type Props = {
  administratorId: number;
  courseId: number;
  countryId: number | null;
};

export const UnitPriceEdit = memo(({ administratorId, courseId, countryId }: Props): ReactElement | null => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(administratorId, courseId, countryId, dispatch);

  const save$ = usePriceSave(dispatch);

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

  const handleSaveButtonClick: MouseEventHandler<HTMLButtonElement> = () => {
    save$.next({
      administratorId,
      courseId,
      countryId,
      payload: [],
      processingState: state.form.processingState,
    });
  };

  return (
    <Section>
      <div className="container">
        <h1>Unit Price Edit</h1>
        {state.course.name} v{state.course.version}
        <table className="table table-bordered w-auto">
          <thead>
            <tr>
              <th className="text-center">Unit</th>
              <th style={{ minWidth: 90 }}>Price</th>
              <th>Currency</th>
            </tr>
          </thead>
          <tbody>
            {state.form.data.map(d => (
              <tr key={d.unitTemplateId}>
                <td className="text-center align-middle">{d.unitLetter}</td>
                <td>
                  <input onChange={e => handlePriceChange(e, d.unitTemplateId)} onBlur={e => handlePriceBlur(e, d.unitTemplateId)} value={d.price} type="number" min={0} max={100} step={0.01} placeholder="(none)" className="form-control form-control-sm text-end" />
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
        <button onClick={handleSaveButtonClick} className="btn btn-primary" disabled={state.form.processingState === 'saving'}>Save Changes</button>
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
