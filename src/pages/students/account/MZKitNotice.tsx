import Image from 'next/image';
import type { FC } from 'react';

import styles from './MZKitNotice.module.css';
import KitImage from './sc-deluxe-no-brushes.jpg';
import { getTelephoneNumber } from 'src/lib/helper-functions';

interface Props {
  countryCode: string;
}

export const MZKitNotice: FC<Props> = ({ countryCode }) => {
  const mailtoHref = 'mailto:account@qccareerschool.com?subject=Paying Off My Balance&body=Please send me more information on any discounts and promotions that I qualify for if I pay off my balance.';

  const telephoneNumber = getTelephoneNumber(countryCode);

  return (
    <div className={styles.card}>
      <div className={styles.textWrapper}>
        <h3>Did You Know?</h3>
        <p>We'll ship you the Deluxe Kit when your balance is paid off!</p>
        <p className="mb-0">Also, you can pay off your balance early and save 10% on your remaining tuition. Please <a href={mailtoHref}>send us an email</a> or give us a call at <a className="text-nowrap" href={`tel:${telephoneNumber}`}>{telephoneNumber}</a> to learn more.</p>
      </div>
      <Image src={KitImage} alt="Deluxe Makeup Kit" />
    </div>
  );
};
