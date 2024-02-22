import type { NextPage } from 'next';
import ErrorPage from 'next/error';
import { useEffect } from 'react';

import { useAuthState } from '@/hooks/useAuthState';
import { useNavDispatch } from '@/hooks/useNavDispatch';

const AuditorHomePage: NextPage = () => {
  const { auditorId } = useAuthState();
  const navDispatch = useNavDispatch();

  useEffect(() => {
    navDispatch({ type: 'SET_PAGE', payload: { type: 'auditor', index: 0 } });
  }, [ navDispatch ]);

  if (typeof auditorId === 'undefined') {
    return <ErrorPage statusCode={403} />;
  }

  return (
    <section>
      <div className="container">
        <h1>Online Student Center</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed metus mauris, suscipit in vehicula eu, tempus a ipsum. Nam eget magna sed elit aliquam malesuada vel eu dui. Vivamus cursus pharetra dictum. Nullam semper metus ac odio aliquet mollis. Maecenas eu diam et lectus fermentum tincidunt vel et tortor. Phasellus malesuada elit et eros lacinia, a pharetra lacus egestas. Maecenas ex lectus, fringilla id odio nec, cursus ultrices turpis. Donec condimentum, erat a rutrum bibendum, velit eros egestas orci, sed rutrum ante purus nec ante. Nam ac maximus augue. Vestibulum at risus sem.</p>
      </div>
    </section>
  );
};

export default AuditorHomePage;
