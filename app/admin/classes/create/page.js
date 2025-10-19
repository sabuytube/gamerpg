'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

export default function CreateClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '🎭',
    description: '',
    baseStats: { hp: 100, mp: 50, attack: 10, defense: 5, speed: 5 },
    growthRates: { hp: 10, mp: 5, attack: 2, defense: 1, speed: 1 },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiService.post('classes', formData);
      if (data.success) {
        alert('สร้างคลาสสำเร็จ');
        router.push('/admin/classes');
      } else {
        alert(data.error || 'Create failed');
      }
    } catch (err) {
      console.error('Error creating class:', err);
      alert('เกิดข้อผิดพลาดในการสร้างคลาส');
    } finally {
      setLoading(false);
    }
  };

  const updateBase = (k, v) => setFormData({ ...formData, baseStats: { ...formData.baseStats, [k]: parseInt(v) || 0 } });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">➕ สร้างคลาสใหม่</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Class ID</label>
            <input value={formData.id} onChange={(e)=>setFormData({...formData,id:e.target.value})} className="w-full p-2 rounded bg-white/10" required />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">ชื่อคลาส</label>
            <input value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} className="w-full p-2 rounded bg-white/10" required />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-300 mb-1">ไอคอน</label>
              <input value={formData.icon} onChange={(e)=>setFormData({...formData,icon:e.target.value})} className="w-full p-2 rounded bg-white/10" />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">คำอธิบาย</label>
              <input value={formData.description} onChange={(e)=>setFormData({...formData,description:e.target.value})} className="w-full p-2 rounded bg-white/10" />
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded">
            <h3 className="font-semibold mb-2">Base Stats</h3>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" value={formData.baseStats.hp} onChange={(e)=>updateBase('hp', e.target.value)} className="p-2 rounded bg-white/10" />
              <input type="number" value={formData.baseStats.mp} onChange={(e)=>updateBase('mp', e.target.value)} className="p-2 rounded bg-white/10" />
              <input type="number" value={formData.baseStats.attack} onChange={(e)=>updateBase('attack', e.target.value)} className="p-2 rounded bg-white/10" />
              <input type="number" value={formData.baseStats.defense} onChange={(e)=>updateBase('defense', e.target.value)} className="p-2 rounded bg-white/10" />
              <input type="number" value={formData.baseStats.speed} onChange={(e)=>updateBase('speed', e.target.value)} className="p-2 rounded bg-white/10" />
            </div>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={()=>router.push('/admin/classes')} className="px-4 py-2 bg-gray-600 text-white rounded">ยกเลิก</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
