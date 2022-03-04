import { ReactElement, useEffect, useState } from 'react';

import { useAuthState } from '@/hooks/useAuthState';
import { useNavState } from '@/hooks/useNavState';

export const StudentNav = (): ReactElement | null => {
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
  const tutorLoggedIn = typeof authState.tutorId !== 'undefined';
  const otherNavPresent = adminLoggedIn || tutorLoggedIn;

  const index = navState.type === 'student' ? navState.index : null;

  return (
    <>
      <nav className="navbar sticky-top navbar-expand-md navbar-light bg-white mainNav shadow">
        <div className="container">
          <a className="d-md-none navbar-brand" href="#">Student Menu</a>
          <button className={`navbar-toggler collapsed`} type="button" data-bs-toggle="collapse" data-bs-target="#studentNav" aria-controls="studentNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="studentNav">
            {otherNavPresent && <><strong>S:</strong>&nbsp;&nbsp;</>}
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <a className={`nav-link ${index === 0 ? 'active' : ''}`} aria-current={index === 0 ? 'page' : undefined} href="/students/course-materials/index.bs.php">Home{index === 0 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 1 ? 'active' : ''}`} aria-current={index === 1 ? 'page' : undefined} href="/students/student-resources/vendors.bs.php"><span className="d-none d-xl-inline">Preferred </span>Partners{index === 1 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 2 ? 'active' : ''}`} aria-current={index === 2 ? 'page' : undefined} href="/students/badges.bs.php">{index === 2 && <div className="active-indicator" />}<span className="d-none d-xl-inline">School </span>Badges</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span className="d-none d-xl-inline">Professional </span>Profile{index === 3 && <div className="active-indicator" />}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="/students/profiles/edit.php">Details</a></li>
                  <li><a className="dropdown-item" href="/students/portraits/index.php">Portrait</a></li>
                  <li><a className="dropdown-item" href="/students/locations/edit.php">Service Locations</a></li>
                  <li><a className="dropdown-item" href="/students/portfolios/index.php">Portfolio</a></li>
                  <li><a className="dropdown-item" href="/students/testimonials/edit.php">Testimonials</a></li>
                  <li><a className="dropdown-item" href="/students/profiles/activate.php">Profile Visibility</a></li>
                  <li><a className="dropdown-item" href={`https://www.qccareerschool.com/profiles/${authState.studentId}`}>View My Profile</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 4 ? 'active' : ''}`} aria-current={index === 4 ? 'page' : undefined} href="/students/forum"><span className="d-none d-xl-inline">Student </span>Forum</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 5 ? 'active' : ''}`} aria-current={index === 4 ? 'page' : undefined} href="/students/accounts/view.bs.php"><span className="d-none d-xl-inline">My </span>Account</a>
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
