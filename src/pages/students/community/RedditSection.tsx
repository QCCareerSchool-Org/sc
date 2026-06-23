import type { FC } from 'react';

import { DesignExpertSection, EventExpertSection, MakeupExpertSection, PetExpertSection } from './SchoolSections';
import type { SchoolSlug } from '@/domain/school';

interface Props {
  school: SchoolSlug;
}

export const RedditExpertSection: FC<Props> = ({ school }) => (
  <>
    {school === 'design' && <DesignExpertSection />}
    {school === 'makeup' && <MakeupExpertSection />}
    {school === 'event' && <EventExpertSection />}
    {school === 'pet' && <PetExpertSection />}
  </>
);
