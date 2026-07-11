# The Machiavelli

**Power. Treachery. Survival.**

A historical RPG set in Renaissance Italy (1450–1550). Play as one of 20 historical figures — from Lorenzo de' Medici to Machiavelli himself — and navigate 10 rounds of political intrigue, military conflict, and papal scheming. Every advantage is a liability. Every alliance is temporary.

## Quick start

```bash
cd app
npm install
```

Create `app/.env.local` with your Mistral API key:

```
MISTRAL_API_KEY=your_key_here
MISTRAL_MODEL=mistral-large-latest
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The game works without an API key — narration falls back to pre-written text. With the key, Mistral generates unique narration streamed in real-time via SSE.

## How to play

1. **Pick a character** — choose from 20 historical figures across 3 difficulty tiers, or let fate decide with "Random character"
2. **Read the scenario** — each round presents a historical event drawn from a pool of 100 scenarios
3. **Make your choice** — 3–4 options, none purely good. Every gain costs something
4. **Watch the narration** — AI-generated chronicle of what your choice caused
5. **Survive 10 rounds** — if any stat hits ≥90 (assassination) or ≤10 (exile), you die

## The 4 stats

| Stat | Too high (≥90) | Too low (≤10) |
|------|---------------|--------------|
| **Influence** | Perceived tyrant → coalition | Irrelevant → exiled |
| **Military Power** | Coalitions form against you | Invaded, defenseless |
| **Wealth** | Envied and poisoned | Bankrupt, abandoned |
| **Church Standing** | Threat to cardinals | Excommunicated |

## Project structure

```
The-Machiavelli/
├── app/                          # Next.js application
│   ├── src/
│   │   ├── app/                  # Pages and API routes
│   │   │   ├── page.tsx          # Main game UI
│   │   │   └── api/game/         # Game API endpoints
│   │   ├── components/           # React components
│   │   └── lib/                  # Game engine, narration, types
│   └── game-data/                # JSON game data
│       ├── characters.json       # 20 playable characters
│       ├── scenarios-political.json  # 30 political scenarios
│       ├── scenarios-military.json   # 20 military scenarios
│       ├── scenarios-economic.json   # 20 economic scenarios
│       ├── scenarios-religious.json  # 15 religious scenarios
│       ├── scenarios-crisis.json     # 15 crisis events
│       ├── awards.json           # 20 end-game awards
│       └── game-config.json      # Game rules and config
```

## Tech stack

- **Framework**: Next.js (App Router)
- **AI**: Mistral API (streamed via SSE)
- **Styling**: Tailwind CSS
- **Game engine**: Server-side TypeScript (stats, luck rolls, perks, death checks)
- **Data**: Static JSON (100 scenarios, 20 characters, 20 awards)
