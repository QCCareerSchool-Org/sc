import type { FC, MouseEventHandler } from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri';

import type { ShippingDetails } from './ContinuingEducationGroup';
import { getEnrollUrl } from './ContinuingEducationGroup';
import { CourseModalHeroImage } from './CourseModalHeroImage';
import type { CourseSuggestion } from './courseSuggestions';
import type { PriceResult } from '@/domain/price';
import type { SchoolSlug } from '@/domain/school';
import { getTelephoneNumber } from 'src/lib/helper-functions';

type Props = {
  disabled: boolean;
  course: CourseSuggestion;
  price?: PriceResult;
  schoolSlug: SchoolSlug;
  shippingDetails: ShippingDetails;
  onClose: () => void;
};

const padding = 1.5; // rem
const iconSize = 20; // px;

const getMailto = (schoolSlug: SchoolSlug): string => {
  switch (schoolSlug) {
    case 'design':
      return 'info@qccdesignschool.com';
    case 'event':
      return 'info@qceventplanning.com';
    case 'makeup':
      return 'info@qcmakeupacademy.com';
    case 'pet':
      return 'info@qcpetstudies.com';
    case 'wellness':
      return 'info@qcwellnessstudies.com';
    case 'writing':
      return 'info@winghill.com';
  }
};

export const CourseModal: FC<Props> = ({ disabled, course, schoolSlug, price, shippingDetails, onClose }) => {
  const mailto = getMailto(schoolSlug);
  const tel = getTelephoneNumber(shippingDetails.countryCode);
  const enrollUrl = getEnrollUrl(schoolSlug, [ course.code ], shippingDetails);

  const handleClose: MouseEventHandler<HTMLButtonElement> = () => {
    onClose();
  };

  return (
    <>
      <div className="modalWrapper">
        <div className="modalHeader">
          <CourseModalHeroImage course={course} />
          <div className="overlay" />
          <div className="modalHeaderContent">
            <button onClick={handleClose} className="closeButton" aria-label="Close"><RiArrowGoBackFill size="24" /></button>
            <h4 className="modalTitle">{course.name}</h4>
            <p className="modalCertification">{course.certification}</p>
          </div>
        </div>
        <div className="modalBody">
          <h5>Course Description</h5>
          <p>{course.shortDescription}</p>
          {Array.isArray(course.description)
            ? course.description.map((d, i, a) => {
              if (i === a.length - 1) {
                return <p key={i} className="mb-0">{d}</p>;
              }
              return <p key={i}>{d}</p>;
            })
            : typeof course.description === 'string' ? <p className="mb-0">{course.description}</p> : course.description
          }
        </div>
        <div className="modalFooter">
          <div className="modalFooterLeftColumn">
            <h5>Contact a Student Advisor</h5>
            <div className="footerIconRow">
              <div className="footerIcon"><a href={`mailto:${mailto}`}><FaEnvelope size={iconSize} /></a></div>
              <div className="footerIcon"><a href={`tel:${tel}`}><FaPhone size={iconSize} /></a></div>
            </div>
          </div>
          <div className="modalFooterRightColumn">
            {!disabled && (
              <>
                {price && (
                  <div className="price">
                    <span className="strike">{price.currency.symbol}{price.cost.toFixed(2)}</span>&nbsp; <span className="discountedPrice">{price.currency.symbol}{price.plans.full.total.toFixed(2)}</span>
                  </div>
                )}
                <a className="btn btn-primary btn-sm enrollButton" href={enrollUrl} target="_blank" rel="noopener noreferrer">Enroll Now</a>
              </>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
      .modalWrapper { background: white; }
      .modalHeader {
        display: flex;
        align-items: stretch;
        position: relative;
        overflow: hidden;
        background: rgb(0, 0, 64);
        color: white;
        height: 160px;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
      }
      .modalHeaderContent {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        position: relative;
        padding: ${padding}rem;
      }
      @media only screen and (min-width: 576px) {
        .modalHeader { height: 180px; }
      }
      @media only screen and (min-width: 768px) {
        .modalHeader { height: 200px; }
      }
      @media only screen and (min-width: 992px) {
        .modalHeader { height: 220px; }
      }
      @media only screen and (min-width: 1200px) {
        .modalHeader { height: 240px; }
      }
      h5 {
        font-size: 1rem;
        font-weight: bold;
      }
      @media only screen and (min-width: 768px) {
        h5 { font-size: 1.125rem; }
      }
      .closeButton {
        position: absolute;
        color: white;
        background: none;
        top: ${padding}rem;
        right: ${padding}rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
      .modalTitle {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }
      @media only screen and (min-width: 576px) {
        .modalTitle {
          font-size: 1.75rem;
        }
      }
      @media only screen and (min-width: 992px) {
        .modalTitle {
          font-size: 2rem;
        }
      }
      .modalCertification {
        font-size: 0.875rem;
        margin-bottom: 0;
        text-transform: uppercase;
      }
      .modalBody {
        padding: ${padding}rem;
      }
      .modalFooter {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        background-color: #323232;
        color: white;
        padding: ${padding}rem;
      }
      .modalFooterLeftColumn {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .footerIconRow {
        display: flex;
      }
      .footerIcon {
        margin-right: 1.5rem;
      }
      .footerIcon a {
        color: inherit;
      }
      .enrollButton {
        border-radius: 0;
        box-shadow: none;
        width: 100%;
        text-transform: uppercase;
      }
      .price {
        font-weight: bold;
        line-height: 1;
        margin-bottom: 1rem;
      }
      .discountedPrice {
        color: #ff0006;
        font-size: 1.2rem;
      }
      .strike {
        position: relative;
        padding: 0 0.125rem;
        margin: 0 0 0.5rem !important;
      }
      .strike::after {
        border-bottom: 1px solid #eee;
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
