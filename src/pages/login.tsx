import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { ChangeEventHandler, FormEvent, FormEventHandler, useEffect, useRef, useState } from 'react';
import { Subject, switchMap, takeUntil } from 'rxjs';

import { basePath } from '../basePath';
import { loginService } from '../services';
import { useAuthDispatch } from '@/hooks/useAuthDispatch';

type LogInPayload = {
  username: string;
  password: string;
  stayLoggedIn: boolean;
};

type Props = {
  returnUrl: string | null;
};

const LoginPage: NextPage<Props> = ({ returnUrl }) => {
  const router = useRouter();
  const authDispatch = useAuthDispatch();
  const [ usernameVal, setUsernameVal ] = useState('');
  const [ passwordVal, setPasswordVal ] = useState('');
  const [ submitting, setSubmitting ] = useState(false);

  const logIn$ = useRef(new Subject<LogInPayload>());

  useEffect(() => {
    const destroy$ = new Subject<void>();

    logIn$.current.pipe(
      switchMap(({ username, password, stayLoggedIn }) => loginService.logIn(username, password, false)),
      takeUntil(destroy$),
    ).subscribe({
      next: response => {
        if (response.type === 'administrator') {
          authDispatch({ type: 'ADMINISTRATOR_LOG_IN', payload: { accountId: response.id, xsrfToken: response.xsrf } });
        } else if (response.type === 'tutor') {
          authDispatch({ type: 'TUTOR_LOG_IN', payload: { accountId: response.id, xsrfToken: response.xsrf } });
        } else if (response.type === 'student') {
          authDispatch({ type: 'STUDENT_LOG_IN', payload: { accountId: response.id, xsrfToken: response.xsrf } });
        }
        void router.push(returnUrl ?? basePath);
      },
    });

    return () => { destroy$.next(); destroy$.complete(); };
  }, [ router, returnUrl, authDispatch ]);

  const formSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    logIn$.current.next({ username: usernameVal, password: passwordVal, stayLoggedIn: false });
  };

  const usernameChange: ChangeEventHandler<HTMLInputElement> = e => {
    setUsernameVal(e.target.value);
  };

  const passwordChange: ChangeEventHandler<HTMLInputElement> = e => {
    setPasswordVal(e.target.value);
  };

  return (
    <section>
      <div className="container">
        <h1>Student Center Login</h1>
        <div className="row">
          <div className="col-6">
            <form onSubmit={formSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username / Student Number</label>
                <input type="text" id="username" name="username" value={usernameVal} onChange={usernameChange} className="form-control" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={passwordVal} onChange={passwordChange} className="form-control" required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>Log In</button>
            </form>
          </div>
          <div className="col-6">
            <h2>Missing your username or password?</h2>
            <p>You'll find your username and password in your welcome email from the School or call us at 1-833-600-3751 and one of our student support specialists will be happy to help.</p>
            <button className="btn btn-primary">Forgot Your Password?</button>
          </div>
        </div>
      </div>
    </section>
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
