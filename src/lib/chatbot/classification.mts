import type { OpenAI } from 'openai';

import type { RequestRoute, SchoolClassification } from './route.mjs';
import { isRequestRoute, questionClassifications } from './route.mjs';
import type { StudentPayload } from './studentPayload.mjs';
import type { SchoolSlug } from '@/domain/school.js';

export const classifyRequest = async (question: string, studentPayload: StudentPayload, client: OpenAI): Promise<RequestRoute> => {
  const candidateSchools = getCandidateSchools(studentPayload);
  const schoolChoices: SchoolClassification[] = [ ...candidateSchools, 'unknown' ];
  const body = createBody(question, schoolChoices);

  const response = await client.responses.create(body);

  if (response.error) {
    throw new Error(response.error.message);
  }

  const route = parseRouteOutput(response.output_text);
  const school = candidateSchools.length === 1
    ? candidateSchools[0] ?? 'unknown'
    : route.school;

  return { question: route.question, school };
};

const createBody = (
  question: string,
  schoolChoices: SchoolClassification[],
): OpenAI.Responses.ResponseCreateParamsNonStreaming => {
  const developerContent = `Classify the student's message for application routing.

Choose exactly one question classification:
- logistics: account, enrollment, grading timelines, submissions, support contacts, payments, portal navigation, school policy
- learning: course concepts, explanations, studying, tutoring, examples, practice
- assignment-help: help with assignments, drafts, outlines, brainstorming, graded work, quizzes, tests, exams

Choose exactly one school classification from the allowed schools:
${buildAllowedSchoolsPrompt(schoolChoices)}`;

  return {
    input: [
      { role: 'developer', content: developerContent },
      { role: 'user', content: question },
    ],
    // eslint-disable-next-line camelcase
    max_output_tokens: 64,
    model: 'gpt-4.1-mini',
    store: false,
    temperature: 0,
    text: {
      format: {
        name: 'request_route',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            question: {
              type: 'string',
              enum: questionClassifications,
            },
            school: {
              type: 'string',
              enum: schoolChoices,
            },
          },
          required: [ 'question', 'school' ],
        },
        strict: true,
        type: 'json_schema',
      },
    },
  };
};

const getCandidateSchools = (student: StudentPayload): SchoolSlug[] => {
  return [ ...new Set(student.enrollments.map(e => e.course.school.slug)) ];
};

const buildAllowedSchoolsPrompt = (schoolChoices: SchoolClassification[]): string => {
  const schoolDescriptions: Record<SchoolSlug, string> = {
    'design': 'QC Design School, interior design, decorating, staging, organizing, feng shui',
    'event': 'QC Event School, event planning, wedding planning, floral arrangement',
    'makeup': 'QC Makeup Academy, makeup artistry, special FX makeup, beauty',
    'pet': 'QC Pet Studies, professional dog grooming, professional pet training, professional pet care',
    'wellness': 'QC Wellness Studies, wellness coaching, life coaching, sleep coaching',
    'writing': 'Winghill Writing School, creative writing, writing courses',
    'paw-parent': 'Paw Parent Academy, groom your own dog',
  };

  return schoolChoices
    .map(school => `- ${school}: ${school === 'unknown' ? 'the school is not clear from the message' : schoolDescriptions[school]}`)
    .join('\n');
};

const parseRouteOutput = (outputText: string): RequestRoute => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(outputText);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(`Could not parse request route JSON: ${message}`);
  }

  if (!isRequestRoute(parsed)) {
    throw new Error(`Request route JSON had an unexpected shape`);
  }

  return parsed;
};
