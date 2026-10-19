"use client";

interface NarrationPanelProps {
  narration: string;
  isStreaming: boolean;
  onContinue: () => void;
  isDead: boolean;
}

export function NarrationPanel({
  narration,
  isStreaming,
  onContinue,
  isDead,
}: NarrationPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative max-w-lg w-full animate-modal-in">
        <div className="scroll-bg rounded-lg overflow-hidden">
          {/* Top scroll roll */}
          <div className="h-3 bg-gradient-to-b from-[#4a3a20] to-[#2a2218]" />

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="h-0.5 flex-1 bg-[#4a3a20]" />
              <span className="text-[10px] font-heading uppercase tracking-[0.25em] text-[#c9a84c]"
                style={{ textShadow: "0 0 8px rgba(201,168,76,0.3)" }}>
                {isStreaming ? "The Chronicler Writes" : "Chronicle"}
              </span>
              <div className="h-0.5 flex-1 bg-[#4a3a20]" />
            </div>

            <p className="text-[#e8dcc8] leading-relaxed font-body text-lg text-center whitespace-pre-wrap min-h-[60px]">
              {narration}
              {isStreaming && (
                <span className="inline-block w-1 h-5 bg-[#c9a84c] animate-retro-blink ml-0.5 align-text-bottom" />
              )}
            </p>

            {!isStreaming && narration && (
              <>
                <div className="h-0.5 bg-[#4a3a20]" />
                <button
                  onClick={onContinue}
                  className={`w-full py-3 rounded font-heading text-sm tracking-wide cursor-pointer retro-btn ${
                    isDead
                      ? "!border-[#6b2020] text-[#cc4444]"
                      : "text-[#c9a84c]"
                  }`}
                >
                  {isDead ? "See Your Fate" : "Continue"}
                </button>
              </>
            )}
          </div>

          {/* Bottom scroll roll */}
          <div className="h-3 bg-gradient-to-t from-[#4a3a20] to-[#2a2218]" />
        </div>
      </div>
    </div>
  );
}
