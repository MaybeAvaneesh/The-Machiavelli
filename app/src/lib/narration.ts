import type { GameState, StatBlock, DeferredConsequence } from "./types";
import gameConfig from "../../game-data/game-config.json";
import { getProviders } from "./llm/providers";
import { ProviderError, streamChat, type ChatMessage } from "./llm/stream";

export interface NarrationFallback {
  /** Providers that failed before this one, e.g. ["Groq"]. */
  from: string[];
  /** Provider that ended up writing the chronicle. */
  to: string;
  /** Short, player-safe reason, e.g. "HTTP 429" or "timed out". */
  reason: string;
}

/** Short reason for the client; the full error stays in the server log. */
function shortReason(err: unknown): string {
  if (err instanceof ProviderError) return err.status ? `HTTP ${err.status}` : err.message.replace(/^[^:]+:\s*/, "");
  return "unexpected error";
}

const log = (msg: string) => console.log(`[narration] ${msg}`);

type StatKey = "influence" | "militaryPower" | "wealth" | "churchStanding";

const STAT_LABELS: Record<StatKey, string> = {
  influence: "Influence",
  militaryPower: "Military",
  wealth: "Wealth",
  churchStanding: "Church",
};

const MAX_NARRATION_CHARS = 320;
const DANGER_HIGH = 86;
const DANGER_LOW = 14;

// Static instructions go in the system message, so providers that cache
// prompt prefixes only bill the short, per-turn user message in full.
const SYSTEM_PROMPT = `You narrate "The Machiavelli", a Renaissance Italy RPG (1450-1550). Reply with 1-2 sentences, max 280 characters, second person, cynical Machiavellian wit, vivid real places. If a stat rose and another fell, show the gain and the cost together. A DELAYED line must land as the payoff of an earlier choice. Never mention stats, numbers, dice or game mechanics. No quotes or markdown.`;

async function* streamFallback(text: string): AsyncGenerator<string> {
  for (const word of text.split(" ")) {
    yield word + " ";
    await new Promise((r) => setTimeout(r, 30));
  }
}

/** First sentence only: the hint steers the model without paying for the whole line. */
function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](\s|$)/);
  return (match ? match[0] : text).trim();
}

export function buildNarrationMessages(
  state: GameState,
  choiceId: string,
  appliedChanges: StatBlock,
  firedConsequences: DeferredConsequence[] = []
): ChatMessage[] {
  const choice = state.currentScenario?.choices.find((c) => c.id === choiceId);

  // Only what changed or is in danger: that's what the narration should react to.
  const stats = (Object.keys(STAT_LABELS) as StatKey[])
    .map((k) => {
      const v = state.stats[k];
      const d = appliedChanges[k] ?? 0;
      const danger = v >= DANGER_HIGH ? " near-tyranny" : v <= DANGER_LOW ? " near-ruin" : "";
      if (!d && !danger) return null;
      return `${STAT_LABELS[k]} ${d > 0 ? "+" : ""}${d || "±0"}${danger}`;
    })
    .filter(Boolean)
    .join(", ");

  const relationships = Object.entries(state.world?.relationships ?? {})
    .map(([k, v]) => `${k}:${v}`)
    .join(", ");

  const lines = [
    `You: ${state.character.name}, ${state.character.title} (perk: ${state.character.perk.name}).`,
    `Chose: ${choice?.text ?? "unknown"}`,
    choice?.narration ? `Hint: ${firstSentence(choice.narration)}` : "",
    stats ? `Effects: ${stats}` : "",
    state.lastLuckRoll ? `Fortune: ${state.lastLuckRoll.band}` : "",
    relationships ? `Relations: ${relationships}` : "",
    ...firedConsequences.map((c) => `DELAYED: ${c.reason}`),
    state.alive
      ? ""
      : `FATE: ${state.deathCause?.includes("ceiling") ? "assassinated or overthrown" : "exiled or collapsed"}.`,
  ].filter(Boolean);

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: lines.join("\n") },
  ];
}

/**
 * Cleans a stream of model text: strips opening quotes/markdown, holds back
 * trailing ones until more text arrives, and caps total length.
 */
async function* clean(source: AsyncGenerator<string>, onText: (t: string) => void) {
  let emitted = "";
  let held = "";
  for await (const raw of source) {
    let text = raw;
    if (!emitted) text = text.replace(/^\s*["“*_]+/, "");
    text = held + text;
    const tail = text.match(/["”*_]+\s*$/);
    held = tail ? tail[0] : "";
    if (held) text = text.slice(0, -held.length);
    if (emitted.length + text.length > MAX_NARRATION_CHARS) {
      text = text.slice(0, Math.max(0, MAX_NARRATION_CHARS - emitted.length));
    }
    if (text) {
      emitted += text;
      onText(text);
      yield text;
    }
    if (emitted.length >= MAX_NARRATION_CHARS) break;
  }
}

export async function* streamNarration(
  state: GameState,
  choiceId: string,
  appliedChanges: StatBlock,
  firedConsequences: DeferredConsequence[] = [],
  onProviderFailure?: (reason: string) => void,
  onFallback?: (info: NarrationFallback) => void
): AsyncGenerator<string> {
  const choice = state.currentScenario?.choices.find((c) => c.id === choiceId);
  const fallback = choice?.narration || "The wheels of history turn onward.";

  const providers = getProviders();
  if (providers.length === 0) {
    log("no provider keys set, using the written line");
    yield* streamFallback(fallback);
    return;
  }

  const messages = buildNarrationMessages(state, choiceId, appliedChanges, firedConsequences);
  const failures: string[] = [];
  const failed: { label: string; reason: string }[] = [];

  // Try each provider in order. Move on only if one fails before producing text;
  // once words are on screen, keep them rather than restarting with another voice.
  for (const [i, provider] of providers.entries()) {
    const isLast = i === providers.length - 1;
    const started = Date.now();
    let emitted = "";
    let firstTokenMs: number | null = null;
    try {
      const source = streamChat(provider, messages, {
        maxTokens: provider.id === "groq" ? 400 : 120,
        temperature: 0.8,
        timeoutMs: 10000,
        // With a backup waiting, retry a rate limit once at most; the last provider gets longer.
        retryBudgetMs: isLast ? 4000 : 1500,
      });
      for await (const text of clean(source, (t) => {
        if (firstTokenMs === null) firstTokenMs = Date.now() - started;
        emitted += t;
      }))
        yield text;
      if (emitted.trim()) {
        log(
          `${provider.label} (${provider.model}) ok: first text ${firstTokenMs}ms, total ${Date.now() - started}ms, ${emitted.length} chars`,
        );
        if (failed.length) {
          log(`served by ${provider.label} after: ${failures.join(" | ")}`);
          onFallback?.({
            from: failed.map((f) => f.label),
            to: provider.label,
            reason: failed.map((f) => `${f.label} ${f.reason}`).join(", "),
          });
        }
        return;
      }
      failures.push(`${provider.label}: empty response`);
      failed.push({ label: provider.label, reason: "empty response" });
      log(`${provider.label} returned no text after ${Date.now() - started}ms, trying next`);
    } catch (err) {
      const message = (err as Error)?.message ?? String(err);
      if (emitted.trim()) {
        // Broke mid-sentence: keep what arrived, still tell the player.
        console.error(`[narration] ${provider.label} stream broke after ${Date.now() - started}ms:`, message);
        onProviderFailure?.(message);
        return;
      }
      failures.push(message);
      failed.push({ label: provider.label, reason: shortReason(err) });
      console.error(
        `[narration] ${provider.label} (${provider.model}) failed after ${Date.now() - started}ms${isLast ? "" : ", trying next"}: ${message}`,
      );
    }
  }

  // Every provider failed: use the written line.
  onProviderFailure?.(failures.join(" | "));
  yield* streamFallback(fallback);
}

export function getDeathNarration(state: GameState): string {
  if (!state.deathCause) return "";

  const [stat, type] = state.deathCause.split("_") as [string, string];
  const statConfig = gameConfig.stats[stat as keyof typeof gameConfig.stats];
  if (!statConfig) return "Your story ends here.";

  return type === "ceiling" ? statConfig.ceilingDeath : statConfig.floorExile;
}

export function getLegacyNarration(state: GameState): string {
  if (!state.alive) return "";

  const stats = state.stats;
  const highest = (Object.entries(stats) as [StatKey, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  const allBelow50 = Object.values(stats).every((v) => v < 50);
  const spread = Math.max(...Object.values(stats)) - Math.min(...Object.values(stats));

  if (allBelow50) return gameConfig.stats.influence.floorExile;
  if (spread <= 15) return "balanced";

  const narrationMap: Record<string, string> = {
    influence: "highInfluence",
    militaryPower: "highMilitary",
    wealth: "highWealth",
    churchStanding: "highChurch",
  };

  return narrationMap[highest] || "balanced";
}
