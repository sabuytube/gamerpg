'use client';

export default function BattleLog({ entries, onRetry, onExit }) {
  return (
    <div className="p-4 rounded-2xl border bg-white shadow-sm max-h-[60vh] overflow-auto">
      <div className="text-sm font-semibold mb-2">Battle Log</div>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={entry.id} className="text-sm leading-snug">
            - {entry.text}
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50"
        >
          Retry Room
        </button>
        <button
          type="button"
          onClick={onExit}
          className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50"
        >
          Exit Battle
        </button>
      </div>
    </div>
  );
}