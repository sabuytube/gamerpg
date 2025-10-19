import { CHARMS, ARMORS, WEAPONS } from '@/lib/game/items';
import { DUNGEONS } from '@/lib/game/dungeon';
import { SKILLS } from '@/lib/game/skills';

const BASE_STATS = ['STR', 'DEX', 'INT', 'VIT', 'AGI', 'LUK'];

export const metadata = {
  title: 'GameRPG - Systems Overview',
  description: 'Break down of character stats, skills, gear, and dungeon flow.',
};

export default function StatsRoute() {
  return (
    <main className="min-h-[100dvh] bg-slate-50 text-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Systems Overview</h1>
          <p className="text-sm text-slate-600">
            Quick reference for core stats, combat actions, loot tables, and dungeon progression.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1 p-4 rounded-2xl border bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Base Attributes</h2>
            <ul className="space-y-1 text-sm text-slate-600">
              {BASE_STATS.map((stat) => (
                <li key={stat} className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{stat}</span>
                  <span className="text-xs">Primary growth axis</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 p-4 rounded-2xl border bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Combat Skills</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {SKILLS.map((skill) => (
                <div key={skill.id} className="p-3 rounded-xl border bg-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{skill.name}</span>
                    <span className="text-xs text-slate-500">MP {skill.mp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-4 rounded-2xl border bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Gear Pools</h2>
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Weapons</h3>
              <ul className="space-y-1">
                {WEAPONS.map((item) => (
                  <li key={item.id} className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="text-xs text-slate-500">[{item.rarity}]</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Armor</h3>
              <ul className="space-y-1">
                {ARMORS.map((item) => (
                  <li key={item.id} className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="text-xs text-slate-500">[{item.rarity}]</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Charms</h3>
              <ul className="space-y-1">
                {CHARMS.map((item) => (
                  <li key={item.id} className="flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="text-xs text-slate-500">[{item.rarity}]</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="p-4 rounded-2xl border bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Dungeon Flow</h2>
          <div className="space-y-3">
            {DUNGEONS.map((dungeon) => (
              <div key={dungeon.id} className="p-3 rounded-xl border bg-slate-50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{dungeon.name}</div>
                    <div className="text-xs text-slate-500">{dungeon.rooms.length} rooms</div>
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">{dungeon.id}</div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                  {dungeon.rooms.map((room, index) => (
                    <span
                      key={`${dungeon.id}-${index}`}
                      className={`px-2 py-1 rounded-lg border ${
                        room.boss ? 'border-amber-400 bg-amber-100/70 text-amber-700' : 'border-slate-200 bg-white'
                      }`}
                    >
                      Room {index + 1} - Lv.{room.lvl}
                      {room.boss ? ' - Boss' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
