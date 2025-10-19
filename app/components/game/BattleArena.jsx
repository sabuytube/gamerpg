'use client';

import BattleLog from '@/components/game/BattleLog';

export default function BattleArena({
  player,
  enemy,
  turn,
  skills,
  onSkill,
  log,
  onRetry,
  onExit,
  equipment,
  meta,
  hitState,
}) {
  if (!player || !enemy) return null;

  const { level, xp, xpToNext, dungeonName, roomIndex, totalRooms } = meta;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            ⚔️ Battle Arena
          </h1>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
              <span className="text-xs text-slate-400">Level</span>
              <span className="ml-2 text-sm font-bold text-white">{level}</span>
            </div>
            <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
              <span className="text-xs text-slate-400">XP</span>
              <span className="ml-2 text-sm font-bold text-emerald-400">{xp}/{xpToNext}</span>
            </div>
            <div className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg">
              <span className="text-xs text-slate-400">Location</span>
              <span className="ml-2 text-sm font-bold text-purple-400">{dungeonName} {roomIndex + 1}/{totalRooms}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Battle Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Battle Scene */}
            <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900/80 to-purple-900/40 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Turn Indicator */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className={`px-6 py-2 rounded-full border-2 font-bold text-sm shadow-lg ${
                  turn === 'player' 
                    ? 'bg-emerald-500/90 border-emerald-300 text-white' 
                    : turn === 'enemy'
                    ? 'bg-red-500/90 border-red-300 text-white'
                    : 'bg-slate-700/90 border-slate-500 text-slate-200'
                }`}>
                  {turn === 'player' ? '🎯 Your Turn!' : turn === 'enemy' ? '👾 Enemy Turn!' : '⚔️ Battle!'}
                </div>
              </div>

              {/* Battle Characters */}
              <div className="grid grid-cols-2 gap-8 p-8 pt-20 min-h-[400px]">
                {/* Player Side */}
                <div className="flex flex-col items-center justify-center">
                  <div className={`relative transition-all duration-300 ${
                    hitState.player ? 'animate-shake' : ''
                  }`}>
                    {/* Player Character Display */}
                    <div className="relative">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>

                      {/* Character Circle */}
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 border-4 border-white shadow-2xl flex items-center justify-center">
                        <span className="text-6xl md:text-7xl">⚔️</span>
                      </div>

                      {/* Level Badge */}
                      <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-3 border-white shadow-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-white">Lv.{player.lvl}</span>
                      </div>
                    </div>

                    {/* Player Name */}
                    <div className="mt-4 text-center">
                      <div className="text-lg md:text-xl font-bold text-emerald-300">{player.name}</div>
                      <div className="text-xs text-slate-400">Hero</div>
                    </div>

                    {/* Player Stats */}
                    <div className="mt-3 space-y-2 w-full max-w-xs">
                      {/* HP Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>❤️ HP</span>
                          <span>{player.hp} / {player.derived.maxHP}</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${(player.hp / player.derived.maxHP) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* MP Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>💧 MP</span>
                          <span>{player.mp} / {player.derived.maxMP}</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                            style={{ width: `${(player.mp / player.derived.maxMP) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enemy Side */}
                <div className="flex flex-col items-center justify-center">
                  <div className={`relative transition-all duration-300 ${
                    hitState.enemy ? 'animate-shake' : ''
                  }`}>
                    {/* Enemy Character Display */}
                    <div className="relative">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>

                      {/* Enemy Circle */}
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-red-500 to-purple-600 border-4 border-white shadow-2xl flex items-center justify-center">
                        <span className="text-6xl md:text-7xl">👹</span>
                      </div>

                      {/* Level Badge */}
                      <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-3 border-white shadow-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-white">Lv.{enemy.lvl}</span>
                      </div>
                    </div>

                    {/* Enemy Name */}
                    <div className="mt-4 text-center">
                      <div className="text-lg md:text-xl font-bold text-red-300">{enemy.name}</div>
                      <div className="text-xs text-slate-400">Enemy</div>
                    </div>

                    {/* Enemy Stats */}
                    <div className="mt-3 space-y-2 w-full max-w-xs">
                      {/* HP Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>❤️ HP</span>
                          <span>{enemy.hp} / {enemy.derived.maxHP}</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                            style={{ width: `${(enemy.hp / enemy.derived.maxHP) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* MP Bar */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>💧 MP</span>
                          <span>{enemy.mp} / {enemy.derived.maxMP}</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${(enemy.mp / enemy.derived.maxMP) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Battle Actions */}
              <div className="p-6 bg-slate-900/50 border-t border-purple-500/30">
                <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                  <span>✨</span>
                  <span>Skills & Actions</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skills.map((skill) => {
                    const canUse = turn === 'player' && !(skill.mp > 0 && player.mp < skill.mp);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => onSkill(skill)}
                        disabled={!canUse}
                        className={`group relative px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                          canUse
                            ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/50 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105'
                            : 'bg-slate-800/30 border-slate-700/50 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-white">{skill.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            skill.mp > player.mp 
                              ? 'bg-red-500/30 text-red-300' 
                              : 'bg-blue-500/30 text-blue-300'
                          }`}>
                            {skill.mp} MP
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2">{skill.desc}</p>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 text-xs text-center text-slate-400">
                  💡 Tip: Guard to recover MP, then unleash powerful skills!
                </div>
              </div>
            </div>

            {/* Equipment Display */}
            {equipment && (
              <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/80 to-indigo-900/40 backdrop-blur-sm shadow-xl overflow-hidden">
                <div className="p-4 bg-indigo-900/30 border-b border-indigo-500/30">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>⚔️</span>
                    <span>Equipment</span>
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Weapon */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                      <div className="relative bg-gradient-to-br from-red-900/40 to-orange-900/40 border-2 border-red-500/50 rounded-xl p-4 hover:border-red-400 transition-all">
                        <div className="text-3xl mb-2 text-center">🗡️</div>
                        <div className="text-xs text-slate-400 text-center mb-1">Weapon</div>
                        {equipment.weapon ? (
                          <>
                            <div className="text-sm font-bold text-white text-center">{equipment.weapon.name}</div>
                            <div className={`text-xs text-center mt-1 font-semibold ${
                              equipment.weapon.rarity === 'legendary' ? 'text-orange-400' :
                              equipment.weapon.rarity === 'epic' ? 'text-purple-400' :
                              equipment.weapon.rarity === 'rare' ? 'text-blue-400' :
                              'text-gray-400'
                            }`}>
                              ⭐ {equipment.weapon.rarity}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-slate-500 text-center">Empty</div>
                        )}
                      </div>
                    </div>

                    {/* Armor */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                      <div className="relative bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-2 border-blue-500/50 rounded-xl p-4 hover:border-blue-400 transition-all">
                        <div className="text-3xl mb-2 text-center">🛡️</div>
                        <div className="text-xs text-slate-400 text-center mb-1">Armor</div>
                        {equipment.armor ? (
                          <>
                            <div className="text-sm font-bold text-white text-center">{equipment.armor.name}</div>
                            <div className={`text-xs text-center mt-1 font-semibold ${
                              equipment.armor.rarity === 'legendary' ? 'text-orange-400' :
                              equipment.armor.rarity === 'epic' ? 'text-purple-400' :
                              equipment.armor.rarity === 'rare' ? 'text-blue-400' :
                              'text-gray-400'
                            }`}>
                              ⭐ {equipment.armor.rarity}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-slate-500 text-center">Empty</div>
                        )}
                      </div>
                    </div>

                    {/* Charm */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                      <div className="relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 rounded-xl p-4 hover:border-purple-400 transition-all">
                        <div className="text-3xl mb-2 text-center">✨</div>
                        <div className="text-xs text-slate-400 text-center mb-1">Charm</div>
                        {equipment.charm ? (
                          <>
                            <div className="text-sm font-bold text-white text-center">{equipment.charm.name}</div>
                            <div className={`text-xs text-center mt-1 font-semibold ${
                              equipment.charm.rarity === 'legendary' ? 'text-orange-400' :
                              equipment.charm.rarity === 'epic' ? 'text-purple-400' :
                              equipment.charm.rarity === 'rare' ? 'text-blue-400' :
                              'text-gray-400'
                            }`}>
                              ⭐ {equipment.charm.rarity}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-slate-500 text-center">Empty</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Battle Log Sidebar */}
          <div className="lg:col-span-1">
            <BattleLog entries={log} onRetry={onRetry} onExit={onExit} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}