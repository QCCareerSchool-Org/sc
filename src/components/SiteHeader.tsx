import Image from 'next/image';
import { ReactElement } from 'react';
import styled from 'styled-components';
import { useScreenWidth } from '../hooks/useScreenWidth';

import Logo from '../images/logo.svg';
import { Container } from './styled/Container';

const calculateLogoWidth = (height: number): number => {
  return Math.round(Logo.width / Logo.height * height);
};

export const SiteHeader = (): ReactElement => {
  console.log('header render');

  const screenWidth = useScreenWidth();
  const lgOrGreater = screenWidth >= 992;

  const padding = lgOrGreater ? '2rem 0' : '1.375rem 0';

  const logoHeight = lgOrGreater ? 41 : 21;
  const logoWidth = calculateLogoWidth(logoHeight);

  return (
    <>
      <header style={{ padding }}>
        <Container>
          <div style={{ height: logoHeight }}>
            <Image src={Logo} alt="Online Student Center" width={logoWidth} height={logoHeight} />
          </div>
        </Container>
      </header>
      <HeaderBar>
        <Container>
          <small>Call Us Toll Free: <strong>1-833-600-3751</strong></small>
        </Container>
      </HeaderBar>
    </>
  );
};

const HeaderBar = styled.div`
  background: #e10019;
  background: linear-gradient(to right, #e10019, #b70404);
  color: white;
  padding: 0.1875rem 0;
  vertical-align: center;
`;
