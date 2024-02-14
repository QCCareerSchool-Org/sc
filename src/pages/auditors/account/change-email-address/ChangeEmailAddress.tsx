import type { FC } from 'react';
import { useReducer } from 'react';

import { ChangeEmailForm } from './ChangeEmailForm';
import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { useSubmit } from './useSubmit';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  auditorId: number;
};

export const ChangeEmailAddress: FC<Props> = ({ auditorId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  useInitialData(dispatch, auditorId);
  const submit$ = useSubmit(dispatch);

  return (
    <Section>
      <div className="container">
        <h1>Change Email Address</h1>
        {typeof state.emailAddress === 'undefined'
          ? <Spinner />
          : (
            <div className="row">
              <div className="col-12 col-lg-10 col-xl-8">
                <p className="lead">Your email address is <strong>{state.emailAddress}</strong>. If you would like to change it, please submit the form below.</p>
                <ChangeEmailForm auditorId={auditorId} formState={state.form} dispatch={dispatch} submit$={submit$} />
              </div>
            </div>
          )
        }
      </div>
    </Section>
  );
};
