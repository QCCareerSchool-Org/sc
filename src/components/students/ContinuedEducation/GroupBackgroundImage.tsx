import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import type { FC } from 'react';

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
import type { CourseSuggestionGroup } from './courseSuggestions';

type Props = {
  group: CourseSuggestionGroup;
};

export const GroupBackgroundImage: FC<Props> = ({ group }) => {
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
