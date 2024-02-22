import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, MouseEventHandler } from 'react';
import { useEffect, useRef, useState } from 'react';

import { catchError, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { ActiveIndicator } from './ActiveIndicator';
import { useAuthDispatch } from '@/hooks/useAuthDispatch';
import { useAuthState } from '@/hooks/useAuthState';
import { useNavState } from '@/hooks/useNavState';
import { useServices } from '@/hooks/useServices';

export type AuditorNavProps = Record<string, never>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AuditorNav: FC<AuditorNavProps> = props => {
  const { loginService } = useServices();
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();
  const navState = useNavState();
  const [ loaded, setLoaded ] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const logOut$ = useRef(new Subject<void>());

  const handleLogoutClick: MouseEventHandler = e => {
    e.preventDefault();
    logOut$.current.next();
  };

  useEffect(() => {
    const destroy$ = new Subject<void>();
    logOut$.current.pipe(
      switchMap(() => loginService.logOut()),
      catchError(() => EMPTY),
      takeUntil(destroy$),
    ).subscribe(() => {
      authDispatch({ type: 'AUDITOR_LOG_OUT' });
    });
    return () => { destroy$.next(); destroy$.complete(); };
  }, [ authState, loginService, authDispatch ]);

  // Loading the bootstrap javascript library on the server causes errors due
  // to missing window, etc., so we only load it on the client in _app.tsx. The
  // library causes changes to the navigation bar, meaning the server and
  // client would render different outputs. To ensure the server and client
  // render the same thing, initially render null and only render the nav bar
  // after a re-render
  if (!loaded) {
    return null;
  }

  const adminLoggedIn = typeof authState.administratorId !== 'undefined';
  const studentLoggedIn = typeof authState.studentId !== 'undefined';
  const otherNavPresent = adminLoggedIn || studentLoggedIn;

  const index = navState.type === 'auditor' ? navState.index : null;

  return (
    <>
      <nav className={`mainNav navbar sticky-top navbar-expand-md navbar-light bg-white ${otherNavPresent ? '' : 'shadow'}`}>
        <div className="container">
          <a className="d-md-none navbar-brand" href="#">Auditor Menu</a>
          <button className={`navbar-toggler collapsed`} type="button" data-bs-toggle="collapse" data-bs-target="#auditorNav" aria-controls="auditorNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="auditorNav">
            {otherNavPresent && <span className="d-none d-md-inline me-3" style={{ minWidth: 64 }}><span className="badge text-bg-warning">Auditor</span></span>}
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <Link href="/auditors"><a className={`nav-link ${index === 0 ? 'active' : ''}`} aria-current={index === 0 ? 'page' : undefined}>Home{index === 0 && <ActiveIndicator />}</a></Link>
              </li>
              <li className="nav-item">
                <Link href="/auditors/students"><a className={`nav-link ${index === 1 ? 'active' : ''}`} aria-current={index === 0 ? 'page' : undefined}>Students{index === 1 && <ActiveIndicator />}</a></Link>
              </li>
              <li className="nav-item dropdown">
                <a className={`nav-link dropdown-toggle ${index === 2 ? 'active' : ''}`} href="#" id="auditorNavAccountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Account{index === 2 && <ActiveIndicator />}
                </a>
                <ul className="dropdown-menu" aria-labelledby="auditorNavAccountDropdown">
                  <li><Link href="/auditors/account/change-password"><a className="dropdown-item">Change Password</a></Link></li>
                  <li><Link href="/auditors/account/change-email-address"><a className="dropdown-item">Change Email Address</a></Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a href="#" onClick={handleLogoutClick} className="dropdown-item">Log Out</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .mainNav {
          ${otherNavPresent && 'border-bottom: 1px solid #ccc;'}
          z-index: 1021;
        }
      `}</style>
    </>
  );
};
