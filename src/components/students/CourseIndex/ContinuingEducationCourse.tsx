import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
import { GrRevert } from 'react-icons/gr';

import { CourseModal } from './CourseModal';
import { Modal } from '@/components/Modal';
import type { PriceResult } from '@/domain/price';
import { isPrice } from '@/domain/price';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { endpoint } from 'src/basePath';

type Props = {
  selected: boolean;
  disabled: boolean;
  onToggle: (selected: boolean, courseCode: string, price?: PriceResult) => void;
  countryCode: string;
  provinceCode: string | undefined;
  courseCode: string;
  name: string;
  shortDescription: string;
  description: string | string[] | JSX.Element;
};

export const ContinuingEducationCourse: FC<Props> = ({ selected, disabled, onToggle, countryCode, provinceCode, courseCode, name, shortDescription, description }) => {
  const [ price, setPrice ] = useState<PriceResult>();
  const screenWidth = useScreenWidth();
  const [ popup, setPopup ] = useState(false);

  useEffect(() => {
    fetchPrice(countryCode, provinceCode, courseCode).then(setPrice).catch(console.error);
  }, [ countryCode, provinceCode, courseCode ]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = () => {
    if (disabled) {
      return;
    }
    onToggle(!selected, courseCode, price);
  };

  const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault();
    setPopup(true);
  };

  const handleClose = (): void => {
    console.log('handle close called');
    setPopup(prev => {
      console.log('previous value is', prev);
      return false;
    });
  };

  const sm = screenWidth >= 576;
  const md = screenWidth >= 768;
  const lg = screenWidth >= 992;
  const xl = screenWidth >= 1200;

  const imageSize = xl ? 160 : lg ? 120 : md ? 90 : 120;

  const src = `${endpoint}/courseIconImages/${3}`;

  return (
    <>
      <div className={`wrapper ${disabled ? 'disabled' : ''} mt-3`}>
        <div className="d-flex align-items-stretch">
          <div>
            <img src={src} width={imageSize} height={imageSize} />
          </div>
          <div className="d-flex align-items-stretch justify-content-around justify-content-lg-start flex-grow-1 py-3 px-4">
            <div className="d-flex align-items-center me-4">
              <div className="form-check">
                <input checked={selected && !disabled} onChange={handleChange} className="form-check-input courseCheck" type="checkbox" disabled={disabled} />
              </div>
            </div>
            {lg && (
              <div className="d-flex align-items-center me-4 flex-grow-1">
                <div>
                  <h4 className="h5 mb-1">{name}</h4>
                  <p className={`mb-0 ${!lg ? 'small' : ''} description`}><span className="muted">{shortDescription}</span> <a onClick={handleClick} href="#" className="learnMore">Learn More</a></p>
                </div>
              </div>
            )}
            {lg && <div className="d-flex align-items-center me-4 separator">&nbsp;</div>}
            {md && !lg && <div className="d-flex align-items-center me-4 flex-grow-1"><h4 className="h5 mb-0">{name}</h4></div>}
            <div className="d-flex align-items-center flex-shrink-0" style={{ width: lg ? 200 : undefined }}>
              <div className="w-100 text-center">
                <div style={{ maxWidth: 203, margin: '0 auto' }}>
                  {!md && <h4 className={`${sm ? 'h5' : 'h6'} mb-1`}>{name}</h4>}
                </div>
                {disabled
                  ? <div><strong>Already Enrolled</strong></div>
                  : price && (
                    <div className="price">
                      <span className="strike">{price.currency.symbol}{price.cost.toFixed(2)}</span>&nbsp; <span className="discountedPrice">{price.currency.symbol}{price.plans.full.total.toFixed(2)}</span>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {!lg && <div className="mt-2"><p className="mb-0 small description"><span className="muted">{shortDescription}</span> <a onClick={handleClick} href="#" className="learnMore">Learn More</a></p></div>}
      <Modal size="lg" show={popup} onClose={handleClose}>
        <CourseModal title={name} onClose={handleClose}>
          <p>{shortDescription}</p>
          {Array.isArray(description)
            ? description.map((d, i, a) => {
              if (i === a.length - 1) {
                return <p key={i} className="mb-0">{d}</p>;
              }
              return <p key={i}>{d}</p>;
            })
            : typeof description === 'string' ? <p className="mb-0">{description}</p> : description
          }
        </CourseModal>
      </Modal>
      <style jsx>{`
      .wrapper {
        border: 1px solid rgba(0,0,0,0.15);
      }
      .wrapper.disabled {
        background-color: #e5e5e5;
      }
      .description {
        font-size: 0.875rem;
        line-height: 1.125rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      @media only screen and (min-width: 1200px) {
        .description {
          font-size: 1rem;
          line-height: 1.25rem;
        }
      }
      .muted {
        color: #777;
      }
      .wrapper.disabled .muted {
        color: #555;
      }
      .learnMore {
        white-space: nowrap;
        color: inherit;
        // font-weight: bold;
        // text-decoration: none;
      }
      .separator {
        border-right: 1.5px solid rgba(0, 0, 0, 0.3);
      }
      .courseCheck {
        border-radius: 0;
        width: 1.5rem;
        height: 1.5rem;
      }
      .courseCheck:checked {
        background-color: #3eb041;
        border-color: #3eb041;
      }
      .courseCheck:focus{
        border-color: #78e37b;
        outline: 0;
        box-shadow: 0 0 0 .25rem rgba(62, 176, 65, .25);
      }
      .price {
        font-weight: bold;
      }
      .discountedPrice {
        color: #ca0000;
        font-size: 1.2rem;
      }
      .strike {
        position: relative;
        padding: 0 0.25rem;
        margin: 0 0 0.5rem !important;
      }
      .strike::after {
        border-bottom: 1px solid #333;
        content: '';
        left: 0;
        right: 0;
        top: 50%;
        margin-top: calc(0.125rem / 2);
        position: absolute;
        transform: rotate(358deg);
        -webkit-transform: rotate(358deg);
        -moz-transform: rotate(358deg);
        -o-transform: rotate(358deg);
        -ms-transform: rotate(358deg);
      }
      `}</style>
    </>
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
