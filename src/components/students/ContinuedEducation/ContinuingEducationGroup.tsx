import Big from 'big.js';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { FC } from 'react';
import { useMemo, useReducer } from 'react';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

import AddValueHomes from '../../../images/course-suggestions/backgrounds/add-value-homes.jpg';
import BeautifulEvents from '../../../images/course-suggestions/backgrounds/beautiful-events.jpg';
import CorporateClients from '../../../images/course-suggestions/backgrounds/corporate-clients.jpg';
import DifferenceDesign from '../../../images/course-suggestions/backgrounds/difference-design.jpg';
import ExpandSkillsHome from '../../../images/course-suggestions/backgrounds/expand-skills-home.jpg';
import FullServiceDogCare from '../../../images/course-suggestions/backgrounds/full-service-dog-care.jpg';
import HighBugdetEvents from '../../../images/course-suggestions/backgrounds/high-budget-events.jpg';
import JumpstartAdvances from '../../../images/course-suggestions/backgrounds/jumpstart-advanced.jpg';
import LookTheirBest from '../../../images/course-suggestions/backgrounds/look-their-best.jpg';
import SleepSpaces from '../../../images/course-suggestions/backgrounds/sleep-spaces.jpg';
import TVFilmTheatre from '../../../images/course-suggestions/backgrounds/tv-film-theatre.jpg';
import type { CourseSuggestionGroup } from '../CourseIndex/courseSuggestions';
import { ContinuingEducationCourse } from './ContinuingEducationCourse';
import type { Course } from '@/domain/course';
import type { Currency, PriceResult } from '@/domain/price';
import type { SchoolSlug } from '@/domain/school';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { useToggle } from '@/hooks/useToggle';

export type ShippingDetails = {
  sex: 'M' | 'F';
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  provinceCode: string | undefined;
  postalCode: string | undefined;
  countryCode: string;
  telephoneNumber: string;
  emailAddress: string;
};

type SelectedCourse = {
  courseCode: string;
  price: PriceResult;
};

type Props = {
  shippingDetails: ShippingDetails;
  schoolSlug: SchoolSlug;
  group: CourseSuggestionGroup;
  disabledCourses: Course[];
};

type State = {
  selectedCourses: SelectedCourse[];
  normalPrice: number;
  price: number;
  currency?: Currency;
};

type Action =
  | { type: 'COURSE_ADDED'; payload: { courseCode: string; price?: PriceResult } }
  | { type: 'COURSE_REMOVED'; payload: { courseCode: string } };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'COURSE_ADDED': {
      if (typeof action.payload.price === 'undefined') {
        return state; // no change if prices haven't loaded yet
      }

      if (state.currency && state.currency.code !== action.payload.price.currency.code) {
        return state; // trying to add a course with a different price
      }

      const newCurrency = state.currency ? state.currency : action.payload.price.currency;
      const newSelectedCourses = [ ...state.selectedCourses, { courseCode: action.payload.courseCode, price: action.payload.price } ];
      const [ newNormalPrice, newPrice ] = recalculatePrices(newSelectedCourses);
      return {
        ...state,
        selectedCourses: newSelectedCourses,
        normalPrice: newNormalPrice,
        price: newPrice,
        currency: newCurrency,
      };
    }
    case 'COURSE_REMOVED': {
      const newSelectedCourses = state.selectedCourses.filter(s => s.courseCode !== action.payload.courseCode);
      const newCurrency = newSelectedCourses.length === 0 ? undefined : state.currency; // set to undefined if final course is removed
      const [ newNormalPrice, newPrice ] = recalculatePrices(newSelectedCourses);
      return {
        ...state,
        selectedCourses: newSelectedCourses,
        normalPrice: newNormalPrice,
        price: newPrice,
        currency: newCurrency,
      };
    }
  }
};

const recalculatePrices = (selectedCourses: SelectedCourse[]): [normalPrice: number, price: number] => {
  const [ normalPrice, price ] = selectedCourses.reduce<[Big, Big]>(([ prevNormalPrice, prevPrice ], curr) => {
    return [ prevNormalPrice.plus(curr.price.cost), prevPrice.plus(curr.price.plans.full.total) ];
  }, [ Big(0), Big(0) ]);
  return [ parseFloat(normalPrice.toFixed(2)), parseFloat(price.toFixed(2)) ];
};

const initialState: State = {
  selectedCourses: [],
  normalPrice: 0,
  price: 0,
};

const getEnrollUrlBase = (schoolSlug: SchoolSlug): string => {
  switch (schoolSlug) {
    case 'design':
      return 'https://enroll.qcdesignschool.com/continued-education';
    case 'event':
      return 'https://enroll.qceventplanning.com/continued-education';
    case 'makeup':
      return 'https://enroll.qcmakeupacademy.com/continued-education';
    case 'pet':
      return 'https://enroll.qcpetstudies.com/continued-education';
    case 'wellness':
      return 'https://enroll.qcwellnessstudies.com/continued-education';
    case 'writing':
      return 'https://enroll.winghill.com/continued-education';
  }
};

export const getEnrollUrl = (schoolSlug: SchoolSlug, courses: string[], shippingDetails: ShippingDetails): string => {
  const params = new URLSearchParams();
  for (const c of courses) {
    params.append('c', c);
  }
  params.append('sex', shippingDetails.sex);
  params.append('firstName', shippingDetails.firstName);
  params.append('lastName', shippingDetails.lastName);
  params.append('address1', shippingDetails.address1);
  params.append('address2', shippingDetails.address2);
  params.append('city', shippingDetails.city);
  if (shippingDetails.provinceCode) {
    params.append('provinceCode', shippingDetails.provinceCode);
  }
  if (shippingDetails.postalCode) {
    params.append('postalCode', shippingDetails.postalCode);
  }
  params.append('countryCode', shippingDetails.countryCode);
  params.append('telephoneNumber', shippingDetails.telephoneNumber);
  params.append('emailAddress', shippingDetails.emailAddress);

  return getEnrollUrlBase(schoolSlug) + '?' + params.toString();
};

export const ContinuingEducationGroup: FC<Props> = ({ shippingDetails, schoolSlug, group, disabledCourses }) => {
  const screenWidth = useScreenWidth();
  const [ expanded, toggleExpanded ] = useToggle(false);

  const [ state, dispatch ] = useReducer(reducer, initialState);

  const imageSrc = getImageSrc(group.id);

  const handleClick = (): void => {
    toggleExpanded();
  };

  const handleToggle = (selected: boolean, courseCode: string, price?: PriceResult): void => {
    if (selected) {
      dispatch({ type: 'COURSE_ADDED', payload: { courseCode, price } });
    } else {
      dispatch({ type: 'COURSE_REMOVED', payload: { courseCode } });
    }
  };

  const iconSize = screenWidth > 992 ? 24 : 20;

  const enrollUrl = useMemo(() => {
    return getEnrollUrl(schoolSlug, state.selectedCourses.map(s => s.courseCode), shippingDetails);
  }, [ schoolSlug, state.selectedCourses, shippingDetails ]);

  return (
    <div className="groupCard">
      <div className="groupCardPadding">
        <button onClick={handleClick} className="clearButton">
          <div className="imageWrapper d-flex flex-column justify-content-center text-white">
            <Image
              src={imageSrc}
              placeholder="blur"
              priority
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              sizes="100vw"
              alt={group.description}
              className=""
            />
            <h3 className="h2 mb-0 description">{group.description}</h3>
            <div className="d-flex justify-content-between plus">
              <div><small className="text-uppercase">Learn More</small></div> {expanded ? <FaMinusCircle size={iconSize} /> : <FaPlusCircle size={iconSize} />}
            </div>
          </div>
        </button>
        {expanded && (
          <div>
            {group.courses.map(course => (
              <ContinuingEducationCourse
                key={course.code}
                selected={state.selectedCourses.findIndex(s => s.courseCode === course.code) !== -1}
                disabled={disabledCourses.findIndex(c => c.code === course.code) !== -1}
                onToggle={handleToggle}
                schoolSlug={schoolSlug}
                shippingDetails={shippingDetails}
                course={course}
              />
            ))}
            {state.selectedCourses.length > 0 && (
              <div className="mt-3 bg-f1 total d-flex align-items-center justify-content-end">
                <div>Total: <span className="price"><span className="strike">{state.currency?.symbol}{state.normalPrice.toFixed(2)}</span>&nbsp; <span className="discountedPrice">{state.currency?.symbol}{state.price.toFixed(2)}</span></span></div>
                <a href={enrollUrl} className="btn btn-primary ms-4 enrollButton" target="_blank" rel="noopener noreferrer">Enroll Now</a>
              </div>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        .clearButton {
          margin: 0;
          padding: 0;
          border: 0;
          width: 100%;
          text-align: left;
        }
        .groupCard {
          background-color: white;
          margin-bottom: 1rem;
          margin-left: -1rem;
          margin-right: -1rem;
        }
        @media only screen and (min-width: 576px) {
          .groupCard {
            margin-left: 0;
            margin-right: 0;
          }
        }
        .groupCardPadding {
          padding: 1rem;
        }
        .imageWrapper {
          width: 100%;
          height: 180px;
          padding: 0 1.5rem;
          position: relative;
        }
        @media only screen and (min-width: 1200px) {
          .imageWrapper { height: 200px; }
        }
        @media only screen and (min-width: 1600px) {
          .imageWrapper { height: 220px; }
        }
        .description {
          position: relative;
          z-index: 10;
          top: -0.5rem;
          width: 80%;
          max-width: 400px;
        }
        .plus {
          position: absolute;
          padding: 0 1.5rem;
          width: 100%;
          bottom: 1rem;
          left: 0;
        }
        .total {
          padding: 1.5rem;
          text-align: right;
        }
        .enrollButton {
          border-radius: 0;
          text-transform: uppercase;
          box-shadow: none;
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
    </div>
  );
};

const getImageSrc = (groupId: string): StaticImageData => {
  switch (groupId) {
    case 'high-budget-events':
      return HighBugdetEvents;
    case 'corporate-clients':
      return CorporateClients;
    case 'beautiful-events':
      return BeautifulEvents;
    case 'sleep-spaces':
      return SleepSpaces;
    case 'add-value-homes':
      return AddValueHomes;
    case 'difference-design':
      return DifferenceDesign;
    case 'expand-skills-home':
      return ExpandSkillsHome;
    case 'full-service-dog-care':
      return FullServiceDogCare;
    case 'look-their-best':
      return LookTheirBest;
    case 'tv-film-theatre':
      return TVFilmTheatre;
    case 'jumpstart-advanced':
      return JumpstartAdvances;
    default:
      return HighBugdetEvents;
  }
};
