'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

export default function CreateSkillPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    mp: 0,
    desc: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiService.post('skills', formData);

      if (data.success) {
        alert('สร้างทักษะสำเร็จ!');
        router.push('/admin/skills');
      } else {
        // handle error explicitly instead of throwing
        console.error('Create failed:', data.error || data);
        alert(data.error || 'ไม่สามารถสร้างทักษะได้');
      }
    } catch (err) {
      console.error('Error creating skill:', err);
      alert(err.error || err.message || 'เกิดข้อผิดพลาดในการสร้างทักษะ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">➕ สร้างทักษะใหม่</h1>
          <p className="text-gray-400">กรอกข้อมูลทักษะที่ต้องการเพิ่มในเกม</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">ข้อมูลทักษะ</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill ID *</label>
                <input type="text" required value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="fireball" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ชื่อทักษะ *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="ลูกไฟ" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">💙 MP Cost</label>
                <input type="number" value={formData.mp} onChange={(e) => setFormData({ ...formData, mp: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" min="0" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">คำอธิบาย</label>
                <textarea value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" rows="3" placeholder="ยิงลูกไฟใส่ศัตรู สร้างความเสียหาย..." />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button type="button" onClick={() => router.push('/admin/skills')} className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all">
              ยกเลิก
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all disabled:opacity-50">
              {loading ? 'กำลังสร้าง...' : '✅ สร้างทักษะ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
