import Link from 'next/link';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useAuthState } from '@/hooks/useAuthState';
import { useNavState } from '@/hooks/useNavState';

export type AuditorNavProps = Record<string, never>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AuditorNav: FC<AuditorNavProps> = props => {
  const authState = useAuthState();
  const navState = useNavState();
  const [ loaded, setLoaded ] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

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
            {otherNavPresent && <span className="d-none d-md-inline me-4" style={{ minWidth: 70 }}><span className="badge text-bg-warning">Auditor</span></span>}
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <Link href="/auditors"><a className={`nav-link ${index === 0 ? 'active' : ''}`} aria-current={index === 0 ? 'page' : undefined}>Home{index === 0 && <div className="active-indicator" />}</a></Link>
              </li>
              <li className="nav-item">
                <Link href="/auditors/students"><a className={`nav-link ${index === 1 ? 'active' : ''}`} aria-current={index === 0 ? 'page' : undefined}>Students{index === 0 && <div className="active-indicator" />}</a></Link>
              </li>
              <li className="nav-item dropdown">
                <a className={`nav-link dropdown-toggle ${index === 5 ? 'active' : ''}`} href="#" id="auditorNavAccountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Account{index === 5 && <div className="active-indicator" />}
                </a>
                <ul className="dropdown-menu" aria-labelledby="auditorNavAccountDropdown">
                  <li><Link href="/auditors/change-password"><a className="dropdown-item">Change Password</a></Link></li>
                  <li><Link href="/auditors/change-email-address"><a className="dropdown-item">Change Email Address</a></Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="/auditors/logout.php">Log Out</a></li>
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
