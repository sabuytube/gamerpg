'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await apiService.get('skills');

      if (data.success) setSkills(data.skills || []);
    } catch (err) {
      console.error('Error loading skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบทักษะนี้?')) return;
    try {
      const data = await apiService.delete(`skills/${id}`);
      if (data.success) {
        alert('ลบทักษะสำเร็จ!');
        loadSkills();
      }
    } catch (err) {
      console.error('Error deleting skill:', err);
      alert('เกิดข้อผิดพลาดในการลบทักษะ');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">กำลังโหลด...</div>
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Skills</h1>
          <button onClick={() => router.push('/admin/skills/create')} className="px-4 py-2 bg-blue-600 text-white rounded">➕ สร้างทักษะ</button>
        </div>

        <div className="bg-white/5 rounded border p-4">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">ID</th>
                <th className="py-2">ชื่อ</th>
                <th className="py-2">MP</th>
                <th className="py-2">คำอธิบาย</th>
                <th className="py-2 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(s => (
                <tr key={s._id} className="border-t">
                  <td className="py-2 text-sm text-gray-300">{s.id || s._id}</td>
                  <td className="py-2 font-semibold">{s.name}</td>
                  <td className="py-2">{s.mp || 0}</td>
                  <td className="py-2 text-gray-400">{s.desc || '-'}</td>
                  <td className="py-2 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => router.push(`/admin/skills/${s._id}`)} className="px-3 py-1 bg-yellow-600 text-white rounded">✏️</button>
                      <button onClick={() => handleDelete(s._id)} className="px-3 py-1 bg-red-600 text-white rounded">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {skills.length === 0 && (
            <div className="py-6 text-center text-gray-400">ไม่พบทักษะ</div>
          )}
        </div>
      </div>
    </div>
  );
}

