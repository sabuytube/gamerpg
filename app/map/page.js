'use client';

import RPGMap from '@/components/RPGMap';

export default function MapRoute() {
  return (
    <main className="min-h-[100dvh] p-4 md:p-8 bg-slate-900 text-slate-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">World Map Prototype</h1>
        <p className="text-sm text-slate-300 mb-6">
          Navigate the overworld, encounter roaming monsters, and hand off to the battle system when you engage.
        </p>
        <div className="rounded-2xl border border-slate-700 bg-slate-950/60 shadow-xl p-4">
          <RPGMap />
        </div>
      </div>
    </main>
  );
}