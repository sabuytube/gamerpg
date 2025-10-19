'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import apiService from '@/lib/api';

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await apiService.get(`classes/${params.id}`);
      if (data.success) setFormData(data.class);
      else { alert(data.error || 'ไม่สามารถโหลดคลาสได้'); router.push('/admin/classes'); }
    } catch (err) {
      console.error(err); alert('ไม่สามารถโหลดคลาสได้'); router.push('/admin/classes');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiService.patch(`classes/${params.id}`, formData);
      if (res.success) { alert('บันทึกสำเร็จ'); router.push('/admin/classes'); }
      else alert(res.error || 'อัพเดทผิดพลาด');
    } catch (err) { console.error(err); alert('เกิดข้อผิดพลาด'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('ลบคลาสนี้จริงหรือไม่?')) return;
    try {
      const res = await apiService.delete(`classes/${params.id}`);
      if (res.success) { alert('ลบสำเร็จ'); router.push('/admin/classes'); }
      else alert(res.error || 'ลบไม่สำเร็จ');
    } catch (err) { console.error(err); alert('เกิดข้อผิดพลาด'); }
  };

  const updateBase = (k, v) => setFormData({ ...formData, baseStats: { ...formData.baseStats, [k]: parseInt(v) || 0 } });

  if (loading || !formData) return <div className="min-h-screen flex items-center justify-center text-white">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">✏️ แก้ไขคลาส: {formData.name}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Class ID</label>
            <input value={formData.id || ''} onChange={(e)=>setFormData({...formData,id:e.target.value})} className="w-full p-2 rounded bg-white/10" required />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">ชื่อคลาส</label>
            <input value={formData.name || ''} onChange={(e)=>setFormData({...formData,name:e.target.value})} className="w-full p-2 rounded bg-white/10" required />
          </div>

          <div className="bg-white/5 p-4 rounded">
            <h3 className="font-semibold mb-2">Base Stats</h3>
            <div className="grid grid-cols-3 gap-2">
              <input type="number" value={formData.baseStats?.hp || 0} onChange={(e)=>updateBase('hp', e.target.value)} className="p-2 rounded bg-white/10" />
              <input type="number" value={formData.baseStats?.mp || 0} onChange={(e)=>updateBase('mp', e.target.value)} className="p-2 rounded bg-white/10" />
              <input type="number" value={formData.baseStats?.attack || 0} onChange={(e)=>updateBase('attack', e.target.value)} className="p-2 rounded bg-white/10" />
              <input type="number" value={formData.baseStats?.defense || 0} onChange={(e)=>updateBase('defense', e.target.value)} className="p-2 rounded bg-white/10" />
              <input type="number" value={formData.baseStats?.speed || 0} onChange={(e)=>updateBase('speed', e.target.value)} className="p-2 rounded bg-white/10" />
            </div>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={()=>router.push('/admin/classes')} className="px-4 py-2 bg-gray-600 text-white rounded">ยกเลิก</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-yellow-600 text-white rounded">{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
            <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">ลบคลาส</button>
          </div>
        </form>
      </div>
    </div>
  );
}

