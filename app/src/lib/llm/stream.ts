import type { Provider } from "./providers";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamOptions {
  maxTokens: number;
  temperature?: number;
  /** Time allowed for the response to start (per attempt). */
  timeoutMs?: number;
  /** Total time budget for retries on 429/5xx. */
  retryBudgetMs?: number;
}

export class ProviderError extends Error {
  constructor(
    readonly provider: string,
    readonly status: number | null,
    message: string,
  ) {
    super(`${provider}: ${message}`);
    this.name = "ProviderError";
  }
}

const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Delay before retrying: honours Retry-After (seconds or HTTP date), else backoff. */
export function retryDelayMs(header: string | null, attempt: number): number {
  if (header) {
    const secs = Number(header);
    if (Number.isFinite(secs)) return Math.max(0, secs * 1000);
    const date = Date.parse(header);
    if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  }
  return Math.min(2500, 800 * 1.6 ** attempt);
}

async function open(
  provider: Provider,
  messages: ChatMessage[],
  opts: StreamOptions,
): Promise<Response> {
  const started = Date.now();
  const budget = opts.retryBudgetMs ?? 5000;
  for (let attempt = 0; ; attempt++) {
    let res: Response;
    try {
      res = await fetch(provider.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model,
          messages,
          stream: true,
          temperature: opts.temperature ?? 0.8,
          // Groq documents max_completion_tokens; Mistral uses max_tokens.
          ...(provider.id === "groq"
            ? { max_completion_tokens: opts.maxTokens }
            : { max_tokens: opts.maxTokens }),
          ...provider.extraBody,
        }),
        signal: AbortSignal.timeout(opts.timeoutMs ?? 10000),
      });
    } catch (err) {
      const reason = (err as Error).name === "TimeoutError" ? "timed out" : (err as Error).message;
      throw new ProviderError(provider.label, null, reason);
    }

    if (res.ok && res.body) return res;

    const body = (await res.text().catch(() => "")).slice(0, 300);
    const wait = retryDelayMs(res.headers.get("retry-after"), attempt);
    if (RETRYABLE.has(res.status) && Date.now() - started + wait <= budget) {
      await sleep(wait);
      continue;
    }
    throw new ProviderError(provider.label, res.status, `HTTP ${res.status} ${body}`);
  }
}

/** Streams the assistant's visible text. Reasoning and other fields are ignored. */
export async function* streamChat(
  provider: Provider,
  messages: ChatMessage[],
  opts: StreamOptions,
): AsyncGenerator<string> {
  const res = await open(provider, messages, opts);
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += value;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        let event: { choices?: { delta?: { content?: unknown } }[]; error?: { message?: string } };
        try {
          event = JSON.parse(data);
        } catch {
          continue;
        }
        if (event.error) throw new ProviderError(provider.label, null, event.error.message ?? "stream error");
        const text = contentText(event.choices?.[0]?.delta?.content);
        if (text) yield text;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/** Delta content may be a string or an array of typed chunks; keep only text. */
export function contentText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c) =>
        c && typeof c === "object" && (c as { type?: string }).type === "text"
          ? String((c as { text?: unknown }).text ?? "")
          : "",
      )
      .join("");
  }
  return "";
}
