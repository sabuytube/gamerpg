'use client';

import Link from 'next/link';
import {useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';
import HomeRoutes from '@/components/HomeRoutes';
import apiService from "@/lib/api";

export default function Home() {
    const {data: session, status} = useSession();
    const [stats, setStats] = useState({monsters: 0, players: 0});
    const [recentMonsters, setRecentMonsters] = useState([]);

    useEffect(() => {
        // Fetch game stats
        const getMonster = async () => {
            try {
                const data = await apiService.get('monsters');
                if (data.success) {
                    setStats(prev => ({...prev, monsters: data.monsters.length}));
                    setRecentMonsters(data.monsters.slice(0, 6));
                }
            } catch (error) {
                console.error('Error fetching monsters:', error);
            }
        }
        getMonster();

    }, []);

    return (
        <main className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
            <div className="relative isolate overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 -z-10">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-emerald-500/10 animate-pulse"/>
                    <div
                        className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"/>
                    <div
                        className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-700"/>
                </div>

                <div className="px-4 py-16 md:px-8">
                    <div className="max-w-6xl mx-auto">
                        {/* User Greeting Section - แสดงเมื่อล็อกอิน */}
                        {status === 'authenticated' && session?.user && (
                            <div
                                className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-blue-900/40 to-purple-900/40 border border-emerald-500/30 backdrop-blur-sm animate-fade-in">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        {session.user.image ? (
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name}
                                                className="w-16 h-16 rounded-full border-4 border-emerald-400/50"
                                            />
                                        ) : (
                                            <div
                                                className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-2xl font-bold text-white">
                                                {session.user.name?.[0] || session.user.email?.[0]}
                                            </div>
                                        )}
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">
                                                สวัสดี, {session.user.name || 'นักผจญภัย'}! 👋
                                            </h2>
                                            <p className="text-emerald-300">พร้อมเริ่มการผจญภัยแล้วหรือยัง?</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link
                                            href="/character/profile"
                                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
                                        >
                                            👤 โปรไฟล์
                                        </Link>
                                        <Link
                                            href="/map"
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all hover:scale-105"
                                        >
                                            🗺️ สำรวจแผนที่
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hero Section */}
                        <header className="mb-16 text-center">
                            <div
                                className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-300/80 mb-6 animate-fade-in">
                                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-purple-400 to-emerald-400"/>
                                Next.js RPG Adventure
                                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-purple-400"/>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
                <span
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
                  GameRPG
                </span>
                                <br/>
                                <span className="text-slate-100">Playground</span>
                            </h1>

                            <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                                ผจญภัยในโลกแฟนตาซี สร้างตัวละครของคุณ ต่อสู้กับมอนสเตอร์ และรวบรวมอุปกรณ์วิเศษ
                                <br/>
                                <span className="text-sm text-slate-400 mt-2 block">
                  A modular Next.js sandbox for experimenting with RPG mechanics
                </span>
                            </p>

                            {/* CTA Buttons - แสดงเมื่อยังไม่ได้ล็อกอิน */}
                            {status !== 'authenticated' && (
                                <div className="flex flex-wrap gap-4 justify-center mt-10 animate-fade-in-up delay-300">
                                    <Link
                                        href="/auth/signin"
                                        className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transform"
                                    >
                    <span className="flex items-center gap-2">
                      🔐 เข้าสู่ระบบ
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </span>
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="group px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform border-2 border-gray-200"
                                    >
                    <span className="flex items-center gap-2">
                      ✨ สมัครสมาชิก
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </span>
                                    </Link>
                                </div>
                            )}
                        </header>

                        {/* Game Stats */}
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            <div
                                className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-500/30 rounded-xl p-6 text-center backdrop-blur-sm">
                                <div className="text-4xl mb-2">👾</div>
                                <div className="text-3xl font-bold text-purple-300">{stats.monsters}</div>
                                <div className="text-sm text-purple-200">มอนสเตอร์</div>
                            </div>
                            <div
                                className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-500/30 rounded-xl p-6 text-center backdrop-blur-sm">
                                <div className="text-4xl mb-2">⚔️</div>
                                <div className="text-3xl font-bold text-blue-300">3</div>
                                <div className="text-sm text-blue-200">อาชีพ</div>
                            </div>
                            <div
                                className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border border-emerald-500/30 rounded-xl p-6 text-center backdrop-blur-sm">
                                <div className="text-4xl mb-2">🗺️</div>
                                <div className="text-3xl font-bold text-emerald-300">5</div>
                                <div className="text-sm text-emerald-200">พื้นที่</div>
                            </div>
                            <div
                                className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 border border-pink-500/30 rounded-xl p-6 text-center backdrop-blur-sm">
                                <div className="text-4xl mb-2">🎯</div>
                                <div className="text-3xl font-bold text-pink-300">∞</div>
                                <div className="text-sm text-pink-200">ภารกิจ</div>
                            </div>
                        </section>

                        {/* Recent Monsters */}
                        {recentMonsters.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span>👾</span>
                                    มอนสเตอร์ในเกม
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {recentMonsters.map((monster) => (
                                        <div
                                            key={monster._id}
                                            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-4 hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer backdrop-blur-sm"
                                        >
                                            <div className="text-4xl text-center mb-2">{monster.icon}</div>
                                            <div className="text-center">
                                                <div className="text-sm font-semibold text-white">{monster.name}</div>
                                                <div className="text-xs text-gray-400">Lv. {monster.level}</div>
                                                <div className={`text-xs mt-1 px-2 py-1 rounded-full inline-block ${
                                                    monster.type === 'world_boss' ? 'bg-red-500/20 text-red-300' :
                                                        monster.type === 'boss' ? 'bg-purple-500/20 text-purple-300' :
                                                            monster.type === 'elite' ? 'bg-blue-500/20 text-blue-300' :
                                                                'bg-green-500/20 text-green-300'
                                                }`}>
                                                    {monster.type}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Features Grid - Dynamic Routes */}
                        <HomeRoutes/>

                        {/* Features Showcase */}
                        <section className="grid md:grid-cols-3 gap-6 mb-16">
                            <div
                                className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/40 to-slate-900/60 p-8 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 hover:scale-105 transform">
                                <div className="text-5xl mb-4">⚔️</div>
                                <h3 className="text-2xl font-bold text-purple-300 mb-4">Combat System</h3>
                                <ul className="space-y-2 text-slate-300 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 mt-1">✓</span>
                                        <span>Turn-based battles</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 mt-1">✓</span>
                                        <span>Skills & magic system</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 mt-1">✓</span>
                                        <span>Boss battles</span>
                                    </li>
                                </ul>
                            </div>

                            <div
                                className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/40 to-slate-900/60 p-8 backdrop-blur-sm hover:border-emerald-500/40 transition-all duration-300 hover:scale-105 transform">
                                <div className="text-5xl mb-4">📊</div>
                                <h3 className="text-2xl font-bold text-emerald-300 mb-4">Character System</h3>
                                <ul className="space-y-2 text-slate-300 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 mt-1">✓</span>
                                        <span>3 unique classes</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 mt-1">✓</span>
                                        <span>Level progression</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 mt-1">✓</span>
                                        <span>Stats & equipment</span>
                                    </li>
                                </ul>
                            </div>

                            <div
                                className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-900/40 to-slate-900/60 p-8 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 hover:scale-105 transform">
                                <div className="text-5xl mb-4">🔐</div>
                                <h3 className="text-2xl font-bold text-blue-300 mb-4">Authentication</h3>
                                <ul className="space-y-2 text-slate-300 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 mt-1">✓</span>
                                        <span>Multiple OAuth providers</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 mt-1">✓</span>
                                        <span>Secure password system</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-emerald-400 mt-1">✓</span>
                                        <span>Session management</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Tech Stack */}
                        <section className="text-center mb-16">
                            <h3 className="text-lg font-semibold text-slate-300 mb-6">สร้างด้วยเทคโนโลยีสมัยใหม่</h3>
                            <div className="flex flex-wrap justify-center gap-3 text-xs">
                                <span
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-slate-300 hover:border-purple-500/50 transition-all">Next.js 14</span>
                                <span
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-slate-300 hover:border-blue-500/50 transition-all">React 18</span>
                                <span
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-slate-300 hover:border-emerald-500/50 transition-all">Tailwind CSS</span>
                                <span
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-slate-300 hover:border-purple-500/50 transition-all">NextAuth.js</span>
                                <span
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-slate-300 hover:border-green-500/50 transition-all">MongoDB</span>
                                <span
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-slate-300 hover:border-yellow-500/50 transition-all">Mongoose</span>
                            </div>
                        </section>

                        {/* Call to Action Footer */}
                        <section className="mt-20 text-center">
                            <div
                                className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-purple-900/30 p-12 backdrop-blur-sm">
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    {status === 'authenticated'
                                        ? 'สร้างตัวละครและเริ่มผจญภัยเลย!'
                                        : 'พร้อมเริ่มต้นการผจญภัยแล้วหรือยัง?'}
                                </h2>
                                <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                                    {status === 'authenticated'
                                        ? 'เลือกอาชีพที่ชื่นชอบ ปรับแต่งสถานะ และเริ่มต้นการผจญภัยในโลกแฟนตาซีแห่งนี้'
                                        : 'สร้างบัญชีเพื่อสร้างตัวละคร เลือกอาชีพที่ชื่นชอบ และเริ่มต้นการผจญภัยในโลกแฟนตาซีแห่งนี้'}
                                </p>
                                {status === 'authenticated' ? (
                                    <Link
                                        href="/character/create"
                                        className="inline-block px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transform"
                                    >
                                        🎮 สร้างตัวละคร
                                    </Link>
                                ) : (
                                    <Link
                                        href="/auth/signup"
                                        className="inline-block px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transform"
                                    >
                                        ✨ สมัครสมาชิกฟรี
                                    </Link>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
