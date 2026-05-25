import type { OpenAI } from 'openai';

import type { PromptClassification } from './promptClassification.mjs';
import { isPromptClassification, questionClassifications } from './promptClassification.mjs';
import { schoolDescriptions } from './schoolDescriptions.js';
import type { SchoolSlug } from '@/domain/school.js';

export const classifyRequest = async (question: string, candidateSchools: SchoolSlug[], client: OpenAI): Promise<PromptClassification> => {
  const onlyCandidateSchool = candidateSchools.length === 1 ? candidateSchools[0] : null;
  const body = createBody(question, candidateSchools);
  const response = await client.responses.create(body);

  if (response.error) {
    throw new Error(response.error.message);
  }

  const parsed = parseJson(response.output_text);
  const classification = onlyCandidateSchool && parsed !== null && typeof parsed === 'object'
    ? { ...parsed, onlyCandidateSchool }
    : parsed;

  if (!isPromptClassification(classification)) {
    throw new Error(`Classification response JSON had an unexpected shape`);
  }

  return classification;
};

const createBody = (question: string, candidateSchools: SchoolSlug[]): OpenAI.Responses.ResponseCreateParamsNonStreaming => {
  const onlyCandidateSchool = candidateSchools.length === 1 ? candidateSchools[0] : null;

  const schoolClassificationPrompt = onlyCandidateSchool ? '' : `
Choose exactly one school classification from the allowed schools:
${candidateSchools.map(school => `- ${schoolDescriptions[school]}`).join('\n')}
- unknown: the school is not clear from the message`;
  const schoolClassificationSchema = onlyCandidateSchool ? {} : {
    school: { type: 'string', enum: [ ...candidateSchools, 'unknown' ] },
  };

  const developerContent = `Classify the student's message for application routing.

Choose exactly one question classification:
- logistics: account, enrollment, grading timelines, submissions, support contacts, payments, portal navigation, school policy
- learning: course concepts, explanations, studying, tutoring, examples, practice
- assignment-help: help with assignments, drafts, outlines, brainstorming, graded work, quizzes, tests, exams

${schoolClassificationPrompt}`;

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      question: { type: 'string', enum: questionClassifications },
      ...schoolClassificationSchema,
    },
    required: onlyCandidateSchool ? [ 'question' ] : [ 'question', 'school' ],
  };

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
    text: { format: { name: 'prompt_classification', schema, strict: true, type: 'json_schema' } },
  };
};

const parseJson = (outputText: string): unknown => {
  try {
    return JSON.parse(outputText);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not parse classification response JSON: ${message}`);
  }
};
