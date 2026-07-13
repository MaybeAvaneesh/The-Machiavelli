import type {
  GameState,
  StatBlock,
  LuckRoll,
  Character,
  Scenario,
  Choice,
  Award,
  WorldState,
  WorldEffects,
  ChoiceEffects,
  DeferredConsequence,
  Precondition,
} from "./types";
import { RELATIONSHIP_ORDER } from "./types";
import { getCharacter, getRandomCharacter, selectScenariosForGame, getAwards } from "./game-data";
import gameConfig from "../../game-data/game-config.json";

type StatKey = "influence" | "militaryPower" | "wealth" | "churchStanding";
const STAT_KEYS: StatKey[] = ["influence", "militaryPower", "wealth", "churchStanding"];
const { ceiling, floor } = gameConfig.dangerZones;

export function rollLuck(): LuckRoll {
  const die1 = 1 + Math.floor(Math.random() * 6);
  const die2 = 1 + Math.floor(Math.random() * 6);
  const total = die1 + die2;

  const bands = gameConfig.luckEngine.bands;
  const band = bands.find((b) => total >= b.range[0] && total <= b.range[1])!;

  return {
    die1,
    die2,
    total,
    band: band.label as LuckRoll["band"],
    multiplier: band.statMultiplier,
  };
}

export function createGameState(characterId?: number): GameState {
  const character = characterId ? getCharacter(characterId) : getRandomCharacter();
  if (!character) throw new Error(`Character ${characterId} not found`);

  const scenarios = selectScenariosForGame();

  const perkUsesRemaining: Record<string, number> = {};
  if (character.perk.effect.type === "activateOnce") {
    perkUsesRemaining[character.perk.name] = 1;
  }
  if (character.perk.effect.type === "deathSave") {
    perkUsesRemaining[character.perk.name] = (character.perk.effect.uses as number) || 1;
  }
  if (character.perk.effect.type === "redirectNegative") {
    perkUsesRemaining[character.perk.name] = 99;
  }

  const state: GameState = {
    characterId: character.id,
    character,
    stats: { ...character.startingStats },
    round: 1,
    maxRounds: 10,
    alive: true,
    deathCause: null,
    scenarioHistory: [],
    statHistory: [{ ...character.startingStats }],
    crisisCount: 0,
    dangerZoneHistory: 0,
    perkUsesRemaining,
    currentScenario: scenarios[0],
    lastLuckRoll: null,
    awards: [],
    world: { relationships: {}, flags: {}, counters: {} },
    deferred: [],
    actionLog: [],
  };

  if (character.perk.effect.type === "roundOneBonus") {
    const bonus = character.perk.effect.bonus as number;
    for (const key of STAT_KEYS) {
      state.stats[key] += bonus;
    }
  }

  return { ...state, _scenarios: scenarios } as GameState & { _scenarios: Scenario[] };
}

export function applyChoice(
  state: GameState & { _scenarios?: Scenario[] },
  choiceId: string,
  luck: LuckRoll
): GameState & {
  _scenarios?: Scenario[];
  appliedChanges?: StatBlock;
  firedConsequences?: DeferredConsequence[];
} {
  if (!state.currentScenario || !state.alive) return state;

  const choice = state.currentScenario.choices.find((c) => c.id === choiceId);
  if (!choice) throw new Error(`Choice ${choiceId} not found`);

  const prevWorld = state.world ?? { relationships: {}, flags: {}, counters: {} };
  const newState = {
    ...state,
    stats: { ...state.stats },
    scenarioHistory: [...state.scenarioHistory],
    statHistory: [...state.statHistory],
    perkUsesRemaining: { ...state.perkUsesRemaining },
    world: {
      relationships: { ...prevWorld.relationships },
      flags: { ...prevWorld.flags },
      counters: { ...prevWorld.counters },
    },
    deferred: [...(state.deferred ?? [])],
    actionLog: [...(state.actionLog ?? [])],
    lastLuckRoll: luck,
  };

  const baseChanges = { ...choice.statChanges };
  const appliedChanges: StatBlock = { influence: 0, militaryPower: 0, wealth: 0, churchStanding: 0 };

  for (const key of STAT_KEYS) {
    let change = baseChanges[key];
    if (change === 0) continue;

    change = Math.round(change * luck.multiplier);
    change = applyPerkModifiers(newState, key, change, state.currentScenario.category);

    appliedChanges[key] = change;
    newState.stats[key] = clampStat(newState.stats[key] + change);
  }

  applyWorldEffects(newState.world, choice.effects);
  scheduleConsequences(newState, choice.effects, state.round);

  applyPerRoundEffects(newState);
  applyConditionalEffects(newState);

  if (state.currentScenario.category === "crisis") {
    newState.crisisCount++;
  }

  const dangerCount = STAT_KEYS.filter(
    (k) => newState.stats[k] <= 14 || newState.stats[k] >= 86
  ).length;
  if (dangerCount >= 2) {
    newState.dangerZoneHistory++;
  }

  newState.scenarioHistory.push(state.currentScenario.id);
  newState.actionLog.push({ round: state.round, choiceId, luck });
  newState.round++;

  const firedConsequences = fireDueConsequences(newState);

  checkDeathTriggers(newState);

  newState.statHistory.push({ ...newState.stats });

  if (newState.round <= newState.maxRounds && newState.alive && newState._scenarios) {
    const idx = newState.round - 1;
    newState.currentScenario = newState._scenarios[idx] || null;
  } else {
    newState.currentScenario = null;
    if (newState.alive) {
      newState.awards = calculateAwards(newState);
    }
  }

  return { ...newState, appliedChanges, firedConsequences };
}

function applyWorldEffects(world: WorldState, effects?: WorldEffects): void {
  if (!effects) return;
  if (effects.setFlags) {
    for (const [key, value] of Object.entries(effects.setFlags)) {
      world.flags[key] = value;
    }
  }
  if (effects.setRelationships) {
    for (const [key, value] of Object.entries(effects.setRelationships)) {
      world.relationships[key] = value;
    }
  }
  if (effects.adjustCounters) {
    for (const [key, delta] of Object.entries(effects.adjustCounters)) {
      world.counters[key] = (world.counters[key] ?? 0) + delta;
    }
  }
}

function scheduleConsequences(
  state: GameState,
  effects: ChoiceEffects | undefined,
  currentRound: number
): void {
  if (!effects?.schedule) return;
  for (const s of effects.schedule) {
    state.deferred.push({
      id: s.id,
      triggerRound: currentRound + s.inRounds,
      reason: s.reason,
      statChanges: s.statChanges,
      effects: s.effects,
    });
  }
}

function fireDueConsequences(state: GameState): DeferredConsequence[] {
  const due = state.deferred.filter((d) => d.triggerRound <= state.round);
  state.deferred = state.deferred.filter((d) => d.triggerRound > state.round);

  for (const c of due) {
    if (c.statChanges) {
      for (const key of STAT_KEYS) {
        const delta = c.statChanges[key];
        if (delta) state.stats[key] = clampStat(state.stats[key] + delta);
      }
    }
    applyWorldEffects(state.world, c.effects);
  }

  return due;
}

export function evaluatePrecondition(p: Precondition, state: GameState): boolean {
  const world = state.world ?? { relationships: {}, flags: {}, counters: {} };
  switch (p.type) {
    case "flag":
      return (world.flags[p.key] ?? false) === (p.equals ?? true);
    case "relationship": {
      const current = world.relationships[p.key] ?? "neutral";
      const idx = RELATIONSHIP_ORDER.indexOf(current);
      if (p.is && current !== p.is) return false;
      if (p.atLeast && idx < RELATIONSHIP_ORDER.indexOf(p.atLeast)) return false;
      if (p.atMost && idx > RELATIONSHIP_ORDER.indexOf(p.atMost)) return false;
      return true;
    }
    case "counter": {
      const v = world.counters[p.key] ?? 0;
      if (p.gte !== undefined && v < p.gte) return false;
      if (p.lte !== undefined && v > p.lte) return false;
      return true;
    }
    case "stat": {
      const v = state.stats[p.key];
      if (p.gte !== undefined && v < p.gte) return false;
      if (p.lte !== undefined && v > p.lte) return false;
      return true;
    }
    case "round": {
      if (p.gte !== undefined && state.round < p.gte) return false;
      if (p.lte !== undefined && state.round > p.lte) return false;
      return true;
    }
  }
}

export function isEligible(scenario: Scenario, state: GameState): boolean {
  if (!scenario.preconditions || scenario.preconditions.length === 0) return true;
  return scenario.preconditions.every((p) => evaluatePrecondition(p, state));
}

export function visibleChoices(scenario: Scenario, state: GameState): Choice[] {
  return scenario.choices.filter(
    (c) => !c.requires || c.requires.every((p) => evaluatePrecondition(p, state))
  );
}

function applyPerkModifiers(
  state: GameState,
  stat: StatKey,
  change: number,
  category: string
): number {
  const perk = state.character.perk.effect;
  const downside = state.character.downside.effect;

  if (perk.type === "statLossMultiplier" && perk.stat === stat && change < 0) {
    change = Math.round(change * (perk.multiplier as number));
  }
  if (perk.type === "scenarioCategoryMultiplier" && perk.category === category && perk.stat === stat && change > 0) {
    change = Math.round(change * (perk.multiplier as number));
  }
  if (perk.type === "scenarioCategoryBonus" && perk.category === category && perk.stat === stat) {
    change += perk.amount as number;
  }
  if (perk.type === "negateLuck" && perk.category === category && state.lastLuckRoll && state.lastLuckRoll.total <= 4) {
    if (change < 0) change = 0;
  }
  if (perk.type === "luckBonus" && state.lastLuckRoll && state.lastLuckRoll.total >= (perk.threshold as number)) {
    change += perk.bonus as number;
  }

  if (downside.type === "statGainMultiplier" && downside.stat === stat && change > 0) {
    change = Math.round(change * (downside.multiplier as number));
  }
  if (downside.type === "multiStatGainMultiplier") {
    const stats = downside.stats as string[];
    if (stats.includes(stat) && change > 0) {
      change = Math.round(change * (downside.multiplier as number));
    }
  }
  if (downside.type === "luckPenaltyMultiplier" && state.lastLuckRoll) {
    if (state.lastLuckRoll.total <= (downside.threshold as number) && change < 0) {
      change = Math.round(change * (downside.multiplier as number));
    }
  }
  if (downside.type === "crisisAndPenaltyAmplifier" && change < 0) {
    change -= downside.negativePenaltyIncrease as number;
  }

  if (perk.type === "statGainMultiplier" && perk.stat === stat && change > 0) {
    change = Math.round(change * (perk.multiplier as number));
  }

  if (downside.type === "gainCap" && change > 0) {
    change = Math.min(change, downside.maxGainPerRound as number);
  }
  if (downside.type === "statLocked" && stat === (downside.stat as string)) {
    return 0;
  }
  if (downside.type === "statCeiling" && stat === (downside.stat as string)) {
    const max = downside.maximum as number;
    if (state.stats[stat] + change > max) {
      change = max - state.stats[stat];
    }
  }
  if (downside.type === "crisisMultiplier" && state.currentScenario?.category === "crisis" && change < 0) {
    change = Math.round(change * (downside.multiplier as number));
  }

  return change;
}

function applyPerRoundEffects(state: GameState): void {
  const downside = state.character.downside.effect;

  if (downside.type === "perRoundDecay") {
    const stat = downside.stat as StatKey;
    state.stats[stat] = clampStat(state.stats[stat] + (downside.amount as number));
  }
  if (downside.type === "multiPerRoundDecay") {
    const stats = downside.stats as StatKey[];
    for (const stat of stats) {
      state.stats[stat] = clampStat(state.stats[stat] + (downside.amount as number));
    }
  }
}

function applyConditionalEffects(state: GameState): void {
  const downside = state.character.downside.effect;
  const perk = state.character.perk.effect;

  if (downside.type === "conditionalDecay") {
    const triggerStat = downside.triggerStat as StatKey;
    const threshold = downside.threshold as number;
    const direction = (downside.triggerDirection as string) || "below";
    const triggered = direction === "above"
      ? state.stats[triggerStat] > threshold
      : state.stats[triggerStat] < threshold;

    if (triggered) {
      if (downside.affectedStats) {
        for (const stat of downside.affectedStats as StatKey[]) {
          state.stats[stat] = clampStat(state.stats[stat] + (downside.decayAmount as number));
        }
      } else if (downside.decayStat) {
        const stat = downside.decayStat as StatKey;
        state.stats[stat] = clampStat(state.stats[stat] + (downside.decayAmount as number));
      }
    }
  }

  if (downside.type === "conditionalPenalty") {
    if (state.stats.influence > state.stats.churchStanding) {
      const penalty = downside.penalty as Record<string, number>;
      for (const [stat, amount] of Object.entries(penalty)) {
        state.stats[stat as StatKey] = clampStat(state.stats[stat as StatKey] + amount);
      }
    }
  }

  if (perk.type === "statSymbiosis") {
    const [stat1, stat2] = perk.stats as StatKey[];
    const bonus = perk.bonus as number;
    if (state.stats[stat1] > state.stats[stat2]) {
      state.stats[stat2] = clampStat(state.stats[stat2] + bonus);
    } else if (state.stats[stat2] > state.stats[stat1]) {
      state.stats[stat1] = clampStat(state.stats[stat1] + bonus);
    }
  }

  if (perk.type === "statFloor") {
    const stat = perk.stat as StatKey;
    const min = perk.minimum as number;
    if (state.stats[stat] < min) {
      state.stats[stat] = min;
    }
  }
}

function checkDeathTriggers(state: GameState): void {
  for (const key of STAT_KEYS) {
    if (state.stats[key] >= ceiling) {
      if (handleDeathSave(state)) return;
      state.alive = false;
      state.deathCause = `${key}_ceiling`;
      return;
    }
    if (state.stats[key] <= floor) {
      if (handleDeathSave(state)) return;
      state.alive = false;
      state.deathCause = `${key}_floor`;
      return;
    }
  }
}

function handleDeathSave(state: GameState): boolean {
  if (state.character.perk.effect.type === "deathSave") {
    const uses = state.perkUsesRemaining[state.character.perk.name] || 0;
    if (uses > 0) {
      state.perkUsesRemaining[state.character.perk.name] = uses - 1;
      for (const key of STAT_KEYS) {
        if (state.stats[key] >= ceiling) state.stats[key] = ceiling - 5;
        if (state.stats[key] <= floor) state.stats[key] = floor + 5;
      }
      return true;
    }
  }
  return false;
}

function calculateAwards(state: GameState): Award[] {
  const earned: Award[] = [];
  const allAwards = getAwards();
  const total = STAT_KEYS.reduce((sum, k) => sum + state.stats[k], 0);

  for (const award of allAwards) {
    const cond = award.condition;
    let met = false;

    switch (cond.type) {
      case "highestTotal":
        met = total >= (cond.threshold as number);
        break;
      case "statBelow":
        met = state.stats[cond.stat as StatKey] < (cond.threshold as number);
        break;
      case "statAbove":
        met = state.stats[cond.stat as StatKey] > (cond.threshold as number);
        break;
      case "multiStatAbove": {
        const stats = cond.stats as StatKey[];
        met = stats.every((s) => state.stats[s] > (cond.threshold as number));
        break;
      }
      case "survivedDangerZones":
        met = state.dangerZoneHistory >= (cond.minStatsInDanger as number);
        break;
      case "statSpread": {
        const values = STAT_KEYS.map((k) => state.stats[k]);
        met = Math.max(...values) - Math.min(...values) <= (cond.maxSpread as number);
        break;
      }
      case "highestAndLowest": {
        const sorted = [...STAT_KEYS].sort((a, b) => state.stats[b] - state.stats[a]);
        met = sorted[0] === cond.highest && sorted[3] === cond.lowest;
        break;
      }
      case "statContrast":
        met =
          state.stats[cond.lowStat as StatKey] < (cond.lowThreshold as number) &&
          state.stats[cond.highStat as StatKey] > (cond.highThreshold as number);
        break;
      case "survivedAllRounds":
        met = state.round > state.maxRounds && state.character.difficulty === (cond.difficulty as string);
        break;
      case "survivedAsCharacter":
        met = (cond.characterIds as number[]).includes(state.characterId);
        break;
      case "survivedCrises":
        met = state.crisisCount >= (cond.minCrises as number);
        break;
      case "allStatsBelow":
        met = STAT_KEYS.every((k) => state.stats[k] < (cond.threshold as number));
        break;
      case "statInWarningZone":
        met = STAT_KEYS.some((k) => state.stats[k] >= 11 && state.stats[k] <= 14);
        break;
    }

    if (met) earned.push(award);
  }

  return earned;
}

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}
