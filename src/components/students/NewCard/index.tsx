import NextError from 'next/error';
import type { ChangeEventHandler, ReactElement } from 'react';
import { useReducer } from 'react';

import { NewCardForm } from './NewCardForm';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { usePaymentMethodInsert } from './usePaymentMethodInsert';
import { Section } from '@/components/Section';

type Props = {
  crmId: number;
};

export const NewCard = ({ crmId }: Props): ReactElement | null => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(crmId, dispatch);

  const insert$ = usePaymentMethodInsert(dispatch);

  const handleEnrollmentIdChange: ChangeEventHandler<HTMLSelectElement> = e => {
    dispatch({ type: 'ENROLLMENT_ID_CHANGED', payload: e.target.value });
  };

  const handleUpdateAllChange: ChangeEventHandler<HTMLInputElement> = e => {
    dispatch({ type: 'UPDATE_ALL_CHANGED', payload: e.target.checked });
  };

  const handleCardDataChange = (): void => {
    dispatch({ type: 'CARD_DATA_CHANGED' });
  };

  if (state.error) {
    return (
      <Section>
        <div className="container">
          <h1>Communications Error</h1>
          <p className="lead">There was an error reaching the back office. Please try again later.</p>
        </div>
      </Section>
    );
  }

  if (!state.student) {
    return null;
  }

  return (
    <>
      <Section>
        <div className="container">
          <h1>Update Your Payment Method</h1>
          <div className="row">
            <div className="col-12 col-lg-7 col-xl-8 order-lg-2">
              <p className="lead">If you would like to supply the School with a new credit card or debit card please fill out this form.</p>
              <p><strong>Note:</strong> Please visit <a href="/students/accounts/view.php">the payment page</a> to make payments.</p>
            </div>
            <div className="col-12 col-md-7 col-lg-5 col-xl-4 order-lg-1">
              <div className="card">
                <div className="card-body">
                  <NewCardForm
                    crmId={crmId}
                    form={state.form}
                    student={state.student}
                    currencyCode={state.currencyCode}
                    currencyName={state.currencyName}
                    allSameCurrency={state.allSameCurrency}
                    insert$={insert$}
                    onEnrollmentIdChange={handleEnrollmentIdChange}
                    onUpdateAllChange={handleUpdateAllChange}
                    onCardDataChange={handleCardDataChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};
