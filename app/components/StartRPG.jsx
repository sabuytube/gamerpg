'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import GameBuilder from '@/components/game/GameBuilder';
import GameHeader from '@/components/game/GameHeader';
import InventoryPanel from '@/components/game/InventoryPanel';
import { computeGearModifiers, createEmptyEquipment } from '@/lib/game/gear';
import { createEntity } from '@/lib/game/entities';
import { SKILLS } from '@/lib/game/skills';
import { DUNGEONS } from '@/lib/game/dungeon';
import apiService from '@/lib/api';

const LOCAL_STORAGE_KEY = 'mini6rpg_state_v2';
const BATTLE_DATA_KEY = 'mini6rpg_battle_data';

const INITIAL_STATS = {
  STR: 4,
  DEX: 3,
  INT: 3,
  VIT: 4,
  AGI: 3,
  LUK: 2,
};

export default function GamePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState(null);
  const [baseStats, setBaseStats] = useState(() => ({ ...INITIAL_STATS }));
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [xpToNext, setXpToNext] = useState(20);
  const [equipment, setEquipment] = useState(() => createEmptyEquipment());
  const [inventory, setInventory] = useState([]);
  const [dungeonIndex, setDungeonIndex] = useState(0);
  const [roomIndex, setRoomIndex] = useState(0);

  const gearMods = useMemo(() => computeGearModifiers(equipment), [equipment]);

  const heroPreview = useMemo(
    () => createEntity('Hero', level, baseStats, gearMods),
    [baseStats, gearMods, level],
  );

  // โหลดข้อมูลจาก database
  const loadCharacterFromDB = async () => {
    try {
      setLoading(true);
      const data = await apiService.get('character');

      if (data && data.character) {
        const char = data.character;
        setCharacter(char);
        setBaseStats(char.stats || INITIAL_STATS);
        setLevel(char.level || 1);
        setXp(char.exp || 0);
        setXpToNext(char.expToNext || 20);

        const emptyEquip = createEmptyEquipment();
        setEquipment(char.equipment ? { ...emptyEquip, ...char.equipment } : emptyEquip);
        setInventory(Array.isArray(char.inventory) ? char.inventory : []);
        setDungeonIndex(char.dungeonProgress?.dungeonIndex || 0);
        setRoomIndex(char.dungeonProgress?.roomIndex || 0);

        // Sync กับ localStorage สำหรับ backward compatibility
        const payload = {
          stats: char.stats || INITIAL_STATS,
          level: char.level || 1,
          xp: char.exp || 0,
          xpToNext: char.expToNext || 20,
          equipment: char.equipment || createEmptyEquipment(),
          inventory: char.inventory || [],
          dungeonIndex: char.dungeonProgress?.dungeonIndex || 0,
          roomIndex: char.dungeonProgress?.roomIndex || 0,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (err) {
      console.error('Error loading character:', err);
      // ถ้าไม่มีตัวละคร ให้ redirect ไปสร้าง
      if (err.error === 'ไม่พบข้อมูลตัวละคร') {
        router.push('/character/create');
      }
    } finally {
      setLoading(false);
    }
  };

  // บันทึกข้อมูลลง database
  const saveCharacterToDB = async (updates) => {
    try {
      await apiService.patch('character', updates);
    } catch (err) {
      console.error('Error saving character:', err);
    }
  };

  // Load character data on mount
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      loadCharacterFromDB();
    }
  }, [status]);

  const handleStatChange = (stat, value) => {
    setBaseStats((stats) => ({ ...stats, [stat]: value }));
  };

  const equipItem = (item) => {
    // Update equipment
    setEquipment((current) => ({ ...current, [item.slot]: item }));

    // Remove item from inventory
    setInventory((items) => {
      const index = items.findIndex(invItem =>
        invItem.name === item.name &&
        invItem.slot === item.slot &&
        invItem.rarity === item.rarity
      );
      if (index !== -1) {
        const newItems = [...items];
        newItems.splice(index, 1);
        return newItems;
      }
      return items;
    });
  };

  const removeFromInventory = (item) => {
    setInventory((items) => {
      const index = items.findIndex(invItem =>
        invItem.name === item.name &&
        invItem.slot === item.slot &&
        invItem.rarity === item.rarity
      );
      if (index !== -1) {
        const newItems = [...items];
        newItems.splice(index, 1);
        return newItems;
      }
      return items;
    });
  };

  const startDungeon = () => {
    setRoomIndex(0);
    const activeDungeon = DUNGEONS[dungeonIndex];
    const room = activeDungeon.rooms[0];

    // Save battle data to localStorage
    const battleData = {
      source: 'dungeon',
      room,
      dungeonIndex,
      roomIndex: 0,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(BATTLE_DATA_KEY, JSON.stringify(battleData));
    }

    // Navigate to battle page
    router.push('/battle');
  };

  // Save to database when state changes
  useEffect(() => {
    if (!character || loading) return;

    const updates = {
      stats: baseStats,
      level,
      exp: xp,
      expToNext: xpToNext,
      equipment,
      inventory,
      dungeonProgress: {
        dungeonIndex,
        roomIndex,
      },
    };

    // Debounce save to database
    const timeoutId = setTimeout(() => {
      saveCharacterToDB(updates);
    }, 1000);

    // Also save to localStorage for backward compatibility
    const payload = {
      stats: baseStats,
      level,
      xp,
      xpToNext,
      equipment,
      inventory,
      dungeonIndex,
      roomIndex,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));

    return () => clearTimeout(timeoutId);
  }, [baseStats, level, xp, xpToNext, equipment, inventory, dungeonIndex, roomIndex]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚔️</div>
          <p className="text-white text-xl">กำลังโหลดข้อมูลตัวละคร...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-white/20 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-white mb-4">ไม่พบข้อมูลตัวละคร</h2>
          <p className="text-gray-300 mb-6">กรุณาสร้างตัวละครก่อนเริ่มเล่นเกม</p>
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

  const activeDungeon = DUNGEONS[dungeonIndex];

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-100 text-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {character.class.icon} {character.name}
            </h1>
            <p className="text-sm text-gray-600">
              {character.class.name} - ผจญภัยในดันเจี้ยน
            </p>
          </div>
          <button
            onClick={() => router.push('/character/profile')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
          >
            👤 โปรไฟล์
          </button>
        </div>

        <GameHeader
          level={level}
          xp={xp}
          xpToNext={xpToNext}
          dungeonName={activeDungeon.name}
          roomIndex={roomIndex}
          totalRooms={activeDungeon.rooms.length}
          onStartRoom={startDungeon}
        />

        <div className="grid md:grid-cols-3 gap-4">
          <GameBuilder
            stats={baseStats}
            onStatChange={handleStatChange}
            derivedPreview={heroPreview.derived}
            skills={SKILLS}
          />
          <InventoryPanel
            equipment={equipment}
            inventory={inventory}
            onEquip={equipItem}
            onDrop={removeFromInventory}
          />
        </div>
      </div>
    </div>
  );
}
