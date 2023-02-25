import Big from 'big.js';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { FC } from 'react';
import { useMemo, useReducer, useState } from 'react';
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
import { ContinuingEducationCourse } from './ContinuingEducationCourse';
import type { CourseSuggestionGroup } from './courseSuggestions';
import type { Course } from '@/domain/course';
import type { Currency, PriceResult } from '@/domain/price';
import { useScreenWidth } from '@/hooks/useScreenWidth';
import { useToggle } from '@/hooks/useToggle';

type SelectedCourse = {
  courseCode: string;
  price: PriceResult;
};

type Props = {
  countryCode: string;
  provinceCode: string | undefined;
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

export const ContinuingEducationGroup: FC<Props> = ({ countryCode, provinceCode, group, disabledCourses }) => {
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
              <div>Learn More</div> {expanded ? <FaMinusCircle size={iconSize} /> : <FaPlusCircle size={iconSize} />}
            </div>
          </div>
        </button>
        {expanded && (
          <div>
            {group.courseCodes.map(courseCode => (
              <ContinuingEducationCourse
                key={courseCode}
                selected={state.selectedCourses.findIndex(s => s.courseCode === courseCode) !== -1}
                disabled={disabledCourses.findIndex(c => c.code === courseCode) !== -1}
                onToggle={handleToggle}
                countryCode={countryCode}
                provinceCode={provinceCode}
                courseCode={courseCode}
              />
            ))}
            {state.selectedCourses.length > 0 && (
              <div className="mt-3 bg-f1 total d-flex align-items-center justify-content-end">
                <div><strong>Total:</strong> <del>{state.currency?.symbol}{state.normalPrice.toFixed(2)}</del> {state.currency?.symbol}{state.price.toFixed(2)}</div>
                <button className="btn btn-primary ms-4 enrollButton">Enroll Now</button>
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
