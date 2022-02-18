import { ReactElement } from 'react';

export const SiteFooter = (): ReactElement => (
  <footer style={{ marginTop: 'auto' }}>
    <div className="container">
      &copy; {(new Date()).getFullYear()} QC Career School
    </div>
  </footer>
);
