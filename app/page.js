import Link from 'next/link';

const routes = [
  {
    href: '/character/create',
    title: '👤 สร้างตัวละคร',
    description: 'สร้างตัวละครใหม่และเลือกอาชีพจาก 3 อาชีพ: นักดาบ, นักธนู, นักเวทมนตร์',
    accent: 'bg-purple-500/10 text-purple-600 border-purple-200',
  },
  {
    href: '/game',
    title: '🎮 Play the RPG',
    description: 'Build your hero, dive into turn-based battles, and loot new gear as you clear each dungeon wing.',
    accent: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  },
  {
    href: '/map',
    title: '🗺️ Explore the World',
    description: 'Inspect the overworld prototype with movement, roaming monsters, and encounter triggers.',
    accent: 'bg-sky-500/10 text-sky-600 border-sky-200',
  },
  {
    href: '/battle',
    title: '⚔️ Battle Arena',
    description: 'Jump straight into epic turn-based battles and test your combat skills.',
    accent: 'bg-red-500/10 text-red-600 border-red-200',
  },
  {
    href: '/stats',
    title: '📊 Systems Overview',
    description: 'Review core stats, skills, loot tables, and dungeon pacing at a glance.',
    accent: 'bg-amber-500/10 text-amber-600 border-amber-200',
  },
];

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-slate-950 text-slate-100">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/10 via-sky-500/5 to-transparent" />
        <div className="px-4 py-16 md:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <header className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-300/80 mb-4">
                <span className="h-1 w-6 rounded-full bg-emerald-400" />
                Next.js RPG Prototype
                <span className="h-1 w-6 rounded-full bg-emerald-400" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-50 mb-4">
                GameRPG Playground
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-300 max-w-3xl mx-auto">
                A modular Next.js sandbox for experimenting with RPG mechanics. Jump into the full battle loop,
                roam the overworld map, or audit the underlying systems -- each module lives in its own dedicated route.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Link
                  href="/auth/signin"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  🔐 เข้าสู่ระบบ
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 border border-gray-300"
                >
                  ✨ สมัครสมาชิก
                </Link>
              </div>
            </header>

            {/* Features Grid */}
            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg transition hover:border-slate-700 hover:bg-slate-900 hover:scale-105"
                >
                  <div className={`mb-3 inline-flex rounded-lg border px-3 py-1 text-xs font-medium ${route.accent}`}>
                    {route.title}
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {route.description}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-medium text-slate-400 group-hover:text-emerald-400 transition">
                    Explore →
                  </div>
                </Link>
              ))}
            </section>

            {/* Features List */}
            <section className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
                <h3 className="text-xl font-bold text-slate-50 mb-4">🎯 Core Features</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400">✓</span>
                    <span>Turn-based combat system with skills & magic</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400">✓</span>
                    <span>Dynamic loot system with rarity tiers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400">✓</span>
                    <span>Character progression & leveling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400">✓</span>
                    <span>Equipment system with stat modifiers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400">✓</span>
                    <span>Multiple dungeons with boss battles</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
                <h3 className="text-xl font-bold text-slate-50 mb-4">🔐 Authentication</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-400">✓</span>
                    <span>Google OAuth Login</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-400">✓</span>
                    <span>Facebook OAuth Login</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-400">✓</span>
                    <span>LINE OAuth Login</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-400">✓</span>
                    <span>Email & Password Login</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400">✓</span>
                    <span>Secure password encryption</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Tech Stack */}
            <section className="text-center">
              <h3 className="text-lg font-semibold text-slate-400 mb-4">Built with Modern Technologies</h3>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
                <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700">Next.js 14</span>
                <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700">React 18</span>
                <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700">Tailwind CSS</span>
                <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700">NextAuth.js</span>
                <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700">Prisma ORM</span>
                <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700">SQLite</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
