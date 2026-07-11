"use client";

import { SceneImage } from "./SceneImage";
import { OliveBorder } from "./OliveBorder";

interface Choice {
  id: string;
  text: string;
}

interface Scenario {
  id: string;
  category: string;
  title: string;
  description: string;
  choices: Choice[];
}

const CATEGORY_LABELS: Record<string, string> = {
  political: "Political Intrigue",
  military: "Military Conflict",
  economic: "Economic",
  religious: "Religious",
  crisis: "Crisis",
};

interface ScenarioCardProps {
  scenario: Scenario;
  round: number;
  maxRounds: number;
  onChoice: (choiceId: string) => void;
  disabled: boolean;
}

export function ScenarioCard({
  scenario,
  round,
  maxRounds,
  onChoice,
  disabled,
}: ScenarioCardProps) {
  const label = CATEGORY_LABELS[scenario.category] || scenario.category;
  const isCrisis = scenario.category === "crisis";

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-heading uppercase tracking-widest text-[#c9a84c]">
          {label}
        </span>
        <span className="text-[9px] font-heading uppercase tracking-widest text-[#8a7e6a]">
          Round {round}/{maxRounds} — circa {1450 + (round - 1) * 10}
        </span>
      </div>

      <OliveBorder variant={isCrisis ? "crisis" : "default"}>
        <div className="parchment-card rounded-xl overflow-hidden">
          <SceneImage category={scenario.category} />
          <div className="p-5 -mt-6 relative">
            <h2 className="text-xl font-heading font-semibold text-[#e8dcc8] mb-3 tracking-wide">
              {scenario.title}
            </h2>
            <p className="text-[#d4c5a0] leading-relaxed text-[15px] font-body">
              {scenario.description}
            </p>
          </div>
        </div>
      </OliveBorder>

      <div className="space-y-2 pt-1">
        <div className="divider" />
        <p className="text-[9px] font-heading uppercase tracking-widest text-[#8a7e6a] pt-1">
          Choose your action
        </p>
        {scenario.choices.map((choice, i) => (
          <button
            key={choice.id}
            onClick={() => onChoice(choice.id)}
            disabled={disabled}
            className="w-full text-left px-4 py-3 rounded-lg parchment-card-light
              hover:border-[#c9a84c]/40 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              text-[15px] text-[#d4c5a0] font-body group cursor-pointer"
          >
            <span className="text-[#c9a84c] font-heading text-xs mr-2 group-hover:text-[#e8dcc8]">
              {String.fromCharCode(65 + i)}.
            </span>
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}
