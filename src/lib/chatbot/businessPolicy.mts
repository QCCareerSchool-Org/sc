import type { OpenAI } from 'openai';

import type { StudentPayload } from './studentPayload.mjs';
import type { SchoolSlug } from '@/domain/school.js';

export const businessPolicyViolations = [
  'none',
  'submit-ready-academic-work',
  'off-domain-homework',
] as const;

export type BusinessPolicyViolation = typeof businessPolicyViolations[number];

interface BusinessPolicyResult {
  violation: BusinessPolicyViolation;
}

const model = 'gpt-4.1-mini';

export const classifyBusinessPolicy = async (
  question: string,
  studentPayload: StudentPayload,
  client: OpenAI,
): Promise<BusinessPolicyViolation> => {
  const response = await client.responses.create(createBody(question, studentPayload));

  if (response.error) {
    throw new Error(response.error.message);
  }

  return parseBusinessPolicyOutput(response.output_text).violation;
};

const createBody = (
  question: string,
  studentPayload: StudentPayload,
): OpenAI.Responses.ResponseCreateParamsNonStreaming => {
  return {
    input: [
      { role: 'developer', content: createDeveloperPrompt(studentPayload) },
      { role: 'user', content: question },
    ],
    // eslint-disable-next-line camelcase
    max_output_tokens: 64,
    model,
    store: false,
    temperature: 0,
    text: {
      format: {
        name: 'business_policy',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            violation: {
              type: 'string',
              enum: businessPolicyViolations,
            },
          },
          required: [ 'violation' ],
        },
        strict: true,
        type: 'json_schema',
      },
    },
  };
};

const createDeveloperPrompt = (studentPayload: StudentPayload): string => {
  const enrolledSchools = getEnrolledSchools(studentPayload);

  return `Classify whether the student's message violates QC Career School chatbot business policy.

Return exactly one violation label:
- none
- submit-ready-academic-work
- off-domain-homework

Use submit-ready-academic-work when the student asks the assistant to write, complete, solve, polish, or provide final answers for work they could submit as their own in a QC, Winghill, or Paw Parent course.

Use off-domain-homework when the student asks for tutoring or homework help outside QC Career School, QC Design School, QC Event School, QC Makeup Academy, QC Pet Studies, QC Wellness Studies, Winghill Writing School, or Paw Parent Academy.

Off-domain homework includes:
- math, algebra, geometry, calculus, statistics, physics, chemistry, biology, or general school homework
- solving equations, worksheets, quizzes, exams, or test questions for outside school
- unrelated essays, assignments, study help, or academic tutoring outside the student's QC course context

Do not flag:
- account support, grading timelines, portal navigation, payments, submissions, or school policy questions
- tutoring, explanations, brainstorming, outlines, or feedback for the student's enrolled QC/Winghill/Paw Parent courses, as long as the request is not asking for submit-ready work
- practical calculations directly related to an enrolled course, such as pricing, budgeting, measurements, scheduling, ratios, dimensions, or business estimates

The student's enrolled schools are:
${buildSchoolList(enrolledSchools)}`;
};

const getEnrolledSchools = (studentPayload: StudentPayload): SchoolSlug[] => {
  return [ ...new Set(studentPayload.enrollments.map(e => e.course.school.slug)) ];
};

const buildSchoolList = (schools: SchoolSlug[]): string => {
  if (schools.length === 0) {
    return '- unknown';
  }

  return schools.map(school => `- ${school}: ${schoolDescriptions[school]}`).join('\n');
};

const schoolDescriptions: Record<SchoolSlug, string> = {
  'design': 'QC Design School, interior design, decorating, staging, organizing, feng shui',
  'event': 'QC Event School, event planning, wedding planning, floral arrangement',
  'makeup': 'QC Makeup Academy, makeup artistry, special FX makeup, beauty',
  'pet': 'QC Pet Studies, professional dog grooming, professional pet training, professional pet care',
  'wellness': 'QC Wellness Studies, wellness coaching, life coaching, sleep coaching',
  'writing': 'Winghill Writing School, creative writing, writing courses',
  'paw-parent': 'Paw Parent Academy, groom your own dog',
};

const parseBusinessPolicyOutput = (outputText: string): BusinessPolicyResult => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(outputText);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(`Could not parse business policy JSON: ${message}`);
  }

  if (!isBusinessPolicyResult(parsed)) {
    throw new Error('Business policy JSON had an unexpected shape');
  }

  return parsed;
};

const isBusinessPolicyResult = (value: unknown): value is BusinessPolicyResult => {
  return value !== null && typeof value === 'object'
    && 'violation' in value && isBusinessPolicyViolation(value.violation);
};

const isBusinessPolicyViolation = (value: unknown): value is BusinessPolicyViolation => {
  return typeof value === 'string'
    && businessPolicyViolations.includes(value as BusinessPolicyViolation);
};
