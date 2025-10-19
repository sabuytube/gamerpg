'use client';

export default function BattleLog({ entries, onRetry, onExit }) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/80 to-emerald-900/40 backdrop-blur-sm shadow-xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-emerald-900/30 border-b border-emerald-500/30">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>📜</span>
          <span>Battle Log</span>
        </h3>
      </div>

      {/* Log Entries */}
      <div className="flex-1 p-4 overflow-auto space-y-2 max-h-[500px]">
        {entries.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-8">
            Waiting for battle to begin...
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="text-sm leading-relaxed text-slate-200 bg-slate-800/30 border border-slate-700/50 rounded-lg p-2 hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-emerald-400">▸</span> {entry.text}
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-slate-900/50 border-t border-emerald-500/30 space-y-2">
        <button
          type="button"
          onClick={onRetry}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          <span>Retry Room</span>
        </button>
        <button
          type="button"
          onClick={onExit}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-semibold transition-all hover:shadow-lg border border-slate-600 flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          <span>Exit Battle</span>
        </button>
      </div>
    </div>
  );
}