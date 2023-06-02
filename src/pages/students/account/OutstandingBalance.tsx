import Image from 'next/image';
import type { FC } from 'react';

import styles from './MZKitNotice.module.css';
import KitImage from './sc-deluxe-no-brushes.jpg';
import { getTelephoneNumber } from 'src/lib/helper-functions';

type Props = {
  countryCode: string;
};

export const OutstandingBalance: FC<Props> = ({ countryCode }) => {
  const mailtoHref = 'mailto:account@qccareerschool.com?subject=Paying Off My Balance&body=Please send me more information on any discounts and promotions that I qualify for if I pay off my balance.';

  const telephoneNumber = getTelephoneNumber(countryCode);

  return (
    <div className={styles.card}>
      <div className={styles.textWrapper}>
        <h3>Did You Know?</h3>
        <p className="mb-0">You can pay off your balance early and save 10% on your remaining tuition. Please <a href={mailtoHref}>send us an email</a> or give us a call at <a className="text-nowrap" href={`tel:${telephoneNumber}`}>{telephoneNumber}</a> to learn more.</p>
      </div>
    </div>
  );
};
