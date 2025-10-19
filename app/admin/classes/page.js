'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

export default function ClassesPage() {
  const router = useRouter();
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await apiService.get('classes');
      if (data.success) setClassesList(data.classes || []);
    } catch (err) {
      console.error('Error loading classes', err);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('ลบคลาสนี้จริงหรือไม่?')) return;
    try {
      const res = await apiService.delete(`classes/${id}`);
      if (res.success) { alert('ลบคลาสสำเร็จ'); load(); }
    } catch (err) { console.error(err); alert('เกิดข้อผิดพลาด'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Classes</h1>
          <button onClick={()=>router.push('/admin/classes/create')} className="px-4 py-2 bg-green-600 text-white rounded">➕ สร้างคลาส</button>
        </div>

        <div className="bg-white/5 rounded border p-4">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">ID</th>
                <th className="py-2">ชื่อ</th>
                <th className="py-2">คำอธิบาย</th>
                <th className="py-2">Base HP</th>
                <th className="py-2 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {classesList.map(c => (
                <tr key={c._id} className="border-t">
                  <td className="py-2 text-sm text-gray-300">{c.id || c._id}</td>
                  <td className="py-2 font-semibold">{c.name}</td>
                  <td className="py-2 text-gray-400">{c.description || '-'}</td>
                  <td className="py-2">{c.baseStats?.hp || 0}</td>
                  <td className="py-2 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={()=>router.push(`/admin/classes/${c._id}`)} className="px-3 py-1 bg-yellow-600 text-white rounded">✏️</button>
                      <button onClick={()=>handleDelete(c._id)} className="px-3 py-1 bg-red-600 text-white rounded">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {classesList.length === 0 && <div className="py-6 text-center text-gray-400">ไม่พบคลาส</div>}
        </div>
      </div>
    </div>
  );
}

