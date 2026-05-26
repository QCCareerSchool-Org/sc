import { OpenAI } from 'openai';
import type { Metadata } from 'openai/resources';

import { classifyRequest } from './classification.mjs';
import type { GuardrailName } from './guardrails.mjs';
import { maskPii, runPostflightGuardrails, runPreflightGuardrails } from './guardrails.mjs';
import { instructions } from './instructions.mjs';
import type { PromptClassification, QuestionClassification } from './promptClassification.mjs';
import type { StudentPayload } from './studentPayload.mjs';
import { createChatbotStudentPayload } from './studentPayloadSanitizer.mjs';
import { vectorStoreIds } from './vectorStores.js';
import type { SchoolSlug } from '@/domain/school.js';

export interface QCMetadata extends Metadata {
  studentId: string;
};

interface WorkflowOutput {
  status: 'blocked' | 'answered';
  answer: string;
  responseId: string | null;
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Runs the preflight checks, student's question, and postflight checks
 * @param question the student's question
 * @param payload an object representing student data
 * @param metadata metadata we want stored in the logs
 * @param previousResponseId the id of the previous response for continuity
 * @returns the chatbot's reponse
 */
export const run = async (question: string, payload: StudentPayload, metadata: QCMetadata, previousResponseId: string | null): Promise<WorkflowOutput> => {
  const candidateSchools = getCandidateSchools(payload);

  const maskedQuestion = await maskPii(question, client);

  const guardrailsPreflightResponse = await runPreflightGuardrails(question, candidateSchools, client);

  if (guardrailsPreflightResponse.triggered) {
    return { status: 'blocked', answer: getGuardrailFallbackAnswer(guardrailsPreflightResponse.guardrail), responseId: null };
  }

  const classification = await classifyRequest(maskedQuestion, candidateSchools, client);
  const body = createBody(maskedQuestion, payload, metadata, previousResponseId, classification);
  const response = await client.responses.create(body);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.output_text) {
    throw new Error('Response output is empty');
  }

  const guardrailsPostflightResponse = await runPostflightGuardrails(response.output_text, classification, client);

  if (guardrailsPostflightResponse.triggered) {
    return { status: 'blocked', answer: getGuardrailFallbackAnswer(guardrailsPostflightResponse.guardrail), responseId: null };
  }

  return { status: 'answered', answer: response.output_text, responseId: response.id };
};

const getCandidateSchools = (student: StudentPayload): SchoolSlug[] => {
  return [ ...new Set(student.enrollments.map(e => e.course.school.slug)) ];
};

const createBody = (question: string, student: StudentPayload, metadata: Metadata | null, previousResponseId: string | null, classification: PromptClassification): OpenAI.Responses.ResponseCreateParamsNonStreaming => ({
  input: createInput(question, student),
  metadata,
  instructions: createInstructions(classification),
  // eslint-disable-next-line camelcase
  max_output_tokens: 2048,
  model: 'gpt-4.1-mini',
  // eslint-disable-next-line camelcase
  previous_response_id: previousResponseId,
  store: true,
  temperature: 1,
  tools: [
    // eslint-disable-next-line camelcase
    { type: 'file_search', vector_store_ids: [ vectorStoreIds[classification.school] ] },
  ],
});

/**
 * Determines what predefined answer to give when a guardrail is triggered.
 *
 * For both preflight and postflight guardrails.
 * @param guardrailName the name of the guardrail that was triggered
 * @returns the static "answer"
 */
const getGuardrailFallbackAnswer = (guardrailName: GuardrailName): string => {
  switch (guardrailName) {
    case 'Contains PII':
      return `I can't process sensitive personal information here. Please remove private details like payment information, government IDs, or account credentials, and I can still help with the question.`;
    case 'Jailbreak':
      return `I can't help with requests that try to bypass system rules or change how this assistant is supposed to work. I can still help with your course, account, or school support question.`;
    case 'Moderation':
      return `Please rephrase the question or ask about your course, account, or school support needs.`;
    case 'Custom Prompt Check': // Acedmic Integrity
      return `I can't help you with that directly.`;
    case 'Hallucination Detection':
      return `I'm sorry, but I cannot provide a confident answer to that. Let's try rephrasing your question.`;
    case 'Off Topic Prompts':
    case 'NSFW Text':
    default:
      return `I can't help with that request as written. I can still help with your course, account, or school support question.`;
  }
};

const getQuestionClassificationInstructions = (classification: QuestionClassification) => {
  switch (classification) {
    case 'logistics':
      return `The current request is classified as logistics. Prioritize school policy, uploaded knowledge base files, and the developer-provided student context. Give a direct support answer.`;
    case 'learning':
      return `The current request is classified as learning. Prioritize tutoring, explanation, examples, and study guidance. Use a tutoring style: when the student seems stuck or asks for a full solution, ask a guiding question or suggest the next step. When the student answers a guiding question or asks for an explanation, continue from their response and provide the next useful explanation or step. Avoid turning the answer into account support unless the student asks for it.`;
    case 'assignment-help':
      return `The current request is classified as assignment-help. Provide tutoring-oriented help such as explanation, brainstorming, outlining, feedback, or practice. Ask guiding questions when they help the student make progress, but do not stall the conversation by asking a question every turn. Give examples and step-by-step guidance without writing, completing, or polishing graded work into a submission-ready form for the student.`;
  }
};

const createInstructions = (classification: PromptClassification): string => {
  return `${instructions}

# Current Request Classification
Question: ${classification.question}
School: ${classification.school}

${getQuestionClassificationInstructions(classification.question)}

Use the classified school as the relevant school context for interpreting retrieved course material and student enrollment data.

Use the attached vector stores as the available retrieval sources for this question. If the school is classified as "unknown", use general school policy and the student context to answer cautiously.

Use the supplied student payload object only as private reference material. Do not cite or include it directly in the final answer.
`;
};

const createInput = (question: string, student: StudentPayload): OpenAI.Responses.ResponseInput => ([
  {
    role: 'developer',
    content: JSON.stringify({
      type: 'private_student_context',
      visibility: 'internal_only',
      currentDate: new Date().toISOString().slice(0, 10),
      instruction: 'Use this data for reasoning only. Do not reveal internal identifiers or raw field values.',
      data: createChatbotStudentPayload(student),
    }, null, 2),
  },
  { role: 'user', content: question },
]);
