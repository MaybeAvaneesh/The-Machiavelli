"use client";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md animate-modal-in"
      style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="flex items-start gap-3 rounded-md border border-[#6b5a30] bg-[#1a140c]/95 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur">
        <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#c9a84c]" />
        <p className="flex-1 text-sm leading-snug text-[#e8dcc8] font-body">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="-mr-1 px-1 text-lg leading-none text-[#8a7e6a] hover:text-[#e8dcc8] cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  );
}
