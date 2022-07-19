import NextError from 'next/error';
import type { ChangeEventHandler, FormEventHandler, ReactElement } from 'react';
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

  if (state.error) {
    return <NextError statusCode={state.errorCode ?? 500} />;
  }

  if (!state.enrollments) {
    return null;
  }

  return (
    <>
      <Section>
        <h1>New Card</h1>
        <NewCardForm
          crmId={crmId}
          form={state.form}
          onEnrollmentIdChange={handleEnrollmentIdChange}
          onUpdateAllChange={handleUpdateAllChange}
          insert$={insert$}
        />
      </Section>
    </>
  );
};
