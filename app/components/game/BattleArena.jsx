'use client';

import BattleLog from '@/components/game/BattleLog';
import CharacterSheet from '@/components/game/CharacterSheet';

export default function BattleArena({
  player,
  enemy,
  turn,
  skills,
  onSkill,
  log,
  onRetry,
  onExit,
  meta,
  hitState,
}) {
  if (!player || !enemy) return null;

  const { level, xp, xpToNext, dungeonName, roomIndex, totalRooms } = meta;

  return (
    <div className="mt-4 grid md:grid-cols-3 gap-4 items-start">
      <div className="md:col-span-2 p-4 rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`text-xs px-2 py-1 rounded-full ${
              turn === 'player' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            Turn: {turn}
          </div>
          <div className="text-xs text-gray-500">
            Lv.{level} | XP {xp}/{xpToNext} | {dungeonName} {roomIndex + 1}/{totalRooms}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CharacterSheet entity={player} side="left" isHit={hitState.player} />
          <CharacterSheet entity={enemy} side="right" isHit={hitState.enemy} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {skills.map((skill) => (
            <button
              key={skill.id}
              type="button"
              onClick={() => onSkill(skill)}
              disabled={turn !== 'player' || (skill.mp > 0 && player.mp < skill.mp)}
              className="px-3 py-2 rounded-xl border shadow-sm bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-left"
            >
              <div className="text-sm font-semibold">
                {skill.name} <span className="text-xs text-gray-500">(MP {skill.mp})</span>
              </div>
              <div className="text-xs text-gray-600">{skill.desc}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Tip: Guard to gain MP, then cast Fire Orb for burst. Equip better gear from loot!
        </div>
      </div>

      <BattleLog entries={log} onRetry={onRetry} onExit={onExit} />
    </div>
  );
}