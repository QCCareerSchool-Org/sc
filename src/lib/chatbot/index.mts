import { OpenAI } from 'openai';
import type { Metadata } from 'openai/resources';

import type { BusinessPolicyViolation } from './businessPolicy.mjs';
import { classifyBusinessPolicy } from './businessPolicy.mjs';
import { classifyRequest } from './classification.mjs';
import type { GuardrailName } from './guardrails.mjs';
import { runPreflightGuardrails } from './guardrails.mjs';
import { instructions } from './instructions.mjs';
import type { RequestRoute } from './route.mjs';
import type { StudentPayload } from './studentPayload.mjs';
import type { SchoolSlug } from '@/domain/school.js';

export interface QCMetadata extends Metadata {
  studentId: string;
};

interface WorkflowOutput {
  status: 'blocked' | 'answered';
  answer: string;
  responseId: string | null;
}

interface VectorStores {
  general: string;
  assignments: Record<SchoolSlug, string>;
  lessons: Record<SchoolSlug, string>;
}

const vectorStores: VectorStores = {
  general: 'vs_6a0f10bd9c60819181d27ab29297f270',
  assignments: {
    'design': 'vs_',
    'event': 'vs_',
    'makeup': 'vs_',
    'pet': 'vs_',
    'wellness': 'vs_',
    'writing': 'vs_',
    'paw-parent': 'vs_',
  },
  lessons: {
    'design': 'vs_',
    'event': 'vs_',
    'makeup': 'vs_',
    'pet': 'vs_',
    'wellness': 'vs_',
    'writing': 'vs_',
    'paw-parent': 'vs_',
  },
} as const;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const run = async (question: string, payload: StudentPayload, metadata: QCMetadata, previousResponseId: string | null): Promise<WorkflowOutput> => {
  const businessPolicyViolation = await classifyBusinessPolicy(question, payload, client);

  if (businessPolicyViolation !== 'none') {
    return { status: 'blocked', answer: getBusinessPolicyFallbackAnswer(businessPolicyViolation), responseId: null };
  }

  const guardrails = await runPreflightGuardrails(question, client);

  if (guardrails.triggered) {
    return { status: 'blocked', answer: getGuardrailFallbackAnswer(guardrails.guardrail), responseId: null };
  }

  const route = await classifyRequest(question, payload, client);
  const body = createBody(question, payload, metadata, previousResponseId, route);
  const response = await client.responses.create(body);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.output_text) {
    throw new Error('Response output is empty');
  }

  previousResponseId = response.id;

  return { status: 'answered', answer: response.output_text, responseId: response.id };
};

const getBusinessPolicyFallbackAnswer = (violation: BusinessPolicyViolation): string => {
  switch (violation) {
    case 'submit-ready-academic-work':
      return `I can't write, complete, or polish work that could be submitted as your own. I can still help you understand the topic, make an outline, review your draft, or work through a practice example step by step.`;
    case 'off-domain-homework':
      return `I can only help with your QC course, student account, and school support questions. I can't help with outside homework like math, science, or unrelated school assignments.`;
    case 'none':
      throw new Error('No business policy fallback exists for an allowed request');
  }
};

const createBody = (
  question: string,
  student: StudentPayload,
  metadata: Metadata | null,
  previousResponseId: string | null,
  route: RequestRoute,
): OpenAI.Responses.ResponseCreateParamsNonStreaming => {
  const vectorStoreIds = getVectorStoreIds(route);

  return {
    input: createInput(question, student),
    metadata,
    instructions: createInstructions(route),
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
    case 'NSFW Text':
      return `I can't help with that request as written. I can still help with a safer question about your course, account, or school support needs.`;
    case 'Hallucination Detection':
      return `I don't have enough reliable information to answer that safely. Please rephrase the question or ask about your course, account, or school support needs.`;
    default:
      return `I can't help with that request as written. I can still help with your course, account, or school support question.`;
  }
};

const getVectorStoreIds = (route: RequestRoute): string[] => {
  const vectorStoreIds: string[] = [ vectorStores.general ];

  if (route.school === 'unknown') {
    if (route.question === 'learning') {
      vectorStoreIds.push(...Object.values(vectorStores.lessons));
    }

    if (route.question === 'assignment-help') {
      vectorStoreIds.push(...Object.values(vectorStores.assignments), ...Object.values(vectorStores.lessons));
    }
  } else {
    if (route.question === 'learning') {
      vectorStoreIds.push(vectorStores.lessons[route.school]);
    }

    if (route.question === 'assignment-help') {
      vectorStoreIds.push(vectorStores.assignments[route.school], vectorStores.lessons[route.school]);
    }
  }

  return vectorStoreIds;
};

const createInstructions = (route: RequestRoute): string => {
  let classificationInstructions: string;

  switch (route.question) {
    case 'logistics':
      classificationInstructions = `The current request is classified as logistics. Prioritize school policy, uploaded knowledge base files, and the developer-provided student context. Give a direct support answer.`;
      break;
    case 'learning':
      classificationInstructions = `The current request is classified as learning. Prioritize tutoring, explanation, examples, and study guidance. Use a tutoring style: when the student seems stuck or asks for a full solution, ask a guiding question or suggest the next step. When the student answers a guiding question or asks for an explanation, continue from their response and provide the next useful explanation or step. Avoid turning the answer into account support unless the student asks for it.`;
      break;
    case 'assignment-help':
      classificationInstructions = `The current request is classified as assignment-help. Provide tutoring-oriented help such as explanation, brainstorming, outlining, feedback, or practice. Ask guiding questions when they help the student make progress, but do not stall the conversation by asking a question every turn. Give examples and step-by-step guidance without writing, completing, or polishing graded work into a submission-ready form for the student.`;
      break;
  }

  return `${instructions}

# Current Request Route
Question: ${route.question}
School: ${route.school}

${classificationInstructions}

Use the route school as the relevant school context for interpreting retrieved course material and student enrollment data.

Use the attached vector stores as the available retrieval sources for this route. If the route school is unknown, use general school policy and the student context to answer cautiously.
`;
};

const createInput = (question: string, student: StudentPayload): OpenAI.Responses.ResponseInput => ([
  {
    role: 'developer',
    content: JSON.stringify({
      type: 'private_student_context',
      visibility: 'internal_only',
      instruction: 'Use this data for reasoning only. Do not reveal internal identifiers or raw field values.',
      data: student,
    }, null, 2),
  },
  { role: 'user', content: question },
]);
