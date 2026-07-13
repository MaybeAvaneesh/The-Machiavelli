import { NextRequest } from "next/server";
import { applyChoice, rollLuck, visibleChoices } from "@/lib/engine";
import { streamNarration, getDeathNarration } from "@/lib/narration";
import type { GameState, StatBlock, DeferredConsequence } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameState, choiceId } = body as {
      gameState: GameState;
      choiceId: string;
    };

    if (!gameState || !choiceId) {
      return new Response(
        JSON.stringify({ error: "Missing gameState or choiceId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const previousScenario = gameState.currentScenario;
    const luck = rollLuck();
    const result = applyChoice(gameState, choiceId, luck);
    const appliedChanges = (result as GameState & { appliedChanges?: StatBlock })
      .appliedChanges || { influence: 0, militaryPower: 0, wealth: 0, churchStanding: 0 };
    const firedConsequences =
      (result as GameState & { firedConsequences?: DeferredConsequence[] })
        .firedConsequences || [];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const stateUpdate = {
          type: "state_update",
          gameState: {
            characterId: result.characterId,
            character: result.character,
            stats: result.stats,
            round: result.round,
            maxRounds: result.maxRounds,
            alive: result.alive,
            deathCause: result.deathCause,
            currentScenario: result.currentScenario
              ? {
                  id: result.currentScenario.id,
                  category: result.currentScenario.category,
                  title: result.currentScenario.title,
                  description: result.currentScenario.description,
                  city: result.currentScenario.city,
                  choices: visibleChoices(result.currentScenario, result).map((c) => ({
                    id: c.id,
                    text: c.text,
                  })),
                }
              : null,
            awards: result.awards,
            perkUsesRemaining: result.perkUsesRemaining,
            lastLuckRoll: result.lastLuckRoll,
            crisisCount: result.crisisCount,
            scenarioHistory: result.scenarioHistory,
            statHistory: result.statHistory,
            world: result.world,
          },
          appliedChanges,
          firedConsequences,
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(stateUpdate)}\n\n`)
        );

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "internal", _internal: result })}\n\n`)
        );

        try {
          const narrationState = {
            ...result,
            currentScenario: previousScenario,
          } as GameState;

          for await (const chunk of streamNarration(
            narrationState,
            choiceId,
            appliedChanges,
            firedConsequences
          )) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "narration_chunk", text: chunk })}\n\n`
              )
            );
          }

          if (!result.alive) {
            const deathText = getDeathNarration(result);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "death", text: deathText })}\n\n`
              )
            );
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", error: (err as Error).message })}\n\n`
            )
          );
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
