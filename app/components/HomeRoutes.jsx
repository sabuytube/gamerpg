'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import apiService from '@/lib/api';

export default function HomeRoutes() {
  const { data: session, status } = useSession();
  const [hasCharacter, setHasCharacter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      checkCharacter();
    } else {
      setLoading(false);
    }
  }, [status]);

  const checkCharacter = async () => {
    try {
      const data = await apiService.get('character');
      setHasCharacter(!!data?.character);
    } catch (err) {
      setHasCharacter(false);
    } finally {
      setLoading(false);
    }
  };

  const routes = [
    {
      href: '/character/create',
      title: '👤 สร้างตัวละคร',
      description: 'สร้างตัวละครใหม่และเลือกอาชีพจาก 3 อาชีพ: นักดาบ, นักธนู, นักเวทมนตร์',
      accent: 'bg-purple-500/10 text-purple-600 border-purple-200',
      show: !hasCharacter && status === 'authenticated',
    },
    {
      href: '/character/profile',
      title: '👤 โปรไฟล์ตัวละคร',
      description: 'ดูข้อมูล สถิติ และความคืบหน้าของตัวละครของคุณ',
      accent: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
      show: hasCharacter && status === 'authenticated',
    },
    {
      href: '/map',
      title: '🗺️ World Map',
      description: 'สำรวจโลก พบมอนสเตอร์จริงจาก Database และเริ่มการต่อสู้',
      accent: 'bg-sky-500/10 text-sky-600 border-sky-200',
      show: true,
    },
    {
      href: '/stats',
      title: '📊 Systems Overview',
      description: 'ดูข้อมูลระบบ Stats, Skills, Items และ Dungeons ทั้งหมด',
      accent: 'bg-amber-500/10 text-amber-600 border-amber-200',
      show: true,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
      {routes
        .filter(route => route.show)
        .map((route) => (
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
  );
}
