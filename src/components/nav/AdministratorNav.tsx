import { ReactElement } from 'react';
import { useNavState } from '../../hooks/useNavState';

export const AdministratorNav = (): ReactElement => {
  const navState = useNavState();

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
