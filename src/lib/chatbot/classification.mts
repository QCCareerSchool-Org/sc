import type { OpenAI } from 'openai';

import type { PromptClassification } from './promptClassification.mjs';
import { isPromptClassification, questionClassifications } from './promptClassification.mjs';
import { schoolDescriptions } from './schoolDescriptions.js';
import type { SchoolSlug } from '@/domain/school.js';

interface QuestionOnlyClassification {
  question: PromptClassification['question'];
}

const isQuestionOnlyClassification = (value: unknown): value is QuestionOnlyClassification => {
  return value !== null && typeof value === 'object'
    && 'question' in value && questionClassifications.includes(value.question as PromptClassification['question']);
};

export const classifyRequest = async (question: string, candidateSchools: SchoolSlug[], client: OpenAI): Promise<PromptClassification> => {
  const onlyCandidateSchool = candidateSchools.length === 1 ? candidateSchools[0] : null;
  const body = onlyCandidateSchool
    ? createQuestionClassificationBody(question)
    : createPromptClassificationBody(question, candidateSchools);
  const response = await client.responses.create(body);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (onlyCandidateSchool) {
    const classification = parseQuestionOutput(response.output_text);

    return { question: classification.question, school: onlyCandidateSchool };
  }

  return parsePromptClassificationOutput(response.output_text);
};

const createQuestionClassificationBody = (question: string): OpenAI.Responses.ResponseCreateParamsNonStreaming => {
  const developerContent = `Classify the student's message for application routing.

Choose exactly one question classification:
- logistics: account, enrollment, grading timelines, submissions, support contacts, payments, portal navigation, school policy
- learning: course concepts, explanations, studying, tutoring, examples, practice
- assignment-help: help with assignments, drafts, outlines, brainstorming, graded work, quizzes, tests, exams`;

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      question: { type: 'string', enum: questionClassifications },
    },
    required: [ 'question' ],
  };

  return createClassificationBody(question, developerContent, schema);
};

const createPromptClassificationBody = (question: string, candidateSchools: SchoolSlug[]): OpenAI.Responses.ResponseCreateParamsNonStreaming => {
  const developerContent = `Classify the student's message for application routing.

Choose exactly one question classification:
- logistics: account, enrollment, grading timelines, submissions, support contacts, payments, portal navigation, school policy
- learning: course concepts, explanations, studying, tutoring, examples, practice
- assignment-help: help with assignments, drafts, outlines, brainstorming, graded work, quizzes, tests, exams

Choose exactly one school classification from the allowed schools:
${candidateSchools.map(school => `- ${schoolDescriptions[school]}`).join('\n')}
- unknown: the school is not clear from the message`;

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      question: { type: 'string', enum: questionClassifications },
      school: { type: 'string', enum: [ ...candidateSchools, 'unknown' ] },
    },
    required: [ 'question', 'school' ],
  };

  return createClassificationBody(question, developerContent, schema);
};

const createClassificationBody = (
  question: string,
  developerContent: string,
  schema: Record<string, unknown>,
): OpenAI.Responses.ResponseCreateParamsNonStreaming => {
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

const parseQuestionOutput = (outputText: string): QuestionOnlyClassification => {
  const parsed = parseJsonOutput(outputText);

  if (!isQuestionOnlyClassification(parsed)) {
    throw new Error(`Question classification response JSON had an unexpected shape`);
  }

  return parsed;
};

const parsePromptClassificationOutput = (outputText: string): PromptClassification => {
  const parsed = parseJsonOutput(outputText);

  if (!isPromptClassification(parsed)) {
    throw new Error(`Classification response JSON had an unexpected shape`);
  }

  return parsed;
};

const parseJsonOutput = (outputText: string): unknown => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(outputText);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not parse classification response JSON: ${message}`);
  }

  return parsed;
};
