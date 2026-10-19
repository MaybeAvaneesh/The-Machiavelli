import { NextResponse } from "next/server";
import { createGameState, visibleChoices } from "@/lib/engine";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const characterId = body.characterId as number | undefined;

    const state = createGameState(characterId);

    return NextResponse.json({
      success: true,
      gameState: {
        characterId: state.characterId,
        character: state.character,
        stats: state.stats,
        round: state.round,
        maxRounds: state.maxRounds,
        alive: state.alive,
        currentScenario: state.currentScenario
          ? {
              id: state.currentScenario.id,
              category: state.currentScenario.category,
              title: state.currentScenario.title,
              description: state.currentScenario.description,
              city: state.currentScenario.city,
              choices: visibleChoices(state.currentScenario, state).map((c) => ({
                id: c.id,
                text: c.text,
              })),
            }
          : null,
        perkUsesRemaining: state.perkUsesRemaining,
        world: state.world,
      },
      _internal: state,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
