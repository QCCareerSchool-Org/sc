import type { FC } from 'react';

export const UnchangedPasswordWarning: FC = () => (
  <div className="alert alert-warning">
    <p>You are still using a temporary password. Please <a className="alert-link" href="/students/passwords/edit.php">choose a new password</a>.</p>
    <a className="alert-link" href="/students/passwords/edit.php"><button className="btn btn-warning">Change Password</button></a>
  </div>
);
