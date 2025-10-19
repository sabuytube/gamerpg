'use client';

export default function ItemCard({ item, actionLabel, onAction }) {
  return (
    <button
      type="button"
      onClick={onAction}
      className="w-full text-left p-2 border rounded-lg bg-slate-50 hover:bg-slate-100"
    >
      <div className="text-sm font-semibold">
        {item.name}
        <span className="text-[10px] ml-2 px-1 py-[1px] rounded bg-gray-200">{item.rarity}</span>
      </div>
      <div className="text-xs text-gray-600">
        [{item.slot}] {Object.entries(item.mods)
          .map(([key, value]) => `${key}+${value}`)
          .join(', ')}
      </div>
      {actionLabel ? <div className="text-[10px] text-emerald-700 mt-1">{actionLabel}</div> : null}
    </button>
  );
}