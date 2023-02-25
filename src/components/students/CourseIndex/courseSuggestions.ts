import type { SchoolSlug } from '@/domain/school';

export type CourseSuggestionGroup = {
  id: string;
  description: string;
  courseCodes: string[];
};

export const courseSuggestionGroups: Record<SchoolSlug, CourseSuggestionGroup[]> = {
  event: [
    {
      id: 'high-budget-events',
      description: 'Plan high-budget events.',
      courseCodes: [ 'EP', 'DW', 'LW', 'CP' ],
    },
    {
      id: 'corporate-clients',
      description: 'Stand out to corporate clients.',
      courseCodes: [ 'CP', 'FL', 'PE', 'EB' ],
    },
    {
      id: 'beautiful-events',
      description: 'Execute beautiful events with hands-on skills.',
      courseCodes: [ 'FD', 'ED' ],
    },
  ],
  wellness: [
    {
      id: 'sleep-spaces',
      description: 'Plan ideal sleep spaces.',
      courseCodes: [ 'PO', 'CC' ],
    },
  ],
  design: [
    {
      id: 'add-value-homes',
      description: 'Add value to your client\'s homes.',
      courseCodes: [ 'ST', 'LD', 'I2' ],
    },
    {
      id: 'difference-design',
      description: 'Make a difference with design.',
      courseCodes: [ 'AP', 'PO', 'FS' ],
    },
    {
      id: 'expand-skills-home',
      description: 'Expand your design skills outside the home.',
      courseCodes: [ 'LD', 'FD', 'ED' ],
    },
  ],
  pet: [
    {
      id: 'full-service-dog-care',
      description: 'Provide full-service dog care.',
      courseCodes: [ 'DG', 'DT', 'DD' ],
    },
  ],
  makeup: [
    {
      id: 'look-their-best',
      description: 'Help your clients feel and look their best.',
      courseCodes: [ 'SK', 'HS', 'MW' ],
    },
    {
      id: 'tv-film-theatre',
      description: 'Work in television, film and theater.',
      courseCodes: [ 'SF', 'AB' ],
    },
    {
      id: 'jumpstart-advanced',
      description: 'Jumpstart your career with advanced training.',
      courseCodes: [ 'AB', 'MW', 'PW' ],
    },
  ],
  writing: [],
};
