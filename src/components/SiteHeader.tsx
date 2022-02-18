import Image from 'next/image';
import { ReactElement } from 'react';

import { useScreenWidth } from '../hooks/useScreenWidth';
import Logo from '../images/logo.svg';
import { AccountIcon } from './AccountIcon';
import { HeaderBar } from './HeaderBar';

const calculateLogoWidth = (height: number): number => {
  return Math.round(Logo.width / Logo.height * height);
};

export const SiteHeader = (): ReactElement => {
  console.log('header render');

  const screenWidth = useScreenWidth();
  const lgOrGreater = screenWidth >= 992;

  const padding = lgOrGreater ? '1.5rem 0' : '0.25rem 0';

  const logoHeight = lgOrGreater ? 41 : 21;
  const logoWidth = calculateLogoWidth(logoHeight);

  return (
    <>
      <header className="bg-white" style={{ padding }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <div style={{ height: logoHeight, marginTop: 3 }}>
                <Image src={Logo} alt="Online Student Center" width={logoWidth} height={logoHeight} />
              </div>
            </div>
            <div className="col text-end">
              <AccountIcon />
            </div>
          </div>
        </div>
      </header>
      <HeaderBar />
    </>
  );
};
