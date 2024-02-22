import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, MouseEventHandler } from 'react';
import { useEffect, useRef } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

import { catchError, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { useAuthDispatch } from '@/hooks/useAuthDispatch';
import { useAuthState } from '@/hooks/useAuthState';
import { useServices } from '@/hooks/useServices';

export const AccountIcon: FC = () => {
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();
  const router = useRouter();
  const { loginService } = useServices();

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
      authDispatch({ type: 'STUDENT_LOG_OUT' });
    });
    return () => { destroy$.next(); destroy$.complete(); };
  }, [ authState, loginService, router, authDispatch ]);

  if (typeof authState.studentId !== 'undefined') {
    return (
      <>
        <Link href="/students/accounts"><div id="accountImage" className="me-md-3" /></Link>
        <small className="d-none d-md-inline me-2">LOGOUT</small>
        <a href="/students/logout.php" className="d-none d-md-inline"><FaSignOutAlt /></a>

        <style jsx>{`
      a:link, a:visited { color: #b70404 }
      a:hover, a:active { color: #e10019 }
      #accountImage {
        display:inline-block;
        vertical-align:middle;
        width:56px;
        height:56px;
        border-radius:28px;
        background:url('/students/portraits/view.php?thumbnail=64&amp;v=1590199169');
        background-size:cover;
      }
    `}</style>
      </>
    );
  }
};
