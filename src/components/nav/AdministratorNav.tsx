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

  // Loading the bootstrap javascript library on the server causes errors due
  // to missing window, etc., so we only load it on the client in _app.tsx. The
  // library causes changes to the navigation bar, meaning the server and
  // client would render different outputs. To ensure the server and client
  // render the same thing, initially render null and only render the nav bar
  // after a re-render
  if (!loaded) {
    return null;
  }

  const tutorLoggedIn = typeof authState.tutorId !== 'undefined';
  const studentLoggedIn = typeof authState.studentId !== 'undefined';

  const index = navState.type === 'administrator' ? navState.index : null;

  return (
    <>
      <nav className="navbar sticky-top navbar-expand-md navbar-light bg-white mainNav shadow">
        <div className="container">
          <a className="d-md-none navbar-brand" href="#">Administrator Menu</a>
          <button className={`navbar-toggler collapsed`} type="button" data-bs-toggle="collapse" data-bs-target="#adminNav" aria-controls="studentNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="adminNav">
            {(tutorLoggedIn || studentLoggedIn) && <><strong>A:</strong>&nbsp;&nbsp;</>}
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <a className={`nav-link ${index === 0 ? 'active' : ''}`} aria-current={index === 0 ? 'page' : undefined} href="/administrators">Home{index === 0 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 1 ? 'active' : ''}`} aria-current={index === 1 ? 'page' : undefined} href="/administrators/accounts">Students{index === 1 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${index === 2 ? 'active' : ''}`} aria-current={index === 2 ? 'page' : undefined} href="/administrators/tutors">Tutors{index === 2 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item dropdown">
                <a className={`nav-link dropdown-toggle ${index === 3 ? 'active' : ''}`} href="#" id="adminNavAssignTutorsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Assign Tutors{index === 3 && <div className="active-indicator" />}
                </a>
                <ul className="dropdown-menu" aria-labelledby="adminNavAssignTutorsDropdown">
                  <li><a className="dropdown-item" href="/administrators/students/list-unassigned.php" aria-current={index === 3 ? 'page' : undefined}>All</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="/administrators/students/list-unassigned.php?school_id=3">Design</a></li>
                  <li><a className="dropdown-item" href="/administrators/students/list-unassigned.php?school_id=2">Event</a></li>
                  <li><a className="dropdown-item" href="/administrators/students/list-unassigned.php?school_id=1">Makeup</a></li>
                  {/* <li><a className="dropdown-item" href="/administrators/students/list-unassigned.php?school_id=4">Travel</a></li> */}
                  <li><a className="dropdown-item" href="/administrators/students/list-unassigned.php?school_id=7">Writing</a></li>
                  {/* <li><a className="dropdown-item" href="/administrators/students/list-unassigned.php?school_id=5">Style</a></li> */}
                  <li><a className="dropdown-item" href="/administrators/students/list-unassigned.php?school_id=6">Pet</a></li>
                  <li><a className="dropdown-item" href="/administrators/students/list-unassigned.php?school_id=8">Wellness</a></li>
                </ul>
              </li>
              <li className="nav-item dropdown d-block d-md-none d-lg-block">
                <a className={`nav-link dropdown-toggle ${index === 4 ? 'active' : ''}`} href="#" id="adminNavUnmarkedUnitsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Unmarked Units{index === 4 && <div className="active-indicator" />}
                </a>
                <ul className="dropdown-menu" aria-labelledby="adminNavUnmarkedUnitsDropdown">
                  <li><a className="dropdown-item" href="/administrators/units/list-unmarked.php" aria-current={index === 4 ? 'page' : undefined}>All</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="/administrators/units/list-unmarked.php?school_id=3">Design</a></li>
                  <li><a className="dropdown-item" href="/administrators/units/list-unmarked.php?school_id=2">Event</a></li>
                  <li><a className="dropdown-item" href="/administrators/units/list-unmarked.php?school_id=1">Makeup</a></li>
                  {/* <li><a className="dropdown-item" href="/administrators/units/list-unmarked.php?school_id=4">Travel</a></li> */}
                  <li><a className="dropdown-item" href="/administrators/units/list-unmarked.php?school_id=7">Writing</a></li>
                  {/* <li><a className="dropdown-item" href="/administrators/units/list-unmarked.php?school_id=5">Style</a></li> */}
                  <li><a className="dropdown-item" href="/administrators/units/list-unmarked.php?school_id=6">Pet</a></li>
                  <li><a className="dropdown-item" href="/administrators/units/list-unmarked.php?school_id=8">Wellness</a></li>
                </ul>
              </li>
              <li className="nav-item d-block d-md-none d-xl-block">
                <a className={`nav-link ${index === 5 ? 'active' : ''}`} aria-current={index === 5 ? 'page' : undefined} href="/administrators/returned-units">Returned Units{index === 5 && <div className="active-indicator" />}</a>
              </li>
              <li className="nav-item dropdown d-md-none d-xl-block">
                <a className={`nav-link dropdown-toggle ${index === 6 ? 'active' : ''}`} href="#" id="adminNavInvoicesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Invoices{index === 6 && <div className="active-indicator" />}
                </a>
                <ul className="dropdown-menu" aria-labelledby="adminNavInvoicesDropdown">
                  <li><a className="dropdown-item" href="/administrators/invoices/select-tutor.php" aria-current={index === 6 ? 'page' : undefined}>All</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="/administrators/invoices/select-tutor.php?school_id=3">Design</a></li>
                  <li><a className="dropdown-item" href="/administrators/invoices/select-tutor.php?school_id=2">Event</a></li>
                  <li><a className="dropdown-item" href="/administrators/invoices/select-tutor.php?school_id=1">Makeup</a></li>
                  {/* <li><a className="dropdown-item" href="/administrators/invoices/select-tutor.php?school_id=4">Travel</a></li> */}
                  <li><a className="dropdown-item" href="/administrators/invoices/select-tutor.php?school_id=7">Writing</a></li>
                  {/* <li><a className="dropdown-item" href="/administrators/invoices/select-tutor.php?school_id=5">Style</a></li> */}
                  <li><a className="dropdown-item" href="/administrators/invoices/select-tutor.php?school_id=6">Pet</a></li>
                  <li><a className="dropdown-item" href="/administrators/invoices/select-tutor.php?school_id=8">Wellness</a></li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a className={`nav-link dropdown-toggle ${index === 7 ? 'active' : ''}`} href="#" id="adminNavInvoicesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  More{index === 7 && <div className="active-indicator" />}
                </a>
                <ul className="dropdown-menu" aria-labelledby="adminNavInvoicesDropdown">
                  <li><a className="dropdown-item d-none d-md-block d-lg-none" href="/administrators/units/list-unmarked.php">Unmarked Units</a></li>
                  <li><a className="dropdown-item d-none d-md-block d-xl-none" href="/administrators/invoices/select-tutor.php">Invoices</a></li>
                  <li><a className="dropdown-item d-none d-md-block d-xl-none" href="/administrators/returned-units/index.php">Returned Units</a></li>
                  <li><a className="dropdown-item" href="/administrators/forum/login.php" onClick={() => { window.open('/administrators/forum/login.php'); return false; }}>Student Forum</a></li>
                  <li><a className="dropdown-item" href="/administrators/final-submissions/">Final Submissions</a></li>
                  <li><a className="dropdown-item" href="/sc/administrators/schools">Edit</a></li>
                  <li><a className="dropdown-item" href="/administrators/materials/">Course Materials</a></li>
                  <li><a className="dropdown-item" href="/administrators/paths/">Course Material Paths</a></li>
                  <li><a className="dropdown-item" href="/administrators/showcases/index.php">Student Showcase</a></li>
                  <li><a className="dropdown-item" href="/administrators/questionnaires/index.php">Questionnaires</a></li>
                  <li><a className="dropdown-item" href="/administrators/unit-prices/index.php">Unit Prices</a></li>
                  <li><a className="dropdown-item" href="/administrators/passwords/edit.php">Change Password</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="/administrators/logout.php">Log Out</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
