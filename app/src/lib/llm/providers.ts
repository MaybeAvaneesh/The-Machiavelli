/**
 * LLM providers for narration. Both speak the OpenAI-compatible
 * /chat/completions streaming API, so one client serves all of them.
 *
 * Order is set by NARRATION_PROVIDERS (default "groq,mistral"). A provider
 * without an API key is skipped, so the chain degrades gracefully.
 */

export type ProviderId = "groq" | "mistral";

export interface Provider {
  id: ProviderId;
  label: string;
  url: string;
  apiKey: string;
  model: string;
  /** Provider-specific request fields merged into the body. */
  extraBody: Record<string, unknown>;
}

interface ProviderSpec {
  label: string;
  keyEnv: string;
  modelEnv: string;
  baseUrlEnv: string;
  defaultBaseUrl: string;
  defaultModel: string;
  extraBody: (model: string) => Record<string, unknown>;
}

const SPECS: Record<ProviderId, ProviderSpec> = {
  groq: {
    label: "Groq",
    keyEnv: "GROQ_API_KEY",
    modelEnv: "GROQ_MODEL",
    baseUrlEnv: "GROQ_BASE_URL",
    defaultBaseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "openai/gpt-oss-120b",
    // gpt-oss models reason before answering: keep it short and out of the stream.
    extraBody: (model) =>
      model.startsWith("openai/gpt-oss")
        ? { reasoning_effort: "low", include_reasoning: false }
        : {},
  },
  mistral: {
    label: "Mistral",
    keyEnv: "MISTRAL_API_KEY",
    modelEnv: "MISTRAL_MODEL",
    baseUrlEnv: "MISTRAL_BASE_URL",
    defaultBaseUrl: "https://api.mistral.ai/v1",
    defaultModel: "mistral-small-latest",
    extraBody: () => ({}),
  },
};

/** Accepts "https://api.mistral.ai" or ".../v1" and returns the completions URL. */
export function completionsUrl(base: string): string {
  const trimmed = base.trim().replace(/\/+$/, "");
  return /\/v\d+$/.test(trimmed) ? `${trimmed}/chat/completions` : `${trimmed}/v1/chat/completions`;
}

export function getProviders(env: NodeJS.ProcessEnv = process.env): Provider[] {
  // Default: Groq first, Mistral as backup. A blank value also means the default.
  const order = (env.NARRATION_PROVIDERS?.trim() || "groq,mistral")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is ProviderId => s in SPECS);

  const seen = new Set<ProviderId>();
  const providers: Provider[] = [];
  for (const id of order) {
    if (seen.has(id)) continue;
    seen.add(id);
    const spec = SPECS[id];
    const apiKey = env[spec.keyEnv]?.trim();
    if (!apiKey) continue;
    const model = env[spec.modelEnv]?.trim() || spec.defaultModel;
    providers.push({
      id,
      label: spec.label,
      url: completionsUrl(env[spec.baseUrlEnv] || spec.defaultBaseUrl),
      apiKey,
      model,
      extraBody: spec.extraBody(model),
    });
  }
  return providers;
}
