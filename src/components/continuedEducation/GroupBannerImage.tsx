import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { FC } from 'react';

import type { CourseSuggestionGroup } from '@/domain/courseSuggestion';
import AddValueHomes from '@/images/course-suggestions/banners/add-value-homes.jpg';
import BeautifulEvents from '@/images/course-suggestions/banners/beautiful-events.jpg';
import CorporateClients from '@/images/course-suggestions/banners/corporate-clients.jpg';
import DifferenceDesign from '@/images/course-suggestions/banners/difference-design.jpg';
import ExpandSkillsHome from '@/images/course-suggestions/banners/expand-skills-home.jpg';
import FullServiceDogCare from '@/images/course-suggestions/banners/full-service-dog-care.jpg';
import HighBugdetEvents from '@/images/course-suggestions/banners/high-budget-events.jpg';
import JumpstartAdvances from '@/images/course-suggestions/banners/jumpstart-advanced.jpg';
import LookTheirBest from '@/images/course-suggestions/banners/look-their-best.jpg';
import SchoolDesign from '@/images/course-suggestions/banners/school-design.jpg';
import SchoolEvent from '@/images/course-suggestions/banners/school-event.jpg';
import SchoolMakeup from '@/images/course-suggestions/banners/school-makeup.jpg';
import SchoolPet from '@/images/course-suggestions/banners/school-pet.jpg';
import SchoolWellness from '@/images/course-suggestions/banners/school-wellness.jpg';
import SleepSpaces from '@/images/course-suggestions/banners/sleep-spaces.jpg';
import TVFilmTheatre from '@/images/course-suggestions/banners/tv-film-theatre.jpg';

type Props = {
  group: CourseSuggestionGroup;
};

export const GroupBannerImage: FC<Props> = ({ group }) => {
  const imageSrc = getImageSrc(group.id);

  return <Image
    src={imageSrc}
    placeholder="blur"
    priority
    layout="fill"
    objectFit="cover"
    objectPosition="center"
    sizes="100vw"
    alt={group.description}
    className=""
  />;
};

const getImageSrc = (groupId: string): StaticImageData => {
  switch (groupId) {
    case 'school-design':
      return SchoolDesign;
    case 'school-event':
      return SchoolEvent;
    case 'school-makeup':
      return SchoolMakeup;
    case 'school-pet':
      return SchoolPet;
    case 'school-wellness':
      return SchoolWellness;
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
