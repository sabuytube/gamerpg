'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/character/all');
      const data = await res.json();
      if (data.success) setCharacters(data.characters || []);
    } catch (err) {
      console.error('Error loading characters', err);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('ลบตัวละครนี้จริงหรือไม่?')) return;
    try {
      const res = await fetch(`/api/character/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) { alert('ลบตัวละครสำเร็จ'); load(); }
      else alert(data.error || 'ลบไม่สำเร็จ');
    } catch (err) { console.error(err); alert('เกิดข้อผิดพลาด'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Characters</h1>
        </div>

        <div className="bg-white/5 rounded border p-4">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">ชื่อตัวละคร</th>
                <th className="py-2">คลาส</th>
                <th className="py-2">เลเวล</th>
                <th className="py-2">ผู้เล่น</th>
                <th className="py-2 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {characters.map(c => (
                <tr key={c._id} className="border-t">
                  <td className="py-2 font-semibold">{c.name}</td>
                  <td className="py-2 text-gray-400">{c.class || '-'}</td>
                  <td className="py-2">{c.level || 1}</td>
                  <td className="py-2 text-sm text-gray-300">{c.userId ? c.userId.substring(0,8) : '-'}</td>
                  <td className="py-2 text-right">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => router.push(`/admin/characters/${c._id}`)} className="px-3 py-1 bg-blue-600 text-white rounded">👁️</button>
                      <button onClick={() => handleDelete(c._id)} className="px-3 py-1 bg-red-600 text-white rounded">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {characters.length === 0 && <div className="py-6 text-center text-gray-400">ไม่พบทักัด</div>}
        </div>
      </div>
    </div>
  );
}

