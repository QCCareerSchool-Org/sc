import type { ChangeEventHandler, FC } from 'react';
import { useEffect, useState } from 'react';

import type { PriceResult } from '@/domain/price';
import { isPrice } from '@/domain/price';
import { endpoint } from 'src/basePath';

type Props = {
  selected: boolean;
  disabled: boolean;
  onToggle: (selected: boolean, courseCode: string, price?: PriceResult) => void;
  countryCode: string;
  provinceCode: string | undefined;
  courseCode: string;
};

export const ContinuingEducationCourse: FC<Props> = ({ selected, disabled, onToggle, countryCode, provinceCode, courseCode }) => {
  const [ price, setPrice ] = useState<PriceResult>();

  useEffect(() => {
    fetchPrice(countryCode, provinceCode, courseCode).then(setPrice).catch(console.error);
  }, [ countryCode, provinceCode, courseCode ]);

  const src = `${endpoint}/courseIconImages/${3}`;

  const handleChange: ChangeEventHandler<HTMLInputElement> = () => {
    if (disabled) {
      return;
    }
    onToggle(!selected, courseCode, price);
  };

  return (
    <div className="d-flex align-items-center mt-3">
      <img src={src} width="100" height="100" />
      {price
        ? <div><del>{price.currency.symbol}{price.cost.toFixed(2)}</del> {price.currency.symbol}{price.plans.full.total.toFixed(2)}</div>
        : (
          <div className="placeholder-glow">
            <span className="placeholder col-6" />
          </div>
        )
      }
      <div className="form-check">
        <input checked={selected && !disabled} onChange={handleChange} className="form-check-input" type="checkbox" disabled={disabled} />
      </div>
    </div>
  );
};

const fetchPrice = async (countryCode: string, provinceCode: string | undefined, courseCode: string): Promise<PriceResult> => {
  const url = 'https://api.qccareerschool.com/prices';

  const queryString = provinceCode
    ? `countryCode=${encodeURIComponent(countryCode)}&provinceCode=${encodeURIComponent(provinceCode)}&courses[]=${encodeURIComponent(courseCode)}&options[discountAll]=true`
    : `countryCode=${encodeURIComponent(countryCode)}&courses[]=${encodeURIComponent(courseCode)}&options[discountAll]=true`;

  const response = await fetch(`${url}?${queryString}`, {
    headers: { 'x-api-version': '2' },
  });
  if (!response.ok) {
    throw Error('Could not fetch prices');
  }

  const data: unknown = await response.json();
  if (!isPrice(data)) {
    throw Error('Invalid price result');
  }

  return data;
};
