'use client';

function StatBar({ label, value, max, color }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-2 ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function CharacterSheet({ entity, side, isHit }) {
  return (
    <div
      className={`p-4 rounded-2xl border shadow-sm bg-white flex flex-col gap-3 min-w-64 transition-transform duration-150 ${
        isHit ? 'animate-[hit_250ms_ease-in-out]' : ''
      }`}
    >
      <style jsx>{`
        @keyframes hit {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px);
          }
          50% {
            transform: translateX(6px);
          }
          75% {
            transform: translateX(-3px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold">{entity.name}</div>
          <div className="text-xs text-gray-500">
            Lv.{entity.lvl} | STR {entity.stats.STR} | DEX {entity.stats.DEX} | INT {entity.stats.INT} | VIT {entity.stats.VIT} | AGI {entity.stats.AGI} | LUK {entity.stats.LUK}
          </div>
        </div>
        <div className="text-xs text-gray-500">SPD {entity.derived.spd.toFixed(1)}</div>
      </div>
      <StatBar label="HP" value={entity.hp} max={entity.derived.maxHP} color="bg-red-500" />
      <StatBar label="MP" value={entity.mp} max={entity.derived.maxMP} color="bg-blue-500" />
      <div className="text-xs text-gray-500">
        ATK {Math.round(entity.derived.atk)} | CRIT {(entity.derived.crit * 100).toFixed(0)}% | EVA {(entity.derived.evade * 100).toFixed(0)}%
      </div>
      <div className="text-[10px] text-gray-400">{side === 'left' ? 'You' : 'Foe'}</div>
    </div>
  );
}