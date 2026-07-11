import { Mistral } from "@mistralai/mistralai";
import type { GameState, StatBlock } from "./types";
import gameConfig from "../../game-data/game-config.json";

type StatKey = "influence" | "militaryPower" | "wealth" | "churchStanding";

const STAT_LABELS: Record<StatKey, string> = {
  influence: "Influence",
  militaryPower: "Military Power",
  wealth: "Wealth",
  churchStanding: "Church Standing",
};

function getClient(): Mistral | null {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return null;
  return new Mistral({ apiKey: key });
}

function buildNarrationPrompt(
  state: GameState,
  choiceId: string,
  appliedChanges: StatBlock
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

  return `You are the narrator of "The Machiavelli," a historical RPG set in Renaissance Italy (1450-1550).

CHARACTER: ${state.character.name} — ${state.character.title}
${state.character.description}
Perk: ${state.character.perk.name} — ${state.character.perk.description}
Downside: ${state.character.downside.name} — ${state.character.downside.description}

CURRENT STATE (${scenario}):
${statSummary}
${luckDesc}

${state.alive ? "" : `DEATH/EXILE: The character has ${state.deathCause?.includes("ceiling") ? "been assassinated/overthrown (stat too high)" : "been exiled/collapsed (stat too low)"}.`}

The player chose: "${choice?.text || "unknown"}"
Base narration hint: "${choice?.narration || ""}"

Write a narration of what happens. STRICT RULES:
- MAXIMUM 280 CHARACTERS. This is a hard limit — count carefully
- Write in second person ("You...")
- Be historically vivid — reference real places and Renaissance dynamics
- Be Machiavellian in tone — cynical, pragmatic, dark wit
- Do NOT mention game mechanics, stat numbers, or dice rolls
- 1-2 sentences ONLY. Think of it as a dispatch from a Renaissance chronicler`;
}

export async function* streamNarration(
  state: GameState,
  choiceId: string,
  appliedChanges: StatBlock
): AsyncGenerator<string> {
  const client = getClient();

  if (!client) {
    const choice = state.currentScenario?.choices.find((c) => c.id === choiceId);
    const fallback = choice?.narration || "The wheels of history turn onward.";
    const words = fallback.split(" ");
    for (const word of words) {
      yield word + " ";
      await new Promise((r) => setTimeout(r, 30));
    }
    return;
  }

  const prompt = buildNarrationPrompt(state, choiceId, appliedChanges);

  const stream = await client.chat.stream({
    model: process.env.MISTRAL_MODEL || "mistral-large-latest",
    messages: [{ role: "user", content: prompt }],
    maxTokens: 120,
  });

  for await (const event of stream) {
    const delta = event.data?.choices?.[0]?.delta?.content;
    if (typeof delta === "string") {
      yield delta;
    }
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
