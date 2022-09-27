import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { useAuthState } from '@/hooks/useAuthState';
import { useNavState } from '@/hooks/useNavState';

export type TutorNavProps = Record<string, never>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TutorNav: FC<TutorNavProps> = props => {
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

  const index = navState.type === 'tutor' ? navState.index : null;

  return (
    <>
      <nav className={`mainNav navbar sticky-top navbar-expand-md navbar-light bg-white ${otherNavPresent ? '' : 'shadow'}`}>
        <div className="container">
          <a className="d-md-none navbar-brand" href="#">Tutor Menu</a>
          <button className={`navbar-toggler collapsed`} type="button" data-bs-toggle="collapse" data-bs-target="#tutorNav" aria-controls="tutorNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="tutorNav">
            {otherNavPresent && <span className="d-none d-md-inline"><strong>T:</strong>&nbsp;&nbsp;</span>}
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <a className={`nav-link ${index === 0 ? 'active' : ''}`} aria-current={index === 0 ? 'page' : undefined} href="/tutors/index.php">Home{index === 0 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 1 ? 'active' : ''}`} aria-current={index === 1 ? 'page' : undefined} href="/tutors/units/mark.php">Mark<span className="d-md-none d-lg-inline"> Assignments</span>{index === 1 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 2 ? 'active' : ''}`} aria-current={index === 2 ? 'page' : undefined} href="/tutors/units/review.php">Review<span className="d-md-none d-lg-inline"> Assignments</span>{index === 2 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 3 ? 'active' : ''}`} aria-current={index === 3 ? 'page' : undefined} href="/tutors/files/select-student.php">Upload Files{index === 3 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 4 ? 'active' : ''}`} aria-current={index === 4 ? 'page' : undefined} href="/tutors/badges.php">Badges{index === 4 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item dropdown">
                <a className={`nav-link dropdown-toggle ${index === 5 ? 'active' : ''}`} href="#" id="tutorNavAccountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Account{index === 5 && <div className="active-indicator" />}
                </a>
                <ul className="dropdown-menu" aria-labelledby="tutorNavAccountDropdown">
                  <li><a className="dropdown-item" href="/tutors/passwords/edit.php">Change Password</a></li>
                  <li><a className="dropdown-item" href="/tutors/email-addresses/edit.php">Change Email Address</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="/tutors/logout.php">Log Out</a></li>
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
