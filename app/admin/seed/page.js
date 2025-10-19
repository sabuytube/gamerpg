'use client';

import { useState } from 'react';
import apiService from '@/lib/api';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  const [expLoading, setExpLoading] = useState(false);

  const [result, setResult] = useState(null);
  const [itemsResult, setItemsResult] = useState(null);
  const [mapResult, setMapResult] = useState(null);
  const [skillsResult, setSkillsResult] = useState(null);
  const [classesResult, setClassesResult] = useState(null);
  const [expResult, setExpResult] = useState(null);

  const handleSeedMonsters = async () => {
    setLoading(true);
    setResult(null);

    try {
      const data = await apiService.get('monsters/seed');
      setResult(data);
    } catch (error) {
      const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      setResult({ success: false, error: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedItems = async () => {
    setItemsLoading(true);
    setItemsResult(null);

    try {
      const data = await apiService.get('items/seed');
      setItemsResult(data);
    } catch (error) {
      const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      setItemsResult({ success: false, error: msg });
    } finally {
      setItemsLoading(false);
    }
  };

  const handleSeedMaps = async () => {
    setMapLoading(true);
    setMapResult(null);

    try {
      const data = await apiService.get('map/seed');
      setMapResult(data);
    } catch (error) {
      const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      setMapResult({ success: false, error: msg });
    } finally {
      setMapLoading(false);
    }
  };

  const handleSeedSkills = async () => {
    setSkillsLoading(true);
    setSkillsResult(null);

    try {
      const data = await apiService.get('skills/seed');
      setSkillsResult(data);
    } catch (error) {
      const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      setSkillsResult({ success: false, error: msg });
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleSeedClasses = async () => {
    setClassesLoading(true);
    setClassesResult(null);

    try {
      const data = await apiService.get('classes/seed');
      setClassesResult(data);
    } catch (error) {
      const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      setClassesResult({ success: false, error: msg });
    } finally {
      setClassesLoading(false);
    }
  };

  const handleSeedExp = async () => {
    setExpLoading(true);
    setExpResult(null);

    try {
      const data = await apiService.get('exp/seed');
      setExpResult(data);
    } catch (error) {
      const msg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      setExpResult({ success: false, error: msg });
    } finally {
      setExpLoading(false);
    }
  };

  const handleSeedAll = async () => {
    // Run seeds sequentially to avoid overwhelming the server/DB
    await handleSeedMonsters();
    await handleSeedItems();
    await handleSeedMaps();
    await handleSeedSkills();
    await handleSeedClasses();
    await handleSeedExp();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🎮 Database Seed Tool
        </h1>

        {/* Seed All Button */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-2xl mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🚀 Seed All Data
          </h2>
          <p className="text-gray-300 mb-6">
            Click the button below to seed all data (Monsters, Items, Maps, Skills, Classes, and EXP)
          </p>

          <button
            onClick={handleSeedAll}
            disabled={loading || itemsLoading || mapLoading || skillsLoading || classesLoading || expLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading || itemsLoading || mapLoading || skillsLoading || classesLoading || expLoading ? '🔄 Processing...' : '🚀 Seed All (Monsters + Items + Maps + Skills + Classes + EXP)'}
          </button>
        </div>

        {/* Seed Monsters */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-2xl mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            👾 Seed Monster Data
          </h2>
          <p className="text-gray-300 mb-6">
            Click the button below to add sample monsters to the database
          </p>

          <button
            onClick={handleSeedMonsters}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? '🔄 Processing...' : '🚀 Seed Monsters'}
          </button>

          {result && (
            <div
              className={`mt-6 p-6 rounded-lg ${
                result.success
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : 'bg-red-500/20 border-2 border-red-500'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {result.success ? '✅ Success!' : '❌ Error'}
              </h3>

              {result.success ? (
                <>
                  <p className="text-white mb-4">{result.message}</p>
                  <div className="bg-black/30 rounded p-4 max-h-96 overflow-y-auto">
                    <h4 className="text-white font-semibold mb-3">
                      Monster list: ({result.monsters?.length || 0} monsters)
                    </h4>
                    <ul className="space-y-2">
                      {result.monsters?.map((monster, index) => (
                        <li
                          key={monster.id || index}
                          className="text-gray-200 flex items-center gap-2"
                        >
                          <span className="text-2xl">{monster.icon}</span>
                          <span>
                            {index + 1}. {monster.name} ({monster.nameEn}) - Lv.
                            {monster.level} [{monster.type}]
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-white">Error: {result.error}</p>
              )}
            </div>
          )}
        </div>

        {/* Seed Items */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-2xl mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            📦 Seed Items Data
          </h2>
          <p className="text-gray-300 mb-6">
            Click the button below to add sample items (Weapons, Armor, Charms, Consumables) to the database
          </p>

          <button
            onClick={handleSeedItems}
            disabled={itemsLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {itemsLoading ? '🔄 Processing...' : '🚀 Seed Items'}
          </button>

          {itemsResult && (
            <div
              className={`mt-6 p-6 rounded-lg ${
                itemsResult.success
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : 'bg-red-500/20 border-2 border-red-500'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {itemsResult.success ? '✅ Success!' : '❌ Error'}
              </h3>

              {itemsResult.success ? (
                <>
                  <p className="text-white mb-4">{itemsResult.message}</p>

                  {/* Summary */}
                  {itemsResult.summary && (
                    <div className="bg-black/30 rounded p-4 mb-4">
                      <h4 className="text-white font-semibold mb-3">📊 Summary:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-red-500/20 rounded p-3 text-center">
                          <div className="text-2xl mb-1">🗡️</div>
                          <div className="text-white font-bold">{itemsResult.summary.weapons}</div>
                          <div className="text-gray-300 text-sm">Weapons</div>
                        </div>
                        <div className="bg-blue-500/20 rounded p-3 text-center">
                          <div className="text-2xl mb-1">🛡️</div>
                          <div className="text-white font-bold">{itemsResult.summary.armor}</div>
                          <div className="text-gray-300 text-sm">Armor</div>
                        </div>
                        <div className="bg-purple-500/20 rounded p-3 text-center">
                          <div className="text-2xl mb-1">✨</div>
                          <div className="text-white font-bold">{itemsResult.summary.charms}</div>
                          <div className="text-gray-300 text-sm">Charms</div>
                        </div>
                        <div className="bg-green-500/20 rounded p-3 text-center">
                          <div className="text-2xl mb-1">🧪</div>
                          <div className="text-white font-bold">{itemsResult.summary.consumables}</div>
                          <div className="text-gray-300 text-sm">Consumables</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="bg-black/30 rounded p-4 max-h-96 overflow-y-auto">
                    <h4 className="text-white font-semibold mb-3">
                      Items: ({itemsResult.items?.length || 0} items)
                    </h4>
                    <ul className="space-y-2">
                      {itemsResult.items?.map((item, index) => (
                        <li
                          key={item._id || index}
                          className="text-gray-200 flex items-center gap-2"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="flex-1">
                            {index + 1}. {item.name}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.rarity === 'legendary' ? 'bg-orange-500/30 text-orange-300' :
                            item.rarity === 'epic' ? 'bg-purple-500/30 text-purple-300' :
                            item.rarity === 'rare' ? 'bg-blue-500/30 text-blue-300' :
                            'bg-gray-500/30 text-gray-300'
                          }`}>
                            {item.rarity}
                          </span>
                          <span className="text-xs text-gray-400">
                            [{item.type}]
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-white">Error: {itemsResult.error}</p>
              )}
            </div>
          )}
        </div>

        {/* Seed Additional Data (Maps, Skills, Classes, EXP) */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-2xl mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Seed Additional Data</h2>
          <p className="text-gray-300 mb-6">Run seeds for maps, skills, classes, and EXP (levels 1-100).</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleSeedMaps}
              disabled={mapLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mapLoading ? 'Processing...' : 'Seed Maps'}
            </button>

            <button
              onClick={handleSeedSkills}
              disabled={skillsLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {skillsLoading ? 'Processing...' : 'Seed Skills'}
            </button>

            <button
              onClick={handleSeedClasses}
              disabled={classesLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {classesLoading ? 'Processing...' : 'Seed Classes'}
            </button>

            <button
              onClick={handleSeedExp}
              disabled={expLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {expLoading ? 'Processing...' : 'Seed EXP Table'}
            </button>
          </div>

          {mapResult && (
            <div
              className={`mt-6 p-6 rounded-lg ${
                mapResult.success
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : 'bg-red-500/20 border-2 border-red-500'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-3">
                {mapResult.success ? 'Maps seeded successfully' : 'Map seeding failed'}
              </h3>
              {mapResult.success ? (
                <>
                  <p className="text-white mb-2">{mapResult.message}</p>
                  {typeof mapResult.count === 'number' && (
                    <p className="text-sm text-gray-300">Inserted {mapResult.count} records</p>
                  )}
                </>
              ) : (
                <p className="text-white">Error: {mapResult.error}</p>
              )}
            </div>
          )}

          {skillsResult && (
            <div
              className={`mt-6 p-6 rounded-lg ${
                skillsResult.success
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : 'bg-red-500/20 border-2 border-red-500'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-3">
                {skillsResult.success ? 'Skills seeded successfully' : 'Skill seeding failed'}
              </h3>
              {skillsResult.success ? (
                <>
                  <p className="text-white mb-2">{skillsResult.message}</p>
                  {typeof skillsResult.count === 'number' && (
                    <p className="text-sm text-gray-300">Inserted {skillsResult.count} skills</p>
                  )}
                </>
              ) : (
                <p className="text-white">Error: {skillsResult.error}</p>
              )}
            </div>
          )}

          {classesResult && (
            <div
              className={`mt-6 p-6 rounded-lg ${
                classesResult.success
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : 'bg-red-500/20 border-2 border-red-500'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-3">
                {classesResult.success ? 'Classes seeded successfully' : 'Class seeding failed'}
              </h3>
              {classesResult.success ? (
                <>
                  <p className="text-white mb-2">{classesResult.message}</p>
                  {typeof classesResult.count === 'number' && (
                    <p className="text-sm text-gray-300">Inserted {classesResult.count} classes</p>
                  )}
                </>
              ) : (
                <p className="text-white">Error: {classesResult.error}</p>
              )}
            </div>
          )}

          {expResult && (
            <div
              className={`mt-6 p-6 rounded-lg ${
                expResult.success
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : 'bg-red-500/20 border-2 border-red-500'
              }`}
            >
              <h3 className="text-xl font-bold text-white mb-3">
                {expResult.success ? 'EXP table seeded successfully' : 'EXP seeding failed'}
              </h3>
              {expResult.success ? (
                <>
                  <p className="text-white mb-2">{expResult.message}</p>
                  {typeof expResult.count === 'number' && (
                    <p className="text-sm text-gray-300">Inserted {expResult.count} rows</p>
                  )}
                </>
              ) : (
                <p className="text-white">Error: {expResult.error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
