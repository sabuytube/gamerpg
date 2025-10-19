'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameBuilder from '@/components/game/GameBuilder';
import GameHeader from '@/components/game/GameHeader';
import InventoryPanel from '@/components/game/InventoryPanel';
import { computeGearModifiers, createEmptyEquipment } from '@/lib/game/gear';
import { createEntity } from '@/lib/game/entities';
import { SKILLS } from '@/lib/game/skills';
import { DUNGEONS } from '@/lib/game/dungeon';

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

  const handleStatChange = (stat, value) => {
    setBaseStats((stats) => ({ ...stats, [stat]: value }));
  };

  const equipItem = (item) => {
    setEquipment((current) => ({ ...current, [item.slot]: item }));
  };

  const removeFromInventory = (id) => {
    setInventory((items) => items.filter((item) => item.id !== id));
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

  // Load saved game state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      setBaseStats(parsed.stats ? { ...INITIAL_STATS, ...parsed.stats } : { ...INITIAL_STATS });

      const emptyEquip = createEmptyEquipment();
      setEquipment(parsed.equipment ? { ...emptyEquip, ...parsed.equipment } : emptyEquip);

      setInventory(Array.isArray(parsed.inventory) ? parsed.inventory : []);
      setLevel(parsed.level ?? 1);
      setXp(parsed.xp ?? 0);
      setXpToNext(parsed.xpToNext ?? 20);
      setDungeonIndex(parsed.dungeonIndex ?? 0);
      setRoomIndex(parsed.roomIndex ?? 0);
    } catch {
      // ignore corrupted saves
    }
  }, []);

  // Save game state
  useEffect(() => {
    if (typeof window === 'undefined') return;

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
  }, [baseStats, level, xp, xpToNext, equipment, inventory, dungeonIndex, roomIndex]);

  const activeDungeon = DUNGEONS[dungeonIndex];

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-100 text-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Mini RPG - Gear - Loot - Dungeon - Level (JS)</h1>
        <p className="text-sm text-gray-600 mb-4">
          Build -&gt; Equip -&gt; Run dungeon (3-4 rooms) -&gt; Gain XP & Loot -&gt; Level up. Simple shake/flash animations on actions.
        </p>

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
