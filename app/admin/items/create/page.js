'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

export default function CreateItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    icon: '📦',
    description: '',
    type: 'weapon',
    rarity: 'common',
    stats: { attack: 0, defense: 0, hp: 0, mp: 0, speed: 0 },
    price: { buy: 0, sell: 0 },
    stackable: false,
    maxStack: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiService.post('items', formData);
      if (data.success) {
        alert('สร้างไอเทมสำเร็จ');
        router.push('/admin/items');
      } else {
        alert(data.error || 'Create failed');
      }
    } catch (err) {
      console.error('Error creating item:', err);
      alert('เกิดข้อผิดพลาดในการสร้างไอเทม');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">➕ สร้างไอเทมใหม่</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">ชื่อ (ไทย)</label>
            <input value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} className="w-full p-2 rounded bg-white/10" required />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">ชื่อ (EN)</label>
            <input value={formData.nameEn} onChange={(e)=>setFormData({...formData,nameEn:e.target.value})} className="w-full p-2 rounded bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-300 mb-1">ประเภท</label>
              <select value={formData.type} onChange={(e)=>setFormData({...formData,type:e.target.value})} className="w-full p-2 rounded bg-white/10">
                <option value="weapon">อาวุธ</option>
                <option value="armor">เกราะ</option>
                <option value="accessory">เครื่องประดับ</option>
                <option value="consumable">ของใช้</option>
                <option value="material">วัสดุ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">ความหายาก</label>
              <select value={formData.rarity} onChange={(e)=>setFormData({...formData,rarity:e.target.value})} className="w-full p-2 rounded bg-white/10">
                <option value="common">ธรรมดา</option>
                <option value="uncommon">ไม่ธรรมดา</option>
                <option value="rare">หายาก</option>
                <option value="epic">เอพิค</option>
                <option value="legendary">ตำนาน</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">คำอธิบาย</label>
            <textarea value={formData.description} onChange={(e)=>setFormData({...formData,description:e.target.value})} className="w-full p-2 rounded bg-white/10" rows={3} />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={()=>router.push('/admin/items')} className="px-4 py-2 bg-gray-600 text-white rounded">ยกเลิก</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

