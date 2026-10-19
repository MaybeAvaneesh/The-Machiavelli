import { Mistral } from "@mistralai/mistralai";
import type { GameState, StatBlock, DeferredConsequence } from "./types";
import gameConfig from "../../game-data/game-config.json";

type StatKey = "influence" | "militaryPower" | "wealth" | "churchStanding";

const STAT_LABELS: Record<StatKey, string> = {
  influence: "Influence",
  militaryPower: "Military Power",
  wealth: "Wealth",
  churchStanding: "Church Standing",
};

const NARRATION_TIMEOUT_MS = 10000;
const MAX_NARRATION_CHARS = 320;

function getClient(): Mistral | null {
  const key = process.env.MISTRAL_API_KEY?.trim();
  if (!key) return null;
  return new Mistral({
    apiKey: key,
    timeoutMs: NARRATION_TIMEOUT_MS,
    // Free-tier keys hit 429s easily: retry briefly (honours Retry-After) before falling back.
    retryConfig: {
      strategy: "backoff",
      backoff: { initialInterval: 800, maxInterval: 2500, exponent: 1.6, maxElapsedTime: 5000 },
      retryConnectionErrors: true,
    },
    ...(process.env.MISTRAL_SERVER_URL ? { serverURL: process.env.MISTRAL_SERVER_URL } : {}),
  });
}

// Mistral deltas can be a plain string or an array of content chunks
// (text, thinking, references). Keep only the visible text.
function deltaText(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c) => (c && typeof c === "object" && (c as { type?: string }).type === "text"
        ? String((c as { text?: unknown }).text ?? "")
        : ""))
      .join("");
  }
  return "";
}

async function* streamFallback(text: string): AsyncGenerator<string> {
  for (const word of text.split(" ")) {
    yield word + " ";
    await new Promise((r) => setTimeout(r, 30));
  }
}

function buildNarrationPrompt(
  state: GameState,
  choiceId: string,
  appliedChanges: StatBlock,
  firedConsequences: DeferredConsequence[] = []
): string {
  const scenario = state.scenarioHistory.length > 0
    ? `Round ${state.round - 1} of ${state.maxRounds}`
    : `Round 1 of ${state.maxRounds}`;

  const choice = state.currentScenario
    ? state.currentScenario.choices.find((c) => c.id === choiceId)
    : null;

  const statSummary = Object.entries(state.stats)
    .map(([k, v]) => {
      const change = appliedChanges[k as StatKey];
      const arrow = change > 0 ? `+${change}` : change < 0 ? `${change}` : "—";
      const danger = v >= 86 ? " [DANGER: NEAR CEILING]" : v <= 14 ? " [DANGER: NEAR FLOOR]" : "";
      return `${STAT_LABELS[k as StatKey]}: ${v}${danger} (${arrow})`;
    })
    .join("\n");

  const luckDesc = state.lastLuckRoll
    ? `Luck roll: ${state.lastLuckRoll.total} (${state.lastLuckRoll.band})`
    : "";

  const relationships = Object.entries(state.world?.relationships ?? {});
  const relationshipLine = relationships.length
    ? `\nRELATIONSHIPS: ${relationships.map(([k, v]) => `${k} (${v})`).join(", ")}`
    : "";

  const firedLine = firedConsequences.length
    ? `\n\nDELAYED CONSEQUENCES NOW STRIKING (the fruit of a past choice — the narration MUST make this the payoff of something the player did earlier):\n${firedConsequences
        .map((c) => `- ${c.reason}`)
        .join("\n")}`
    : "";

  return `You are the narrator of "The Machiavelli," a historical RPG set in Renaissance Italy (1450-1550).

CHARACTER: ${state.character.name} — ${state.character.title}
${state.character.description}
Perk: ${state.character.perk.name} — ${state.character.perk.description}
Downside: ${state.character.downside.name} — ${state.character.downside.description}

CURRENT STATE (${scenario}):
${statSummary}
${luckDesc}${relationshipLine}${firedLine}

${state.alive ? "" : `DEATH/EXILE: The character has ${state.deathCause?.includes("ceiling") ? "been assassinated/overthrown (stat too high)" : "been exiled/collapsed (stat too low)"}.`}

The player chose: "${choice?.text || "unknown"}"
Base narration hint: "${choice?.narration || ""}"

Write a narration of what happens. STRICT RULES:
- MAXIMUM 280 CHARACTERS. This is a hard limit — count carefully
- Write in second person ("You...")
- If the choice raised some stats and lowered others, the narration MUST convey BOTH — the gain and the cost in the same breath (e.g. "your coffers swell, but the cardinals whisper of heresy")
- Be historically vivid — reference real places and Renaissance dynamics
- Be Machiavellian in tone — cynical, pragmatic, dark wit
- Do NOT mention game mechanics, stat numbers, or dice rolls
- 1-2 sentences ONLY. Think of it as a dispatch from a Renaissance chronicler`;
}

export async function* streamNarration(
  state: GameState,
  choiceId: string,
  appliedChanges: StatBlock,
  firedConsequences: DeferredConsequence[] = [],
  onProviderFailure?: (reason: string) => void
): AsyncGenerator<string> {
  const choice = state.currentScenario?.choices.find((c) => c.id === choiceId);
  const fallback = choice?.narration || "The wheels of history turn onward.";

  const client = getClient();
  if (!client) {
    yield* streamFallback(fallback);
    return;
  }

  const prompt = buildNarrationPrompt(state, choiceId, appliedChanges, firedConsequences);
  let emitted = "";
  let failure: string | null = null;
  let held = ""; // trailing quote/markdown, released only if more text follows

  try {
    const stream = await client.chat.stream({
      model: process.env.MISTRAL_MODEL?.trim() || "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
      maxTokens: 160,
      temperature: 0.8,
    });

    for await (const event of stream) {
      let text = deltaText(event.data?.choices?.[0]?.delta?.content);
      if (!text) continue;
      // Drop a leading quote or markdown the model sometimes opens with.
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
        yield text;
      }
      if (emitted.length >= MAX_NARRATION_CHARS) break;
    }
  } catch (err) {
    failure = (err as Error)?.message ?? String(err);
    console.error("[narration] Mistral request failed:", failure);
  }

  // Nothing usable came back (bad key, rate limit, timeout, empty reply): use the written line.
  if (!emitted.trim()) {
    onProviderFailure?.(failure ?? "empty response");
    yield* streamFallback(fallback);
  } else if (failure) {
    // Stream broke partway through: keep what arrived, still tell the player.
    onProviderFailure?.(failure);
  }
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
