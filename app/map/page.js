'use client';

import RPGMap from '@/components/RPGMap';

export default function MapRoute() {
  return (
    <main className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="relative isolate overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-emerald-500/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="px-4 py-6 md:py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                🗺️ World Map
              </h1>
              <p className="text-sm md:text-base text-slate-300">
                สำรวจโลก พบมอนสเตอร์ และเริ่มการผจญภัย
              </p>
            </div>

            {/* Map Container */}
            <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/80 backdrop-blur-sm shadow-2xl overflow-hidden">
              <RPGMap />
            </div>

            {/* Instructions - Mobile Optimized */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-purple-500/20 bg-purple-900/20 backdrop-blur-sm p-4">
                <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                  <span>💻</span>
                  <span>Desktop Controls</span>
                </h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• ใช้ <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">WASD</kbd> หรือ <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Arrow Keys</kbd> เพื่อเดิน</li>
                  <li>• เดินชนมอนสเตอร์เพื่อเข้าสู่การต่อสู้</li>
                </ul>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-900/20 backdrop-blur-sm p-4">
                <h3 className="text-lg font-semibold text-emerald-300 mb-2 flex items-center gap-2">
                  <span>📱</span>
                  <span>Mobile Controls</span>
                </h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• ใช้ Joystick ที่มุมล่างขวาเพื่อเคลื่อนที่</li>
                  <li>• ลากไปในทิศทางที่ต้องการเดิน</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}