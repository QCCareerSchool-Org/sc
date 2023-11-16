import type { ChangeEventHandler, FC, MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';

import type { ShippingDetails } from './ContinuingEducationGroup';
import { CourseModal } from './CourseModal';
import { CourseThumbnailImage } from './CourseThumbnailImage';
import { Modal } from '@/components/Modal';
import type { CourseSuggestion } from '@/domain/courseSuggestion';
import type { PriceResult } from '@/domain/price';
import { isPrice } from '@/domain/price';
import type { SchoolSlug } from '@/domain/school';
import { useScreenWidth } from '@/hooks/useScreenWidth';

type Props = {
  selected: boolean;
  disabled: boolean;
  onToggle: (selected: boolean, courseCode: string, price?: PriceResult) => void;
  schoolSlug: SchoolSlug;
  shippingDetails: ShippingDetails;
  course: CourseSuggestion;
};

export const ContinuingEducationCourse: FC<Props> = ({ selected, disabled, onToggle, schoolSlug, shippingDetails, course }) => {
  const [ price, setPrice ] = useState<PriceResult>();
  const screenWidth = useScreenWidth();
  const [ popup, setPopup ] = useState(false);

  useEffect(() => {
    fetchPrice(shippingDetails.countryCode, shippingDetails.provinceCode, course.code).then(setPrice).catch(console.error);
  }, [ shippingDetails.countryCode, shippingDetails.provinceCode, course.code ]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = () => {
    if (disabled) {
      return;
    }
    onToggle(!selected, course.code, price);
  };

  const handleClick: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault();
    setPopup(true);
  };

  const handleClose = (): void => {
    setPopup(false);
  };

  const sm = screenWidth >= 576;
  const md = screenWidth >= 768;
  const lg = screenWidth >= 992;
  const xl = screenWidth >= 1200;

  const imageSize = xl ? 160 : lg ? 120 : md ? 90 : 120;

  return (
    <>
      <div className={`wrapper ${disabled ? 'disabled' : ''} mt-3`}>
        <div className="d-flex align-items-stretch">
          {screenWidth >= 440 && (
            <div>
              <CourseThumbnailImage course={course} size={imageSize} />
            </div>
          )}
          <div className="d-flex align-items-stretch justify-content-around justify-content-lg-start flex-grow-1 py-3 px-4">
            <div className="d-flex align-items-center me-4">
              <div className="form-check">
                <input checked={selected && !disabled} onChange={handleChange} className="form-check-input courseCheck" type="checkbox" disabled={disabled} />
              </div>
            </div>
            {lg && (
              <div className="d-flex align-items-center me-4 flex-grow-1 w-100">
                <div className="w-100">
                  <h4 className="h5 mb-1">{course.name}</h4>
                  <p className={`mb-0 ${!lg ? 'small' : ''} description`}><span className="muted">{course.shortDescription}</span> <a onClick={handleClick} href="#" className="learnMore">Learn More</a></p>
                </div>
              </div>
            )}
            {lg && <div className="d-flex align-items-center me-4 separator">&nbsp;</div>}
            {md && !lg && <div className="d-flex align-items-center me-4 flex-grow-1"><h4 className="h5 mb-0">{course.name}</h4></div>}
            <div className="d-flex align-items-center flex-grow-1 flex-shrink-0" style={{ width: lg ? 200 : undefined }}>
              <div className="w-100 text-center">
                <div style={{ maxWidth: 203, margin: '0 auto' }}>
                  {!md && <h4 className={`${sm ? 'h5' : 'h6'} mb-1`}>{course.name}</h4>}
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
      {!lg && <div className="mt-2"><p className="mb-0 small description"><span className="muted">{course.shortDescription}</span> <a onClick={handleClick} href="#" className="learnMore">Learn More</a></p></div>}
      <Modal size="lg" show={popup} onClose={handleClose}>
        <CourseModal disabled={disabled} course={course} price={price} schoolSlug={schoolSlug} shippingDetails={shippingDetails} onClose={handleClose} />
      </Modal>
      <style jsx>{`
      .wrapper {
        border: 1px solid rgba(0,0,0,0.1);
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
        border-right: 1.5px solid rgba(0, 0, 0, 0.1);
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

  const now = new Date().getTime();

  const promoCode = now >= Date.UTC(2023, 10, 16, 14, 30) && now < Date.UTC(2023, 11, 1, 5)
    ? 'SAVE60'
    : '';

  const queryString = provinceCode
    ? `countryCode=${encodeURIComponent(countryCode)}&provinceCode=${encodeURIComponent(provinceCode)}&courses[]=${encodeURIComponent(courseCode)}&options[discountAll]=true&options[promoCode]=${encodeURIComponent(promoCode)}`
    : `countryCode=${encodeURIComponent(countryCode)}&courses[]=${encodeURIComponent(courseCode)}&options[discountAll]=true&options[promoCode]=${encodeURIComponent(promoCode)}`;

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
