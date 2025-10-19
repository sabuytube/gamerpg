'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

export default function CreateMonsterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    icon: '👾',
    description: '',
    type: 'normal',
    level: 1,
    stats: {
      hp: 100,
      attack: 10,
      defense: 5,
      speed: 5,
    },
    rewards: {
      exp: { min: 10, max: 20 },
      gold: { min: 5, max: 15 },
      dropRate: 0.3,
    },
    spawnInfo: {
      respawnTime: 60,
      location: 'dungeon',
      maxSpawn: 1,
    },
    skills: [],
    isActive: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiService.post('monsters', formData);

      if (data.success) {
        alert('สร้างมอนสเตอร์สำเร็จ!');
        router.push('/admin/monsters');
      } else {
        throw new Error(data.error || 'Create failed');
      }
    } catch (err) {
      console.error('Error creating monster:', err);
      alert(err.error || err.message || 'เกิดข้อผิดพลาดในการสร้างมอนสเตอร์');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (field, value) => {
    setFormData({
      ...formData,
      stats: { ...formData.stats, [field]: parseInt(value) || 0 },
    });
  };

  const updateRewards = (category, field, value) => {
    setFormData({
      ...formData,
      rewards: {
        ...formData.rewards,
        [category]: typeof formData.rewards[category] === 'object'
          ? { ...formData.rewards[category], [field]: parseFloat(value) || 0 }
          : parseFloat(value) || 0,
      },
    });
  };

  const updateSpawnInfo = (field, value) => {
    setFormData({
      ...formData,
      spawnInfo: {
        ...formData.spawnInfo,
        [field]: field === 'location' ? value : parseInt(value) || 0,
      },
    });
  };

  const iconOptions = ['👾', '🐉', '🦇', '🕷️', '🐺', '🦂', '🐍', '🦈', '🦖', '🧟', '💀', '👻', '🧛'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">➕ สร้างมอนสเตอร์ใหม่</h1>
          <p className="text-gray-400">กรอกข้อมูลมอนสเตอร์ที่ต้องการเพิ่มในเกม</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">ข้อมูลพื้นฐาน</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">ชื่อ (ไทย) *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="เช่น สไลม์"
                />
              </div>

              <div>
                <label className="block text-white mb-2">ชื่อ (English)</label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. Slime"
                />
              </div>

              <div>
                <label className="block text-white mb-2">ไอคอน *</label>
                <div className="flex gap-2 flex-wrap">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`text-3xl p-2 rounded-lg border-2 transition-all ${
                        formData.icon === icon
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">ประเภท *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="normal">ปกติ</option>
                  <option value="elite">ยอดกู้</option>
                  <option value="boss">บอส</option>
                  <option value="world_boss">บอสโลก</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-white mb-2">คำอธิบาย</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="คำอธิบายเกี่ยวกับมอนสเตอร์..."
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">สถิติ</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Level *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2">❤️ HP *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.stats.hp}
                  onChange={(e) => updateStats('hp', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2">⚔️ Attack *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.stats.attack}
                  onChange={(e) => updateStats('attack', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2">🛡️ Defense *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stats.defense}
                  onChange={(e) => updateStats('defense', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2">⚡ Speed *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.stats.speed}
                  onChange={(e) => updateStats('speed', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">รางวัล</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">EXP (Min) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.rewards.exp.min}
                  onChange={(e) => updateRewards('exp', 'min', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2">EXP (Max) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.rewards.exp.max}
                  onChange={(e) => updateRewards('exp', 'max', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2">💰 Gold (Min) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.rewards.gold.min}
                  onChange={(e) => updateRewards('gold', 'min', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2">💰 Gold (Max) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.rewards.gold.max}
                  onChange={(e) => updateRewards('gold', 'max', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2">🎁 Drop Rate (0-1) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.rewards.dropRate}
                  onChange={(e) => setFormData({ ...formData, rewards: { ...formData.rewards, dropRate: parseFloat(e.target.value) || 0 }})}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400 mt-1">0 = 0%, 0.5 = 50%, 1 = 100%</p>
              </div>
            </div>
          </div>

          {/* Spawn Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">ข้อมูลการเกิด</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white mb-2">⏱️ Respawn Time (วินาที)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.spawnInfo.respawnTime}
                  onChange={(e) => updateSpawnInfo('respawnTime', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2">📍 Location</label>
                <input
                  type="text"
                  value={formData.spawnInfo.location}
                  onChange={(e) => updateSpawnInfo('location', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g. dungeon, forest"
                />
              </div>

              <div>
                <label className="block text-white mb-2">🔢 Max Spawn</label>
                <input
                  type="number"
                  min="1"
                  value={formData.spawnInfo.maxSpawn}
                  onChange={(e) => updateSpawnInfo('maxSpawn', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/monsters')}
              className="flex-1 px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'กำลังสร้าง...' : '✨ สร้างมอนสเตอร์'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
