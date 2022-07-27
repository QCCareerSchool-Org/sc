import type { ReactElement } from 'react';
import { memo } from 'react';

export const CASocialInsuranceNumberForm = memo((): ReactElement => (
  <form method="post" action="/students/accounts/sin.php">
    <div className="mb-4">
      <label htmlFor="sin">Social Insurance Number (SIN)</label>
      <input type="text" className="form-control" name="sin" id="sin" maxLength={11} />
      <small className="text-muted">Format: 999-999-999</small>
    </div>
    <button className="btn btn-primary">Submit</button>
  </form>
));

CASocialInsuranceNumberForm.displayName = 'CASocialInsuranceNumberForm';
