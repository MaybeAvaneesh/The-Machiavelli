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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative max-w-lg w-full animate-modal-in">
        <div className="parchment-card rounded-xl overflow-hidden">
          {/* Decorative header */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#c9a84c]/50 to-transparent" />

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#6b5a30]/40" />
              <span className="text-[9px] font-heading uppercase tracking-[0.2em] text-[#c9a84c]">
                {isStreaming ? "The Chronicler Writes" : "Chronicle"}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#6b5a30]/40" />
            </div>

            <p className="text-[#e8dcc8] leading-relaxed font-body text-lg text-center whitespace-pre-wrap min-h-[60px]">
              {narration}
              {isStreaming && (
                <span className="inline-block w-0.5 h-5 bg-[#c9a84c] animate-pulse ml-0.5 align-text-bottom" />
              )}
            </p>

            {!isStreaming && narration && (
              <>
                <div className="divider" />
                <button
                  onClick={onContinue}
                  className={`w-full py-3 rounded-lg font-heading text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                    isDead
                      ? "bg-[#2a0a0a] border border-[#8b2020]/50 text-[#8b2020] hover:bg-[#3a1010]"
                      : "parchment-card-light hover:border-[#c9a84c]/40 text-[#c9a84c]"
                  }`}
                >
                  {isDead ? "See Your Fate" : "Continue"}
                </button>
              </>
            )}
          </div>

          {/* Decorative footer */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}
