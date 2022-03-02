import { ReactElement, useEffect, useState } from 'react';

import { useAuthState } from '@/hooks/useAuthState';
import { useNavState } from '@/hooks/useNavState';

export const AdministratorNav = (): ReactElement | null => {
  const authState = useAuthState();
  const navState = useNavState();
  const [ loaded, setLoaded ] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // we only load the bootstrap javascript library on the client
  // to prevent the server and client from rendering different outputs,
  // we don't render this component on the server
  if (!loaded) {
    return null;
  }

  const tutorLoggedIn = typeof authState.tutorId !== 'undefined';
  const studentLoggedIn = typeof authState.studentId !== 'undefined';

  const index = navState.type === 'administrator' ? navState.index : null;

  return (
    <>
      <nav className="navbar sticky-top navbar-expand-xl navbar-light bg-white mainNav shadow">
        <div className="container">
          <a className="d-xl-none navbar-brand" href="#">Administrator Menu</a>
          <button className={`navbar-toggler collapsed`} type="button" data-bs-toggle="collapse" data-bs-target="#adminNav" aria-controls="studentNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="adminNav">
            {(tutorLoggedIn || studentLoggedIn) && <><strong>A:</strong>&nbsp;&nbsp;</>}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className={`nav-link ${index === 0 ? 'active' : ''}`} aria-current={index === 0 ? 'page' : undefined} href="/administrators/index.bs.php">Home{index === 0 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 1 ? 'active' : ''}`} aria-current={index === 1 ? 'page' : undefined} href="/administrators/students/index.bs.php">Students</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 2 ? 'active' : ''}`} aria-current={index === 2 ? 'page' : undefined} href="/administrators/tutors/index.bs.php">Tutors</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
