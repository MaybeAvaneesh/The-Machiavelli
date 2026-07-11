import { NextResponse } from "next/server";
import { getCharacters } from "@/lib/game-data";

export async function GET() {
  const characters = getCharacters();

  const safe = characters.map((c) => ({
    id: c.id,
    name: c.name,
    title: c.title,
    difficulty: c.difficulty,
    description: c.description,
    startingStats: c.startingStats,
    perk: { name: c.perk.name, description: c.perk.description },
    downside: { name: c.downside.name, description: c.downside.description },
  }));

  return NextResponse.json({ characters: safe });
}
