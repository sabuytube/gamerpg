'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

export default function MonstersPage() {
  const router = useRouter();
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', level: '' });

  useEffect(() => {
    loadMonsters();
  }, [filter]);

  const loadMonsters = async () => {
    try {
      setLoading(true);

      // Build query params properly
      const params = {};
      if (filter.type) params.type = filter.type;
      if (filter.level) params.level = filter.level;

      const data = await apiService.get('monsters', params);

      if (data.success) {
        setMonsters(data.monsters);
      }
    } catch (err) {
      console.error('Error loading monsters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบมอนสเตอร์นี้?')) return;

    try {
      const data = await apiService.delete(`monsters/${id}`);

      if (data.success) {
        alert('ลบมอนสเตอร์สำเร็จ!');
        loadMonsters();
      }
    } catch (err) {
      console.error('Error deleting monster:', err);
      alert('เกิดข้อผิดพลาดในการลบมอนสเตอร์');
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      normal: 'bg-gray-100 text-gray-800 border-gray-300',
      elite: 'bg-blue-100 text-blue-800 border-blue-300',
      boss: 'bg-purple-100 text-purple-800 border-purple-300',
      world_boss: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[type] || colors.normal;
  };

  const getTypeLabel = (type) => {
    const labels = {
      normal: 'ปกติ',
      elite: 'ยอดกู้',
      boss: 'บอส',
      world_boss: 'บอสโลก',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">👾</div>
          <p className="text-white text-xl">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">👾 Monster Database</h1>
          <p className="text-gray-400">จัดการข้อมูลมอนสเตอร์ทั้งหมดในเกม</p>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 flex-wrap">
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">ทุกประเภท</option>
                <option value="normal">ปกติ</option>
                <option value="elite">ยอดกู้</option>
                <option value="boss">บอส</option>
                <option value="world_boss">บอสโลก</option>
              </select>

              <input
                type="number"
                placeholder="Level"
                value={filter.level}
                onChange={(e) => setFilter({ ...filter, level: e.target.value })}
                className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                onClick={() => setFilter({ type: '', level: '' })}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-all"
              >
                🔄 รีเซ็ต
              </button>
            </div>

            <button
              onClick={() => router.push('/admin/monsters/create')}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold transition-all"
            >
              ➕ เพิ่มมอนสเตอร์
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">ทั้งหมด</div>
            <div className="text-3xl font-bold">{monsters.length}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">ยอดกู้</div>
            <div className="text-3xl font-bold">{monsters.filter(m => m.type === 'elite').length}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">บอส</div>
            <div className="text-3xl font-bold">{monsters.filter(m => m.type === 'boss').length}</div>
          </div>
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-4 text-white">
            <div className="text-sm opacity-80">บอสโลก</div>
            <div className="text-3xl font-bold">{monsters.filter(m => m.type === 'world_boss').length}</div>
          </div>
        </div>

        {/* Monster List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monsters.map((monster) => (
            <div
              key={monster._id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-500/50 transition-all hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{monster.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{monster.name}</h3>
                    <p className="text-sm text-gray-400">{monster.nameEn}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(monster.type)}`}>
                  {getTypeLabel(monster.type)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Level</span>
                  <span className="text-yellow-400 font-bold">{monster.level}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">❤️ HP</span>
                  <span className="text-red-400 font-semibold">{monster.stats.hp}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">⚔️ ATK</span>
                  <span className="text-orange-400 font-semibold">{monster.stats.attack}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">🛡️ DEF</span>
                  <span className="text-blue-400 font-semibold">{monster.stats.defense}</span>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-400 mb-2">รางวัล</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">EXP:</span>
                    <span className="text-yellow-300 ml-1">{monster.rewards.exp.min}-{monster.rewards.exp.max}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Gold:</span>
                    <span className="text-yellow-300 ml-1">{monster.rewards.gold.min}-{monster.rewards.gold.max}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">Drop Rate:</span>
                    <span className="text-green-300 ml-1">{(monster.rewards.dropRate * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/monsters/${monster._id}`)}
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all"
                >
                  📝 แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(monster._id)}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {monsters.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👾</div>
            <p className="text-gray-400 text-xl">ไม่พบข้อมูลมอนสเตอร์</p>
          </div>
        )}
      </div>
    </div>
  );
}
