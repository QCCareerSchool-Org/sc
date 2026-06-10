import type { OpenAI } from 'openai';

import type { PromptClassification } from './promptClassification.mjs';
import { isPromptClassification, questionClassifications } from './promptClassification.mjs';
import { schoolDescriptions } from './schoolDescriptions.js';
import type { SchoolSlug } from '@/domain/school.js';

type SchoolClassificationScope =
  | { type: 'known'; school: SchoolSlug }
  | { type: 'candidates'; schools: SchoolSlug[] };

export const classifyRequest = async (question: string, candidateSchools: SchoolSlug[], client: OpenAI): Promise<PromptClassification> => {
  const schoolScope = createSchoolClassificationScope(candidateSchools);
  const body = createBody(question, schoolScope);
  const response = await client.responses.create(body);

  if (response.error) {
    throw new Error(response.error.message);
  }

  const parsed = parseJson(response.output_text);
  const classification = schoolScope.type === 'known' && parsed !== null && typeof parsed === 'object'
    ? { ...parsed, school: schoolScope.school }
    : parsed;

  if (!isPromptClassification(classification)) {
    throw new Error(`Classification response JSON had an unexpected shape`);
  }

  return classification;
};

const createSchoolClassificationScope = (candidateSchools: SchoolSlug[]): SchoolClassificationScope => {
  return candidateSchools.length === 1
    ? { type: 'known', school: candidateSchools[0] }
    : { type: 'candidates', schools: candidateSchools };
};

const createBody = (question: string, schoolScope: SchoolClassificationScope): OpenAI.Responses.ResponseCreateParamsNonStreaming => {
  const schoolClassificationPrompt = schoolScope.type === 'known' ? '' : `
Choose exactly one school classification from the allowed schools:
${schoolScope.schools.map(school => `- ${schoolDescriptions[school]}`).join('\n')}
- unknown: the school is not clear from the message`;

  const schoolClassificationSchema = schoolScope.type === 'known' ? {} : {
    school: { type: 'string', enum: [ ...schoolScope.schools, 'unknown' ] },
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
    required: schoolScope.type === 'known' ? [ 'question' ] : [ 'question', 'school' ],
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
