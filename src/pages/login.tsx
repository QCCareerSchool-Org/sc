import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import type { ChangeEventHandler, FormEventHandler } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { catchError, EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { basePath } from '../basePath';
import { Section } from '@/components/Section';
import { Spinner } from '@/components/Spinner';
import { useAuthDispatch } from '@/hooks/useAuthDispatch';
import { useServices } from '@/hooks/useServices';

type LogInPayload = {
  username: string;
  password: string;
  stayLoggedIn: boolean;
  returnUrl: string | null;
};

type Props = {
  returnUrl: string | null;
};

const LoginPage: NextPage<Props> = ({ returnUrl }) => {
  const router = useRouter();
  const { loginService } = useServices();
  const authDispatch = useAuthDispatch();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ stayLoggedIn, setStayLoggedIn ] = useState(false);
  const [ submitting, setSubmitting ] = useState(false);
  const [ error, setError ] = useState(false);

  const logIn$ = useRef(new Subject<LogInPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    logIn$.current.pipe(
      tap(() => {
        setSubmitting(true);
        setError(false);
      }),
      switchMap(({ username: u, password: p, stayLoggedIn: s, returnUrl: r }) => loginService.logIn(u, p, s).pipe(
        tap({
          next: response => {
            setSubmitting(false);
            if (response.type === 'admin') {
              authDispatch({ type: 'ADMINISTRATOR_LOG_IN', payload: { accountId: response.id, xsrfToken: response.xsrf } });
              return void router.push(r ?? '/administrators');
            } else if (response.type === 'tutor') {
              authDispatch({ type: 'TUTOR_LOG_IN', payload: { accountId: response.id, xsrfToken: response.xsrf } });
              return void router.push(r ?? '/tutors');
            } else if (response.type === 'student') {
              authDispatch({ type: 'STUDENT_LOG_IN', payload: { accountId: response.id, xsrfToken: response.xsrf } });
              return void router.push(r ?? '/students');
            }
            void router.push(r ?? basePath);
          },
          error: () => {
            setSubmitting(false);
            setError(true);
          },
        }),
        catchError(() => EMPTY),
      )),
      takeUntil(destroy$),
    ).subscribe();

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, authDispatch, loginService ]);

  const formSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    logIn$.current.next({ username, password, stayLoggedIn, returnUrl });
  };

  const usernameChange: ChangeEventHandler<HTMLInputElement> = e => {
    setUsername(e.target.value);
  };

  const passwordChange: ChangeEventHandler<HTMLInputElement> = e => {
    setPassword(e.target.value);
  };

  const stayLoggedInChange: ChangeEventHandler<HTMLInputElement> = e => {
    setStayLoggedIn(e.target.checked);
  };

  return (
    <>
      <Section>
        <div className="container">
          <h1>Student Center Login</h1>
          <div className="row">
            <div className="col-6">
              <form onSubmit={formSubmit}>
                <div className="formGroup">
                  <label htmlFor="username" className="form-label">Username / Student Number</label>
                  <input type="text" id="username" name="username" value={username} onChange={usernameChange} className="form-control" required />
                </div>
                <div className="formGroup">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" id="password" name="password" value={password} onChange={passwordChange} className="form-control" required />
                </div>
                <div className="formGroup">
                  <div className="form-check">
                    <input onChange={stayLoggedInChange} checked={stayLoggedIn} type="checkbox" id="stayLoggedIn" className="form-check-input" />
                    <label htmlFor="stayLoggedIn" className="form-check-label">Stay Logged In</label>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <button type="submit" className="btn btn-primary" style={{ width: 80 }} disabled={submitting}>
                    {submitting ? <Spinner size="sm" /> : 'Log In'}
                  </button>
                  {error && <span className="text-danger ms-2">Error</span>}
                </div>
              </form>
            </div>
            <div className="col-6">
              <h2>Missing your username or password?</h2>
              <p>You'll find your username and password in your welcome email from the School or call us at 1-833-600-3751 and one of our student support specialists will be happy to help.</p>
              <button className="btn btn-primary">Forgot Your Password?</button>
            </div>
          </div>
        </div>
      </Section>

      <style jsx>{`
        .formGroup { margin-bottom: 1rem; }
      `}</style>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const returnUrl = Array.isArray(ctx.query.returnUrl)
    ? ctx.query.returnUrl[0]
    : typeof ctx.query.returnUrl === 'string'
      ? ctx.query.returnUrl
      : null;
  return { props: { returnUrl } };
};

export default LoginPage;
