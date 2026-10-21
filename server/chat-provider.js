import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { ASSISTANT_INSTRUCTIONS } from './guide-context.js';

export function createAnswerStream({ messages, signal, env, modelOverride }) {
  const provider = createOpenAI({ apiKey: env.OPENAI_API_KEY });
  const result = streamText({
    model: modelOverride || provider.responses(env.CHAT_MODEL || 'gpt-6-luna'),
    instructions: ASSISTANT_INSTRUCTIONS,
    messages,
    maxOutputTokens: 600,
    maxRetries: 0,
    abortSignal: signal,
    reasoning: 'none',
    providerOptions: { openai: { store: false } },
    // Never log prompts, provider error bodies, authorization headers or keys.
    onError: () => console.error('guide_chat_provider_error')
  });
  return result.stream;
}
