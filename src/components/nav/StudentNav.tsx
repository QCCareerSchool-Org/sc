import { ReactElement } from 'react';
import { useNavState } from '../../hooks/useNavState';

export const StudentNav = (): ReactElement => {
  const navState = useNavState();

  let index = navState.type === 'student' ? navState.index : null;
  index = 0;

  return (
    <>
      <nav className="navbar sticky-top navbar-expand-xl navbar-light bg-white mainNav shadow">
        <div className="container">
          <a className="d-xl-none navbar-brand" href="#">Student Menu</a>
          <button className={`navbar-toggler collapsed`} type="button" data-bs-toggle="collapse" data-bs-target="#studentNav" aria-controls="studentNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="studentNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className={`nav-link ${index === 0 ? 'active' : ''}`} aria-current={index === 0 ? 'page' : undefined} href="/students/course-materials/index.bs.php">Home{index === 0 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 1 ? 'active' : ''}`} aria-current={index === 1 ? 'page' : undefined} href="/students/student-resources/vendors.bs.php">Preferred Partners</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 2 ? 'active' : ''}`} aria-current={index === 2 ? 'page' : undefined} href="/students/badges.bs.php">School Badges</a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Professional Profile
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="/students/profiles/edit.php">Details</a></li>
                  <li><a className="dropdown-item" href="/students/portraits/index.php">Portrait</a></li>
                  <li><a className="dropdown-item" href="/students/locations/edit.php">Service Locations</a></li>
                  <li><a className="dropdown-item" href="/students/portfolios/index.php">Portfolio</a></li>
                  <li><a className="dropdown-item" href="/students/testimonials/edit.php">Testimonials</a></li>
                  <li><a className="dropdown-item" href="/students/profiles/activate.php">Profile Visibility</a></li>
                  <li><a className="dropdown-item" href="https://www.qccareerschool.com/profiles/50">View My Profile</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 4 ? 'active' : ''}`} aria-current={index === 4 ? 'page' : undefined} href="/students/forum">Student Forum</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 5 ? 'active' : ''}`} aria-current={index === 4 ? 'page' : undefined} href="/students/accounts/view.bs.php">My Account</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
