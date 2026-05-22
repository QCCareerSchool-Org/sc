import type { GuardrailBundle, GuardrailResult } from '@openai/guardrails';
import { Category, PIIEntity } from '@openai/guardrails';
import { defaultSpecRegistry, runGuardrails } from '@openai/guardrails';
import type { OpenAI } from 'openai';

const guardrailNames = {
  nsfw: 'NSFW Text',
  hallucination: 'Hallucination Detection',
  jailbreak: 'Jailbreak',
  moderation: 'Moderation',
  pii: 'Contains PII',
  promptInjection: 'Prompt Injection Detection',
} as const;

export type GuardrailName = typeof guardrailNames[keyof typeof guardrailNames];

for (const value of Object.values(guardrailNames)) {
  if (!defaultSpecRegistry.has(value)) {
    throw new Error(`${value} guardrail is not registered`);
  }
}

const model = 'gpt-4.1-mini';

const piiEntities: PIIEntity[] = [
  PIIEntity.CREDIT_CARD,
  PIIEntity.US_BANK_NUMBER,
  PIIEntity.US_PASSPORT,
  PIIEntity.US_SSN,
];

const moderationCategories: Category[] = [
  Category.SEXUAL,
  // Category.SEXUAL_MINORS,
  Category.HATE,
  // Category.HATE_THREATENING,
  Category.HARASSMENT,
  // Category.HARASSMENT_THREATENING,
  // Category.SELF_HARM,
  Category.SELF_HARM_INSTRUCTIONS,
  // Category.SELF_HARM_INTENT,
  Category.VIOLENCE,
  // Category.VIOLENCE_GRAPHIC,
  Category.ILLICIT,
  // Category.ILLICIT_VIOLENT,
];

const guardrailConfig: GuardrailBundle = {
  guardrails: [
    // eslint-disable-next-line camelcase
    { name: guardrailNames.nsfw, config: { model, confidence_threshold: 0.7 } },
    // eslint-disable-next-line camelcase
    { name: guardrailNames.hallucination, config: { model, knowledge_source: 'vs_6a0f10bd9c60819181d27ab29297f270', confidence_threshold: 0.7 } },
    // eslint-disable-next-line camelcase
    { name: guardrailNames.jailbreak, config: { model, confidence_threshold: 0.7 } },
    { name: guardrailNames.moderation, config: { categories: moderationCategories } },
    // eslint-disable-next-line camelcase
    { name: guardrailNames.pii, config: { block: false, detect_encoded_pii: true, entities: piiEntities } },
    // eslint-disable-next-line camelcase
    { name: guardrailNames.promptInjection, config: { model, confidence_threshold: 0.7 } },
  ],
};

type GuardrailsResponse =
  | { triggered: false; guardrail: null; results: GuardrailResult[] }
  | { triggered: true; guardrail: GuardrailName; results: GuardrailResult[] };

export const runPreflightGuardrails = async (inputText: string, client: OpenAI): Promise<GuardrailsResponse> => {
  const context = { guardrailLlm: client };
  const results = await runGuardrails(inputText, guardrailConfig, context, true);

  const guardrail = getFirstTriggeredGuardrail(results);

  if (guardrail) {
    return { triggered: true, guardrail, results };
  }

  return { triggered: false, guardrail: null, results };
};

export const getFirstTriggeredGuardrail = (results: GuardrailResult[]): GuardrailName | null => {
  const firstTriggered = results.find(result => result.tripwireTriggered);

  if (!firstTriggered) {
    return null;
  }

  const guardrailName = firstTriggered.info.guardrail_name;

  return isGuardrailName(guardrailName) ? guardrailName : null;
};

const isGuardrailName = (value: unknown): value is GuardrailName => {
  return Object.values(guardrailNames).includes(value as GuardrailName);
};
