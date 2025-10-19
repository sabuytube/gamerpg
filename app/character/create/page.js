'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CHARACTER_CLASSES } from '@/lib/game/classes';

export default function CharacterCreationPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [characterData, setCharacterData] = useState({
    name: '',
    class: null,
    customStats: null,
  });

  const handleClassSelect = (classId) => {
    const selectedClass = CHARACTER_CLASSES.find(c => c.id === classId);
    setCharacterData({
      ...characterData,
      class: selectedClass,
    });
    setStep(2);
  };

  const handleNameChange = (e) => {
    setCharacterData({
      ...characterData,
      name: e.target.value,
    });
  };

  const handleCreateCharacter = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: characterData.name,
          class: characterData.class,
          stats: characterData.class.baseStats,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'ไม่สามารถสร้างตัวละครได้');
      }

      // บันทึกลง localStorage เพื่อใช้ในเกม (backward compatibility)
      localStorage.setItem('character_data', JSON.stringify({
        ...characterData,
        createdAt: new Date().toISOString(),
        level: 1,
        exp: 0,
      }));

      localStorage.setItem('mini6rpg_state_v2', JSON.stringify({
        stats: characterData.class.baseStats,
        level: 1,
        xp: 0,
        xpToNext: 20,
        equipment: {
          weapon: null,
          armor: null,
          charm: null,
        },
        inventory: [],
        dungeonIndex: 0,
        roomIndex: 0,
      }));

      // Redirect to character profile or game
      router.push('/character/profile');
    } catch (err) {
      console.error('Error creating character:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    };
    return colors[color] || colors.blue;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚔️</div>
          <p className="text-white text-xl">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            ⚔️ สร้างตัวละคร ⚔️
          </h1>
          <div className="flex justify-center gap-4 mb-4">
            <div className={`px-6 py-2 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-gray-600'} text-white font-semibold`}>
              1. เลือกอาชีพ
            </div>
            <div className={`px-6 py-2 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-600'} text-white font-semibold`}>
              2. ตั้งชื่อ
            </div>
            <div className={`px-6 py-2 rounded-full ${step >= 3 ? 'bg-emerald-500' : 'bg-gray-600'} text-white font-semibold`}>
              3. ยืนยัน
            </div>
          </div>
          {error && (
            <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 mb-4 max-w-md mx-auto">
              <p className="text-white">{error}</p>
            </div>
          )}
        </div>

        {/* Step 1: Choose Class */}
        {step === 1 && (
          <div className="grid md:grid-cols-3 gap-6">
            {CHARACTER_CLASSES.map((charClass) => (
              <div
                key={charClass.id}
                onClick={() => handleClassSelect(charClass.id)}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 cursor-pointer hover:scale-105 transition-all duration-300 hover:border-white/40 hover:shadow-2xl"
              >
                <div className="text-center mb-4">
                  <div className="text-8xl mb-4">{charClass.icon}</div>
                  <h2 className="text-3xl font-bold text-white mb-2">{charClass.name}</h2>
                  <p className="text-sm text-gray-300">{charClass.nameEn}</p>
                </div>

                <p className="text-gray-200 text-sm mb-6 text-center leading-relaxed">
                  {charClass.description}
                </p>

                <div className="bg-black/30 rounded-xl p-4 mb-4">
                  <h3 className="text-white font-semibold mb-3 text-center">สถานะเริ่มต้น</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(charClass.baseStats).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between text-white">
                        <span className="font-semibold">{stat}:</span>
                        <span className="text-emerald-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/30 rounded-xl p-4 mb-4">
                  <h3 className="text-white font-semibold mb-3 text-center">โบนัสพิเศษ</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {charClass.bonuses.hp > 0 && (
                      <div className="text-white">HP: <span className="text-green-300">+{charClass.bonuses.hp}</span></div>
                    )}
                    {charClass.bonuses.mp > 0 && (
                      <div className="text-white">MP: <span className="text-blue-300">+{charClass.bonuses.mp}</span></div>
                    )}
                    {charClass.bonuses.atk > 0 && (
                      <div className="text-white">ATK: <span className="text-red-300">+{charClass.bonuses.atk}</span></div>
                    )}
                    {charClass.bonuses.def > 0 && (
                      <div className="text-white">DEF: <span className="text-yellow-300">+{charClass.bonuses.def}</span></div>
                    )}
                  </div>
                </div>

                <button className={`w-full bg-gradient-to-r ${getColorClasses(charClass.color)} text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg`}>
                  เลือกอาชีพนี้
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Customize Name */}
        {step === 2 && characterData.class && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20">
              <div className="text-center mb-8">
                <div className="text-9xl mb-4">{characterData.class.icon}</div>
                <h2 className="text-4xl font-bold text-white mb-2">{characterData.class.name}</h2>
                <p className="text-gray-300">{characterData.class.description}</p>
              </div>

              <div className="mb-6">
                <label htmlFor="characterName" className="block text-white font-semibold mb-3 text-xl">
                  ตั้งชื่อตัวละคร
                </label>
                <input
                  id="characterName"
                  type="text"
                  value={characterData.name}
                  onChange={handleNameChange}
                  placeholder="กรอกชื่อตัวละครของคุณ..."
                  maxLength={20}
                  className="w-full px-6 py-4 text-2xl bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/60 focus:ring-4 focus:ring-white/20 transition-all"
                />
                <p className="text-gray-300 text-sm mt-2">
                  {characterData.name.length}/20 ตัวอักษร
                </p>
              </div>

              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <h3 className="text-white font-bold text-xl mb-4 text-center">สถิติตัวละคร</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(characterData.class.baseStats).map(([stat, value]) => (
                    <div key={stat} className="text-center">
                      <div className="text-gray-400 text-sm mb-1">{stat}</div>
                      <div className="text-3xl font-bold text-emerald-300">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all"
                >
                  ← ย้อนกลับ
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!characterData.name || characterData.name.trim().length < 2}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ถัดไป →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && characterData.class && characterData.name && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">ยืนยันการสร้างตัวละคร</h2>

              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="text-9xl mb-4">{characterData.class.icon}</div>
                  <h3 className="text-4xl font-bold text-white mb-2">{characterData.name}</h3>
                  <p className="text-xl text-gray-300">{characterData.class.name}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Object.entries(characterData.class.baseStats).map(([stat, value]) => (
                    <div key={stat} className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-gray-400 text-sm">{stat}</div>
                      <div className="text-2xl font-bold text-emerald-300">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3 text-center">โบนัสพิเศษ</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-white">❤️ HP: <span className="text-green-300">+{characterData.class.bonuses.hp}</span></div>
                    <div className="text-white">💙 MP: <span className="text-blue-300">+{characterData.class.bonuses.mp}</span></div>
                    <div className="text-white">⚔️ ATK: <span className="text-red-300">+{characterData.class.bonuses.atk}</span></div>
                    <div className="text-white">🛡️ DEF: <span className="text-yellow-300">+{characterData.class.bonuses.def}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50"
                >
                  ← แก้ไข
                </button>
                <button
                  onClick={handleCreateCharacter}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ กำลังสร้าง...' : '✨ สร้างตัวละคร'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
