import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';

import { useAuthState } from '@/hooks/useAuthState';
import { useNavState } from '@/hooks/useNavState';

export type TutorNavProps = Record<string, never>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TutorNav = (props: TutorNavProps): ReactElement | null => {
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
      <nav className="navbar sticky-top navbar-expand-md navbar-light bg-white mainNav shadow">
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
            </ul>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .mainNav {
          ${otherNavPresent && 'border-bottom: 1px solid #ccc;'}
        }
      `}</style>
    </>
  );
};
