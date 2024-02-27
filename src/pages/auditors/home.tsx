import type { FC } from 'react';
import { useReducer } from 'react';

import { initialState, reducer } from './state';
import { useInitialData } from './useInitialData';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';

type Props = {
  auditorId: number;
};

export const AuditorHome: FC<Props> = ({ auditorId }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);
  useInitialData(dispatch, auditorId);

  return (
    <Section>
      <div className="container">
        {state.auditor
          ? (
            <>
              <h1>Welcome to the Online Student Center, {state.auditor.firstName}!</h1>
              <p className="lead mb-0">You can access everything you need to monitor students' progress through the Online Student Center. Visit the &ldquo;Student&rdquo; tab to access a detailed view of each student's progress including course due dates and grades. The &ldquo;Account&rdquo; tab will allow you to change your email address or password.</p>
            </>
          )
          : <Spinner />
        }
      </div>
    </Section>
  );
};
