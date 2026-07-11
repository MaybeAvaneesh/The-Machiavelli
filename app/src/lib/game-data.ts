import type { Character, Scenario, Award } from "./types";
import characters from "../../game-data/characters.json";
import politicalScenarios from "../../game-data/scenarios-political.json";
import militaryScenarios from "../../game-data/scenarios-military.json";
import economicScenarios from "../../game-data/scenarios-economic.json";
import religiousScenarios from "../../game-data/scenarios-religious.json";
import crisisScenarios from "../../game-data/scenarios-crisis.json";
import awards from "../../game-data/awards.json";

export function getCharacters(): Character[] {
  return characters.characters as Character[];
}

export function getCharacter(id: number): Character | undefined {
  return getCharacters().find((c) => c.id === id);
}

export function getRandomCharacter(): Character {
  const chars = getCharacters();
  return chars[Math.floor(Math.random() * chars.length)];
}

export function getAllScenarios(): Scenario[] {
  return [
    ...(politicalScenarios as unknown as Scenario[]),
    ...(militaryScenarios as unknown as Scenario[]),
    ...(economicScenarios as unknown as Scenario[]),
    ...(religiousScenarios as unknown as Scenario[]),
    ...(crisisScenarios as unknown as Scenario[]),
  ];
}

export function getScenariosByCategory(
  category: Scenario["category"]
): Scenario[] {
  return getAllScenarios().filter((s) => s.category === category);
}

export function selectScenariosForGame(exclude: string[] = []): Scenario[] {
  const all = getAllScenarios().filter((s) => !exclude.includes(s.id));

  const crisis = getScenariosByCategory("crisis").filter(
    (s) => !exclude.includes(s.id)
  );
  const nonCrisis = all.filter((s) => s.category !== "crisis");

  const crisisCount = 1 + Math.floor(Math.random() * 3);

  const shuffledCrisis = crisis.sort(() => Math.random() - 0.5);
  const shuffledNonCrisis = nonCrisis.sort(() => Math.random() - 0.5);

  const selected = [
    ...shuffledCrisis.slice(0, crisisCount),
    ...shuffledNonCrisis.slice(0, 10 - crisisCount),
  ];

  return selected.sort(() => Math.random() - 0.5);
}

export function getAwards(): Award[] {
  return awards.awards as Award[];
}
