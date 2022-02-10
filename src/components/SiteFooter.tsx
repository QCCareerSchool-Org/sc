import { ReactElement } from 'react';
import { Container } from './styled/Container';

export const SiteFooter = (): ReactElement => (
  <footer style={{ marginTop: 'auto' }}>
    <Container>
      &copy; {(new Date()).getFullYear()} QC Career School
    </Container>
  </footer>
);
