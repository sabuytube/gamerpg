'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiService from '@/lib/api';

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    loadItem();
  }, []);

  const loadItem = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(`items/${params.id}`);

      if (data.success) {
        setFormData(data.item);
      } else {
        // handle error explicitly instead of throwing
        console.error('Failed to load item:', data.error || data);
        alert(data.error || 'ไม่สามารถโหลดข้อมูลไอเทมได้');
        router.push('/admin/items');
      }
    } catch (err) {
      console.error('Error loading item:', err);
      alert('ไม่สามารถโหลดข้อมูลไอเทมได้');
      router.push('/admin/items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = await apiService.patch(`items/${params.id}`, formData);

      if (data.success) {
        alert('บันทึกข้อมูลสำเร็จ!');
        router.push('/admin/items');
      } else {
        // handle error explicitly
        console.error('Update failed:', data.error || data);
        alert(data.error || 'อัพเดทข้อมูลไม่สำเร็จ');
      }
    } catch (err) {
      console.error('Error updating item:', err);
      alert(err.error || err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
    }
  };

  const updateStats = (field, value) => {
    setFormData({
      ...formData,
      stats: { ...formData.stats, [field]: parseInt(value) || 0 },
    });
  };

  const updatePrice = (field, value) => {
    setFormData({
      ...formData,
      price: { ...formData.price, [field]: parseInt(value) || 0 },
    });
  };

  const iconOptions = ['⚔️', '🗡️', '🏹', '🛡️', '🪖', '👑', '💍', '🧪', '📜', '💎', '🔮', '⚡'];

  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚔️</div>
          <p className="text-white text-xl">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">✏️ แก้ไขไอเทม</h1>
          <p className="text-gray-400">แก้ไขข้อมูลไอเทม: {formData.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">ข้อมูลพื้นฐาน</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ชื่อไอเทม (ไทย) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ชื่อไอเทม (English)
                </label>
                <input
                  type="text"
                  value={formData.nameEn || ''}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ไอคอน
                </label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {iconOptions.map((ico) => (
                    <button
                      key={ico}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: ico })}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        formData.icon === ico
                          ? 'bg-purple-600 scale-110'
                          : 'bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      {ico}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ประเภท *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="weapon">อาวุธ</option>
                  <option value="armor">เกราะ</option>
                  <option value="accessory">เครื่องประดับ</option>
                  <option value="consumable">ของใช้</option>
                  <option value="material">วัสดุ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ความหายาก *
                </label>
                <select
                  required
                  value={formData.rarity}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="common">ธรรมดา</option>
                  <option value="uncommon">ไม่ธรรมดา</option>
                  <option value="rare">หายาก</option>
                  <option value="epic">เอพิค</option>
                  <option value="legendary">ตำนาน</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">สถานะ (Stats)</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ⚔️ Attack
                </label>
                <input
                  type="number"
                  value={formData.stats?.attack || 0}
                  onChange={(e) => updateStats('attack', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🛡️ Defense
                </label>
                <input
                  type="number"
                  value={formData.stats?.defense || 0}
                  onChange={(e) => updateStats('defense', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ❤️ HP
                </label>
                <input
                  type="number"
                  value={formData.stats?.hp || 0}
                  onChange={(e) => updateStats('hp', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  💙 MP
                </label>
                <input
                  type="number"
                  value={formData.stats?.mp || 0}
                  onChange={(e) => updateStats('mp', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ⚡ Speed
                </label>
                <input
                  type="number"
                  value={formData.stats?.speed || 0}
                  onChange={(e) => updateStats('speed', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Price & Stack */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">ราคาและการเก็บ</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  💰 ราคาซื้อ
                </label>
                <input
                  type="number"
                  value={formData.price?.buy || 0}
                  onChange={(e) => updatePrice('buy', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  💸 ราคาขาย
                </label>
                <input
                  type="number"
                  value={formData.price?.sell || 0}
                  onChange={(e) => updatePrice('sell', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📦 จำนวนต่อช่อง
                </label>
                <input
                  type="number"
                  value={formData.maxStack || 1}
                  onChange={(e) => setFormData({ ...formData, maxStack: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.stackable || false}
                    onChange={(e) => setFormData({ ...formData, stackable: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span>ซ้อนได้</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/items')}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? 'กำลังบันทึก...' : '💾 บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
