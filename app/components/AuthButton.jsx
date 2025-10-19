'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse"></div>
      </div>
    );
  }

  if (status === 'authenticated' && session?.user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-all"
        >
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name}
              className="w-8 h-8 rounded-full border-2 border-emerald-400/50"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white">
              {session.user.name?.[0] || session.user.email?.[0]}
            </div>
          )}
          <span className="text-sm font-medium text-slate-200 hidden md:block">
            {session.user.name || session.user.email}
          </span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${showMenu ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            ></div>
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-800 border border-slate-700 shadow-xl z-20 overflow-hidden">
              <div className="p-3 border-b border-slate-700">
                <p className="text-sm font-semibold text-white truncate">
                  {session.user.name || 'ผู้เล่น'}
                </p>
                <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
              </div>
              <div className="py-2">
                <Link
                  href="/character/profile"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <span>👤</span>
                  <span>โปรไฟล์</span>
                </Link>
                <Link
                  href="/character/create"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <span>✨</span>
                  <span>สร้างตัวละคร</span>
                </Link>
                <Link
                  href="/map"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <span>🗺️</span>
                  <span>สำรวจแผนที่</span>
                </Link>
                <Link
                  href="/admin/monsters"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <span>👾</span>
                  <span>จัดการมอนสเตอร์</span>
                </Link>
              </div>
              <div className="border-t border-slate-700 py-2">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors w-full"
                >
                  <span>🚪</span>
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/signin"
        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
      >
        เข้าสู่ระบบ
      </Link>
      <Link
        href="/auth/signup"
        className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-purple-500/50"
      >
        สมัครสมาชิก
      </Link>
    </div>
  );
}
