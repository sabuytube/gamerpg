'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

export default function ItemsPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', rarity: '' });

  useEffect(() => {
    loadItems();
  }, [filter]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.type) params.type = filter.type;
      if (filter.rarity) params.rarity = filter.rarity;

      const data = await apiService.get('items', params);

      if (data.success) {
        setItems(data.items);
      }
    } catch (err) {
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบไอเทมนี้?')) return;

    try {
      const data = await apiService.delete(`items/${id}`);

      if (data.success) {
        alert('ลบไอเทมสำเร็จ!');
        loadItems();
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('เกิดข้อผิดพลาดในการลบไอเทม');
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'bg-gray-100 text-gray-800 border-gray-300',
      uncommon: 'bg-green-100 text-green-800 border-green-300',
      rare: 'bg-blue-100 text-blue-800 border-blue-300',
      epic: 'bg-purple-100 text-purple-800 border-purple-300',
      legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };
    return colors[rarity] || colors.common;
  };

  const getRarityLabel = (rarity) => {
    const labels = {
      common: 'ธรรมดา',
      uncommon: 'ไม่ธรรมดา',
      rare: 'หายาก',
      epic: 'เอพิค',
      legendary: 'ตำนาน',
    };
    return labels[rarity] || rarity;
  };

  const getTypeLabel = (type) => {
    const labels = {
      weapon: 'อาวุธ',
      armor: 'เกราะ',
      accessory: 'เครื่องประดับ',
      consumable: 'ของใช้',
      material: 'วัสดุ',
    };
    return labels[type] || type;
  };

  if (loading) {
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⚔️ Item Database</h1>
          <p className="text-gray-400">จัดการข้อมูลไอเทมทั้งหมดในเกม</p>
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
                <option value="">ประเภททั้งหมด</option>
                <option value="weapon">อาวุธ</option>
                <option value="armor">เกราะ</option>
                <option value="accessory">เครื่องประดับ</option>
                <option value="consumable">ของใช้</option>
                <option value="material">วัสดุ</option>
              </select>

              <select
                value={filter.rarity}
                onChange={(e) => setFilter({ ...filter, rarity: e.target.value })}
                className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">ความหายากทั้งหมด</option>
                <option value="common">ธรรมดา</option>
                <option value="uncommon">ไม่ธรรมดา</option>
                <option value="rare">หายาก</option>
                <option value="epic">เอพิค</option>
                <option value="legendary">ตำนาน</option>
              </select>
            </div>

            <button
              onClick={() => router.push('/admin/items/create')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transition-all"
            >
              ➕ สร้างไอเทมใหม่
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{item.icon || '📦'}</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.nameEn}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRarityColor(item.rarity)}`}>
                    {getRarityLabel(item.rarity)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                    {getTypeLabel(item.type)}
                  </span>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-300">{item.description}</p>
                )}

                {item.stats && Object.keys(item.stats).length > 0 && (
                  <div className="text-xs text-gray-400">
                    {Object.entries(item.stats).map(([key, val]) => (
                      <div key={key}>
                        {key}: {val > 0 ? '+' : ''}{val}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/items/${item._id}`)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  ✏️ แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-400 text-xl">ไม่พบไอเทม</p>
          </div>
        )}
      </div>
    </div>
  );
}

