'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [counts, setCounts] = useState({ monsters: 0, items: 0, classes: 0, skills: 0, characters: 0 });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const [mRes, iRes, cRes, sRes, chRes] = await Promise.all([
        apiService.get('monsters', { limit: 100 }),
        apiService.get('items', { limit: 100 }),
        apiService.get('classes', { limit: 100 }),
        apiService.get('skills', { limit: 100 }),
        // characters admin endpoint
        apiService.get('character/all'),
      ]);

      const monstersCount = mRes?.monsters?.length ?? (mRes?.count ?? (Array.isArray(mRes?.data) ? mRes.data.length : 0));
      const itemsCount = iRes?.items?.length ?? (iRes?.count ?? (Array.isArray(iRes?.data) ? iRes.data.length : 0));
      const classesCount = cRes?.classes?.length ?? (cRes?.count ?? (Array.isArray(cRes?.data) ? cRes.data.length : 0));
      const skillsCount = sRes?.skills?.length ?? (sRes?.count ?? (Array.isArray(sRes?.data) ? sRes.data.length : 0));
      const charactersCount = chRes?.characters?.length ?? (chRes?.count ?? 0);

      setCounts({ monsters: monstersCount, items: itemsCount, classes: classesCount, skills: skillsCount, characters: charactersCount });
    } catch (err) {
      console.error('Error loading dashboard counts', err);
      setError(err?.message || 'Failed to load counts');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAll = async () => {
    if (!confirm('Seed all data? This may overwrite existing data.')) return;
    try {
      setSeeding(true);
      setError(null);
      // Run seeds sequentially
      const seeds = [
        'monsters/seed',
        'items/seed',
        'map/seed',
        'skills/seed',
        'classes/seed',
        'exp/seed',
      ];

      for (const path of seeds) {
        try {
          await apiService.get(path);
        } catch (e) {
          console.error('Seed failed for', path, e);
        }
      }

      alert('Seeding completed (check logs for details)');
      loadCounts();
    } catch (err) {
      console.error('Error seeding', err);
      setError('Seeding failed');
    } finally {
      setSeeding(false);
    }
  };

  const cards = [
    { key: 'monsters', label: 'Monsters', count: counts.monsters, link: '/admin/monsters' },
    { key: 'items', label: 'Items', count: counts.items, link: '/admin/items' },
    { key: 'classes', label: 'Classes', count: counts.classes, link: '/admin/classes' },
    { key: 'skills', label: 'Skills', count: counts.skills, link: '/admin/skills' },
    { key: 'characters', label: 'Characters', count: counts.characters, link: '/admin/characters' },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-300">Overview & quick actions</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/admin/seed')} className="px-4 py-2 bg-gray-600 text-white rounded">Seed Tool</button>
            <button onClick={handleSeedAll} disabled={seeding} className="px-4 py-2 bg-emerald-600 text-white rounded">{seeding ? 'Seeding...' : 'Seed All'}</button>
            <button onClick={loadCounts} className="px-4 py-2 bg-blue-600 text-white rounded">Refresh</button>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-600 text-white rounded">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {cards.map(c => (
            <div key={c.key} className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-300">{c.label}</div>
                  <div className="text-3xl font-bold text-white">{loading ? '...' : c.count}</div>
                </div>
                <div>
                  <button onClick={() => router.push(c.link)} className="px-3 py-2 bg-purple-600 text-white rounded">Manage</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-3">Quick Links</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => router.push('/admin/monsters')} className="px-4 py-2 bg-gray-700 text-white rounded">Monsters</button>
            <button onClick={() => router.push('/admin/items')} className="px-4 py-2 bg-gray-700 text-white rounded">Items</button>
            <button onClick={() => router.push('/admin/classes')} className="px-4 py-2 bg-gray-700 text-white rounded">Classes</button>
            <button onClick={() => router.push('/admin/skills')} className="px-4 py-2 bg-gray-700 text-white rounded">Skills</button>
            <button onClick={() => router.push('/admin/characters')} className="px-4 py-2 bg-gray-700 text-white rounded">Characters</button>
            <button onClick={() => router.push('/admin/seed')} className="px-4 py-2 bg-gray-700 text-white rounded">Seed</button>
          </div>
        </div>
      </div>
    </div>
  );
}
