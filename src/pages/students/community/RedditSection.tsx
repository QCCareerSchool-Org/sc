import type { FC } from 'react';

import { DesignExpertSection, EventExpertSection, MakeupExpertSection, PetExpertSection } from './SchoolSections';

interface Props {
  school: 'design' | 'makeup' | 'event' | 'pet';
}

export const RedditExpertSection: FC<Props> = ({ school }) => {

  return (
    <>
      {school === 'design' && <DesignExpertSection />}
      {school === 'makeup' && <MakeupExpertSection />}
      {school === 'event' && <EventExpertSection />}
      {school === 'pet' && <PetExpertSection />}
    </>
  );
};
