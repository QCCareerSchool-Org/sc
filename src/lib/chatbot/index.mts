import { OpenAI } from 'openai';
import type { Metadata } from 'openai/resources';

// import type { BusinessPolicyViolation } from './businessPolicy.mjs';
// import { classifyBusinessPolicy } from './businessPolicy.mjs';
import { classifyRequest } from './classification.mjs';
import type { GuardrailName } from './guardrails.mjs';
import { runPostflightGuardrails, runPreflightGuardrails } from './guardrails.mjs';
import { instructions } from './instructions.mjs';
import type { PromptClassification, QuestionClassification } from './promptClassification.mjs';
import type { StudentPayload } from './studentPayload.mjs';
import { createChatbotStudentPayload } from './studentPayloadSanitizer.mjs';
import { getVectorStoreIds } from './vectorStores.js';
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

export const run = async (question: string, payload: StudentPayload, metadata: QCMetadata, previousResponseId: string | null): Promise<WorkflowOutput> => {
  const candidateSchools = getCandidateSchools(payload);

  const guardrailsPreflightResponse = await runPreflightGuardrails(question, candidateSchools, client);

  if (guardrailsPreflightResponse.triggered) {
    return { status: 'blocked', answer: getGuardrailFallbackAnswer(guardrailsPreflightResponse.guardrail), responseId: null };
  }

  const classification = await classifyRequest(question, candidateSchools, client);
  const body = createBody(question, payload, metadata, previousResponseId, classification);
  const response = await client.responses.create(body);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.output_text) {
    throw new Error('Response output is empty');
  }

  const guardrailsPostflightResponse = await runPostflightGuardrails(response.output_text, classification, client);

  if (guardrailsPostflightResponse.triggered) {
    return { status: 'blocked', answer: '', responseId: null };
  }

  previousResponseId = response.id;

  return { status: 'answered', answer: response.output_text, responseId: response.id };
};

// const getBusinessPolicyFallbackAnswer = (violation: BusinessPolicyViolation): string => {
//   switch (violation) {
//     case 'submit-ready-academic-work':
//       return `I can't write, complete, or polish work that could be submitted as your own. I can still help you understand the topic, make an outline, review your draft, or work through a practice example step by step.`;
//     case 'off-domain-homework':
//       return `I can only help with your QC course, student account, and school support questions. I can't help with outside homework like math, science, or unrelated school assignments.`;
//     case 'none':
//       throw new Error('No business policy fallback exists for an allowed request');
//   }
// };

const getCandidateSchools = (student: StudentPayload): SchoolSlug[] => {
  return [ ...new Set(student.enrollments.map(e => e.course.school.slug)) ];
};

const createBody = (
  question: string,
  student: StudentPayload,
  metadata: Metadata | null,
  previousResponseId: string | null,
  classification: PromptClassification,
): OpenAI.Responses.ResponseCreateParamsNonStreaming => {
  const vectorStoreIds = getVectorStoreIds(classification);

  return {
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
      { type: 'file_search', vector_store_ids: vectorStoreIds },
    ],
  };
};

const getGuardrailFallbackAnswer = (guardrailName: GuardrailName): string => {
  switch (guardrailName) {
    case 'Contains PII':
      return `I can't process sensitive personal information here. Please remove private details like payment information, government IDs, or account credentials, and I can still help with the question.`;
    case 'Prompt Injection Detection':
    case 'Jailbreak':
      return `I can't help with requests that try to bypass system rules or change how this assistant is supposed to work. I can still help with your course, account, or school support question.`;
    case 'Moderation':
      return `I don't have enough reliable information to answer that safely. Please rephrase the question or ask about your course, account, or school support needs.`;
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

Use retrieved files only as private reference material. Do not cite, quote source labels, show file names, or include bracketed retrieval markers in the final answer.
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
