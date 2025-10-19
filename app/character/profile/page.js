'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import apiService from '@/lib/api';

export default function CharacterProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // เปลี่ยนจาก selectedItem
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'equipment', 'inventory'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchCharacter();
    }
  }, [status]);

  const fetchCharacter = async () => {
    try {
      setLoading(true);
      const data = await apiService.get('character');
      setCharacter(data.character);
      setError(null);
    } catch (err) {
      console.error('Error fetching character:', err);
      if (err.error === 'ไม่พบข้อมูลตัวละคร') {
        setError('ยังไม่มีตัวละคร');
      } else {
        setError(err.message || 'ไม่สามารถโหลดข้อมูลตัวละครได้');
      }
    } finally {
      setLoading(false);
    }
  };

  const increaseStat = async (statName) => {
    if (!character.statPoints || character.statPoints <= 0) {
      alert('ไม่มี Stat Points เหลือ!');
      return;
    }

    try {
      setSaving(true);
      const updatedStats = { ...character.stats };
      updatedStats[statName] = (updatedStats[statName] || 0) + 1;

      const response = await apiService.patch('character', {
        stats: updatedStats,
        statPoints: character.statPoints - 1,
      });

      setCharacter(prev => ({
        ...prev,
        stats: updatedStats,
        statPoints: prev.statPoints - 1,
      }));

      console.log('Stat increased successfully');
    } catch (err) {
      console.error('Error increasing stat:', err);
      alert('ไม่สามารถเพิ่ม Stat ได้');
    } finally {
      setSaving(false);
    }
  };

  const equipItem = async (item, slot) => {
    try {
      setSaving(true);

      const updatedEquipment = { ...character.equipment };
      const updatedInventory = [...character.inventory];

      // ถอดของเก่าออก (ถ้ามี)
      if (updatedEquipment[slot]) {
        updatedInventory.push(updatedEquipment[slot]);
      }

      // สวมของใหม่
      updatedEquipment[slot] = item;

      // ลบของจาก inventory โดยเทียบจาก name, slot, และ rarity
      const itemIndex = updatedInventory.findIndex(i =>
        i.name === item.name &&
        (i.slot === item.slot || i.type === item.type) &&
        i.rarity === item.rarity
      );
      if (itemIndex > -1) {
        updatedInventory.splice(itemIndex, 1);
      }

      await apiService.patch('character', {
        equipment: updatedEquipment,
        inventory: updatedInventory,
      });

      setCharacter(prev => ({
        ...prev,
        equipment: updatedEquipment,
        inventory: updatedInventory,
      }));

      setShowEquipModal(false);
      setSelectedSlot(null);
    } catch (err) {
      console.error('Error equipping item:', err);
      alert('ไม่สามารถสวมใส่ไอเทมได้');
    } finally {
      setSaving(false);
    }
  };

  const unequipItem = async (slot) => {
    try {
      setSaving(true);

      const updatedEquipment = { ...character.equipment };
      const updatedInventory = [...character.inventory];

      // เอาของที่สวมอยู่ลง
      const itemToUnequip = updatedEquipment[slot];
      if (itemToUnequip) {
        updatedInventory.push(itemToUnequip);
        updatedEquipment[slot] = null;
      }

      await apiService.patch('character', {
        equipment: updatedEquipment,
        inventory: updatedInventory,
      });

      setCharacter(prev => ({
        ...prev,
        equipment: updatedEquipment,
        inventory: updatedInventory,
      }));
    } catch (err) {
      console.error('Error unequipping item:', err);
      alert('ไม่สามารถถอดไอเทมได้');
    } finally {
      setSaving(false);
    }
  };

  const openEquipModal = (slotType) => {
    setSelectedSlot(slotType);
    setShowEquipModal(true);
  };

  const closeEquipModal = () => {
    setShowEquipModal(false);
    setSelectedSlot(null);
  };

  const calculateTotalStats = (character) => {
    if (!character) return {};

    const stats = { ...character.stats };

    // เพิ่มค่าจาก equipment
    if (character.equipment?.weapon?.stats) {
      Object.keys(character.equipment.weapon.stats).forEach(stat => {
        stats[stat] = (stats[stat] || 0) + character.equipment.weapon.stats[stat];
      });
    }

    if (character.equipment?.armor?.stats) {
      Object.keys(character.equipment.armor.stats).forEach(stat => {
        stats[stat] = (stats[stat] || 0) + character.equipment.armor.stats[stat];
      });
    }

    if (character.equipment?.charm?.stats) {
      Object.keys(character.equipment.charm.stats).forEach(stat => {
        stats[stat] = (stats[stat] || 0) + character.equipment.charm.stats[stat];
      });
    }

    return stats;
  };

  const getStatColor = (statName) => {
    const colors = {
      STR: 'text-red-400',
      DEX: 'text-green-400',
      INT: 'text-blue-400',
      VIT: 'text-purple-400',
      AGI: 'text-yellow-400',
      LUK: 'text-pink-400',
    };
    return colors[statName] || 'text-gray-400';
  };

  const getStatIcon = (statName) => {
    const icons = {
      STR: '💪',
      DEX: '🎯',
      INT: '🧠',
      VIT: '❤️',
      AGI: '⚡',
      LUK: '🍀',
    };
    return icons[statName] || '📊';
  };

  const getStatDescription = (statName) => {
    const descriptions = {
      STR: 'ความแข็งแรง',
      DEX: 'ความคว่องแคล่ว',
      INT: 'สติปัญญา',
      VIT: 'พลังชีวิต',
      AGI: 'ความว่องไว',
      LUK: 'โชค',
    };
    return descriptions[statName] || statName;
  };

  const getRarityColor = (rarity) => {
    const colors = {
      legendary: 'from-orange-500 to-yellow-500',
      epic: 'from-purple-500 to-pink-500',
      rare: 'from-blue-500 to-cyan-500',
      common: 'from-gray-500 to-gray-600',
    };
    return colors[rarity] || colors.common;
  };

  const getRarityTextColor = (rarity) => {
    const colors = {
      legendary: 'text-orange-400',
      epic: 'text-purple-400',
      rare: 'text-blue-400',
      common: 'text-gray-400',
    };
    return colors[rarity] || colors.common;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚔️</div>
          <p className="text-white text-xl">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 border-2 border-purple-500/30 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-white mb-4">{error}</h2>
          <button
            onClick={() => router.push('/character/create')}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200"
          >
            สร้างตัวละคร
          </button>
        </div>
      </div>
    );
  }

  const totalStats = calculateTotalStats(character);
  const baseStats = character.stats || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent mb-2">
            ⚔️ Character Profile
          </h1>
          <p className="text-slate-300">จัดการตัวละครและอุปกรณ์ของคุณ</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Character Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Character Card */}
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900/80 to-purple-900/40 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="p-6 text-center">
                <div className="text-7xl mb-4">{character.class.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-2">{character.name}</h2>
                <p className="text-lg text-purple-300 mb-1">{character.class.name}</p>
                <p className="text-sm text-slate-400 mb-4">{character.class.nameEn}</p>

                {/* Level & XP */}
                <div className="bg-slate-900/50 rounded-xl p-4 mb-4 border border-purple-500/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300 text-sm">เลเวล</span>
                    <span className="text-2xl font-bold text-yellow-400">{character.level}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                      style={{ width: `${(character.exp / character.expToNext) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {character.exp} / {character.expToNext} XP
                  </p>
                </div>

                {/* Stat Points */}
                {character.statPoints > 0 && (
                  <div className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 rounded-xl p-4 mb-4 border-2 border-emerald-500/50 animate-pulse">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">⭐ Stat Points</span>
                      <span className="text-2xl font-bold text-emerald-400">{character.statPoints}</span>
                    </div>
                    <p className="text-xs text-emerald-200 mt-1">คลิกปุ่ม + เพื่อเพิ่ม Stats</p>
                  </div>
                )}

                {/* Gold */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-yellow-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">💰 Gold</span>
                    <span className="text-xl font-bold text-yellow-400">{character.gold || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/80 to-indigo-900/40 backdrop-blur-sm shadow-xl p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span>🎮</span>
                <span>Quick Actions</span>
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/map')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>🗺️</span>
                  <span>สำรวจแผนที่</span>
                </button>
                <button
                  onClick={() => router.push('/map')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>⚔️</span>
                  <span>หามอนสเตอร์</span>
                </button>
                <button
                  onClick={fetchCharacter}
                  className="w-full px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-semibold rounded-xl transition-all border border-slate-600 flex items-center justify-center gap-2"
                >
                  <span>🔄</span>
                  <span>รีเฟรช</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'stats'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                📊 สถานะ
              </button>
              <button
                onClick={() => setActiveTab('equipment')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'equipment'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                ⚔️ อุปกรณ์
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'inventory'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                🎒 กระเป๋า ({character.inventory?.length || 0})
              </button>
            </div>

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900/80 to-purple-900/40 backdrop-blur-sm shadow-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">📊 Character Stats</h2>
                  {character.statPoints > 0 && (
                    <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                      <span className="text-emerald-300 text-sm font-semibold">
                        ⭐ {character.statPoints} Points Available
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(baseStats).map(([stat, baseValue]) => {
                    const totalValue = totalStats[stat] || baseValue;
                    const bonus = totalValue - baseValue;
                    return (
                      <div key={stat} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 hover:border-purple-500/50 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{getStatIcon(stat)}</span>
                            <div>
                              <p className="text-white font-bold text-lg">{stat}</p>
                              <p className="text-xs text-slate-400">{getStatDescription(stat)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <span className={`text-3xl font-bold ${getStatColor(stat)}`}>
                                {baseValue}
                              </span>
                              {bonus > 0 && (
                                <span className="text-emerald-400 text-lg ml-1">
                                  +{bonus}
                                </span>
                              )}
                            </div>
                            {character.statPoints > 0 && (
                              <button
                                onClick={() => increaseStat(stat)}
                                disabled={saving}
                                className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xl disabled:opacity-50 transition-all hover:scale-110 shadow-lg"
                              >
                                +
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              stat === 'STR' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                              stat === 'DEX' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                              stat === 'INT' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                              stat === 'VIT' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                              stat === 'AGI' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                              'bg-gradient-to-r from-pink-500 to-pink-600'
                            }`}
                            style={{ width: `${Math.min((totalValue / 30) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Equipment Tab */}
            {activeTab === 'equipment' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/80 to-indigo-900/40 backdrop-blur-sm shadow-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">⚔️ Equipped Items</h2>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Weapon Slot */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                      <div className="relative bg-gradient-to-br from-red-900/40 to-orange-900/40 border-2 border-red-500/50 rounded-xl p-6 hover:border-red-400 transition-all min-h-[200px] flex flex-col">
                        <div className="text-4xl mb-3 text-center">🗡️</div>
                        <div className="text-sm text-slate-400 text-center mb-2">Weapon</div>
                        {character.equipment?.weapon ? (
                          <>
                            <div className="flex-1">
                              <div className="text-lg font-bold text-white text-center mb-2">
                                {character.equipment.weapon.name}
                              </div>
                              <div className={`text-sm text-center mb-3 font-semibold ${getRarityTextColor(character.equipment.weapon.rarity)}`}>
                                ⭐ {character.equipment.weapon.rarity}
                              </div>
                              {character.equipment.weapon.stats && (
                                <div className="text-xs text-slate-300 space-y-1">
                                  {Object.entries(character.equipment.weapon.stats).map(([stat, value]) => (
                                    <div key={stat} className="flex justify-between">
                                      <span>{stat}:</span>
                                      <span className="text-emerald-400">+{value}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => unequipItem('weapon')}
                              disabled={saving}
                              className="mt-4 w-full px-4 py-2 bg-red-600/50 hover:bg-red-600/70 text-white rounded-lg transition-all text-sm"
                            >
                              ถอดออก
                            </button>
                          </>
                        ) : (
                          <div className="flex-1 flex items-center justify-center">
                            <button
                              onClick={() => {
                                setSelectedSlot('weapon');
                                setShowEquipModal(true);
                              }}
                              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-all text-sm"
                            >
                              เลือกอาวุธ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Armor Slot */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                      <div className="relative bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-2 border-blue-500/50 rounded-xl p-6 hover:border-blue-400 transition-all min-h-[200px] flex flex-col">
                        <div className="text-4xl mb-3 text-center">🛡️</div>
                        <div className="text-sm text-slate-400 text-center mb-2">Armor</div>
                        {character.equipment?.armor ? (
                          <>
                            <div className="flex-1">
                              <div className="text-lg font-bold text-white text-center mb-2">
                                {character.equipment.armor.name}
                              </div>
                              <div className={`text-sm text-center mb-3 font-semibold ${getRarityTextColor(character.equipment.armor.rarity)}`}>
                                ⭐ {character.equipment.armor.rarity}
                              </div>
                              {character.equipment.armor.stats && (
                                <div className="text-xs text-slate-300 space-y-1">
                                  {Object.entries(character.equipment.armor.stats).map(([stat, value]) => (
                                    <div key={stat} className="flex justify-between">
                                      <span>{stat}:</span>
                                      <span className="text-emerald-400">+{value}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => unequipItem('armor')}
                              disabled={saving}
                              className="mt-4 w-full px-4 py-2 bg-red-600/50 hover:bg-red-600/70 text-white rounded-lg transition-all text-sm"
                            >
                              ถอดออก
                            </button>
                          </>
                        ) : (
                          <div className="flex-1 flex items-center justify-center">
                            <button
                              onClick={() => {
                                setSelectedSlot('armor');
                                setShowEquipModal(true);
                              }}
                              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-all text-sm"
                            >
                              เลือกเกราะ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Charm Slot */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                      <div className="relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/50 rounded-xl p-6 hover:border-purple-400 transition-all min-h-[200px] flex flex-col">
                        <div className="text-4xl mb-3 text-center">✨</div>
                        <div className="text-sm text-slate-400 text-center mb-2">Charm</div>
                        {character.equipment?.charm ? (
                          <>
                            <div className="flex-1">
                              <div className="text-lg font-bold text-white text-center mb-2">
                                {character.equipment.charm.name}
                              </div>
                              <div className={`text-sm text-center mb-3 font-semibold ${getRarityTextColor(character.equipment.charm.rarity)}`}>
                                ⭐ {character.equipment.charm.rarity}
                              </div>
                              {character.equipment.charm.stats && (
                                <div className="text-xs text-slate-300 space-y-1">
                                  {Object.entries(character.equipment.charm.stats).map(([stat, value]) => (
                                    <div key={stat} className="flex justify-between">
                                      <span>{stat}:</span>
                                      <span className="text-emerald-400">+{value}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => unequipItem('charm')}
                              disabled={saving}
                              className="mt-4 w-full px-4 py-2 bg-red-600/50 hover:bg-red-600/70 text-white rounded-lg transition-all text-sm"
                            >
                              ถอดออก
                            </button>
                          </>
                        ) : (
                          <div className="flex-1 flex items-center justify-center">
                            <button
                              onClick={() => {
                                setSelectedSlot('charm');
                                setShowEquipModal(true);
                              }}
                              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-all text-sm"
                            >
                              เลือกเครื่องราง
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                {/* Filter Tabs */}
                <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/80 to-emerald-900/40 backdrop-blur-sm shadow-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">🎒 Inventory</h2>

                  {/* Category Tabs */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                      onClick={() => setActiveTab('inventory')}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold whitespace-nowrap"
                    >
                      ⚔️ อุปกรณ์ ({(character.inventory || []).filter(i => ['weapon', 'armor', 'charm'].includes(i.type)).length})
                    </button>
                    <button
                      onClick={() => setActiveTab('materials')}
                      className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm font-semibold whitespace-nowrap"
                    >
                      ⛏️ วัตถุดิบ ({(character.materials?.ores?.length || 0) + (character.materials?.crystals?.length || 0) + (character.materials?.essences?.length || 0) + (character.materials?.scrolls?.length || 0)})
                    </button>
                  </div>

                  {/* Equipment Items */}
                  {character.inventory?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {character.inventory.map((item, index) => {
                        const isEquipment = ['weapon', 'armor', 'charm'].includes(item.type);
                        if (!isEquipment) return null;

                        return (
                          <div
                            key={index}
                            className="bg-slate-900/50 border-2 border-slate-700/50 rounded-xl p-4 hover:border-purple-500/50 transition-all"
                          >
                            {/* Item Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-white font-bold text-lg">{item.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getRarityTextColor(item.rarity)} bg-slate-800/50`}>
                                    ⭐ {item.rarity || 'common'}
                                  </span>
                                  <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                                    {item.type === 'weapon' ? '🗡️ อาวุธ' : item.type === 'armor' ? '🛡️ เกราะ' : '✨ เครื่องราง'}
                                  </span>
                                </div>
                              </div>
                              <div className="text-4xl">
                                {item.type === 'weapon' ? '🗡️' : item.type === 'armor' ? '🛡️' : '✨'}
                              </div>
                            </div>

                            {/* Item Description */}
                            {item.description && (
                              <p className="text-xs text-slate-400 mb-3 italic">"{item.description}"</p>
                            )}

                            {/* Item Stats */}
                            {item.stats && (
                              <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                                <div className="text-xs font-semibold text-emerald-400 mb-2">📊 สถานะ:</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {Object.entries(item.stats).map(([stat, value]) => (
                                    <div key={stat} className="flex justify-between items-center">
                                      <span className="text-xs text-slate-300">{stat}:</span>
                                      <span className="text-sm font-bold text-emerald-400">+{value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Enhancement Level (สำหรับอนาคต) */}
                            {item.enhancement > 0 && (
                              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-2 mb-3">
                                <div className="text-xs text-yellow-300 flex items-center justify-center gap-1">
                                  <span>✨</span>
                                  <span>ตีบวก +{item.enhancement}</span>
                                </div>
                              </div>
                            )}

                            {/* Item Actions */}
                            <button
                              onClick={() => equipItem(item, item.type)}
                              disabled={saving}
                              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all text-sm disabled:opacity-50 shadow-lg"
                            >
                              สวมใส่
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-slate-400 text-lg">ไม่มีอุปกรณ์</p>
                      <p className="text-slate-500 text-sm mt-2">ไปต่อสู้เพื่อรับไอเทม!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <div className="space-y-6">
                {/* Ores */}
                <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-slate-900/80 to-orange-900/40 backdrop-blur-sm shadow-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>⛏️</span>
                    <span>แร่ ({character.materials?.ores?.length || 0})</span>
                  </h3>
                  {character.materials?.ores?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {character.materials.ores.map((ore, index) => (
                        <div key={index} className="bg-slate-900/50 border border-orange-500/30 rounded-lg p-3 hover:border-orange-400 transition-all">
                          <div className="text-3xl text-center mb-2">{ore.icon || '⛏️'}</div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-white">{ore.name}</div>
                            <div className="text-xs text-slate-400">x{ore.quantity || 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">ไม่มีแร่</div>
                  )}
                </div>

                {/* Crystals */}
                <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/80 to-cyan-900/40 backdrop-blur-sm shadow-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>💎</span>
                    <span>คริสตัล ({character.materials?.crystals?.length || 0})</span>
                  </h3>
                  {character.materials?.crystals?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {character.materials.crystals.map((crystal, index) => (
                        <div key={index} className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-3 hover:border-cyan-400 transition-all">
                          <div className="text-3xl text-center mb-2">{crystal.icon || '💎'}</div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-white">{crystal.name}</div>
                            <div className="text-xs text-slate-400">x{crystal.quantity || 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">ไม่มีคริสตัล</div>
                  )}
                </div>

                {/* Essences */}
                <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900/80 to-purple-900/40 backdrop-blur-sm shadow-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>✨</span>
                    <span>สาระวิเศษ ({character.materials?.essences?.length || 0})</span>
                  </h3>
                  {character.materials?.essences?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {character.materials.essences.map((essence, index) => (
                        <div key={index} className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-3 hover:border-purple-400 transition-all">
                          <div className="text-3xl text-center mb-2">{essence.icon || '✨'}</div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-white">{essence.name}</div>
                            <div className="text-xs text-slate-400">x{essence.quantity || 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">ไม่มีสาระวิเศษ</div>
                  )}
                </div>

                {/* Scrolls */}
                <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-slate-900/80 to-yellow-900/40 backdrop-blur-sm shadow-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>📜</span>
                    <span>สูตรและสกรอล ({character.materials?.scrolls?.length || 0})</span>
                  </h3>
                  {character.materials?.scrolls?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {character.materials.scrolls.map((scroll, index) => (
                        <div key={index} className="bg-slate-900/50 border border-yellow-500/30 rounded-lg p-3 hover:border-yellow-400 transition-all">
                          <div className="text-3xl text-center mb-2">{scroll.icon || '📜'}</div>
                          <div className="text-center">
                            <div className="text-sm font-semibold text-white">{scroll.name}</div>
                            <div className="text-xs text-slate-400">x{scroll.quantity || 1}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">ไม่มีสูตรและสกรอล</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Saving Indicator */}
        {saving && (
          <div className="fixed bottom-4 right-4 bg-slate-900 border border-purple-500 rounded-lg px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin text-xl">⚙️</div>
              <span className="text-white text-sm">กำลังบันทึก...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
