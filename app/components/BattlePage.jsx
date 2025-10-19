'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import BattleArena from '@/components/game/BattleArena';
import { chance, clamp, irand } from '@/lib/game/math';
import { computeGearModifiers, createEmptyEquipment } from '@/lib/game/gear';
import { createEntity, formatDamage, tryEvade } from '@/lib/game/entities';
import { randomItem } from '@/lib/game/items';
import { SKILLS } from '@/lib/game/skills';
import { DUNGEONS, pickEnemyForRoom } from '@/lib/game/dungeon';
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

export default function BattlePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState(null);
  const [baseStats, setBaseStats] = useState(() => ({ ...INITIAL_STATS }));
  const [player, setPlayer] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [xpToNext, setXpToNext] = useState(20);
  const [equipment, setEquipment] = useState(() => createEmptyEquipment());
  const [inventory, setInventory] = useState([]);
  const [guarded, setGuarded] = useState({ player: false, enemy: false });
  const [battleLog, setBattleLog] = useState([]);
  const [turn, setTurn] = useState(null);
  const [hitState, setHitState] = useState({ player: false, enemy: false });
  const [dungeonIndex, setDungeonIndex] = useState(0);
  const [roomIndex, setRoomIndex] = useState(0);
  const [battleSource, setBattleSource] = useState('dungeon'); // 'dungeon' or 'map'
  const [statPoints, setStatPoints] = useState(0); // เพิ่ม state สำหรับ stat points

  const gearMods = useMemo(() => computeGearModifiers(equipment), [equipment]);

  const pushLog = (text) => {
    setBattleLog((entries) => [{ id: crypto.randomUUID(), text }, ...entries].slice(0, 150));
  };

  const addLoot = (item) => {
    setInventory((items) => [item, ...items].slice(0, 30));
  };

  const flash = (which) => {
    setHitState((state) => ({ ...state, [which]: true }));
    setTimeout(() => {
      setHitState((state) => ({ ...state, [which]: false }));
    }, 250);
  };

  const resolveDamage = (targetEntity, rawDamage, isGuarding) => {
    const reduced = isGuarding ? rawDamage * 0.6 : rawDamage;
    const remaining = clamp(targetEntity.hp - Math.round(reduced), 0, targetEntity.derived.maxHP);
    return { updated: { ...targetEntity, hp: remaining }, dealt: reduced };
  };

  // โหลดข้อมูลตัวละครจาก database
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
        setStatPoints(char.statPoints || 0); // เพิ่มการโหลด statPoints

        const emptyEquip = createEmptyEquipment();
        setEquipment(char.equipment ? { ...emptyEquip, ...char.equipment } : emptyEquip);
        setInventory(Array.isArray(char.inventory) ? char.inventory : []);
        setDungeonIndex(char.dungeonProgress?.dungeonIndex || 0);
        setRoomIndex(char.dungeonProgress?.roomIndex || 0);
      }
    } catch (err) {
      console.error('Error loading character:', err);
      router.push('/character/create');
    } finally {
      setLoading(false);
    }
  };

  // บันทึกข้อมูลลง database
  const saveCharacterToDB = async (updates) => {
    try {
      await apiService.patch('character', updates);
      console.log('Character saved to database');
    } catch (err) {
      console.error('Error saving character:', err);
    }
  };

  const grantXp = (amount) => {
    let newXp = xp;
    let newLevel = level;
    let newNextCap = xpToNext;
    let newStatPoints = statPoints;

    setXp((currentXp) => {
      let pool = currentXp + amount;
      newXp = pool;
      newLevel = level;
      newNextCap = xpToNext;

      while (pool >= newNextCap) {
        pool -= newNextCap;
        newLevel += 1;
        newStatPoints += 1; // เพิ่ม stat point
        newNextCap = Math.round(20 + newLevel * 10);

        // Heal HP/MP เต็ม
        setPlayer((existing) => {
          if (!existing) return existing;
          return {
            ...existing,
            hp: existing.derived.maxHP,
            mp: existing.derived.maxMP,
          };
        });

        pushLog(`🎉 Level Up! -> Lv.${newLevel}`);
        pushLog(`⭐ +1 Stat Point! (Visit Profile to allocate)`);
        pushLog('💚 You feel refreshed (fully healed)!');
      }

      setLevel(newLevel);
      setXpToNext(newNextCap);
      setStatPoints(newStatPoints);
      newXp = pool;

      return pool;
    });

    // Return values สำหรับใช้ใน endBattle
    return { newXp, newLevel, newNextCap, newStatPoints };
  };

  const levelUp = (newLevel) => {
    // เพิ่ม 1 Stat Point เมื่อ Level Up แทนการสุ่ม Stats
    setStatPoints((prev) => prev + 1);

    // Heal HP/MP เต็ม
    setPlayer((existing) => {
      if (!existing) return existing;
      return {
        ...existing,
        hp: existing.derived.maxHP,
        mp: existing.derived.maxMP,
      };
    });

    pushLog(`🎉 Level Up! -> Lv.${newLevel}`);
    pushLog(`⭐ +1 Stat Point! (Visit Profile to allocate)`);
    pushLog('💚 You feel refreshed (fully healed)!');
  };

  const endBattle = async (victory) => {
    setTurn('end');
    if (!player || !enemy) return;

    if (victory) {
      const reward = 10 + Math.round(enemy.lvl * 5);
      pushLog(`You win! +${reward} XP`);
      grantXp(reward);

      // ดรอปไอเทมจากมอนสเตอร์ตาม drop table
      const droppedItems = [];

      // ดึงรายการไอเทมจาก API โดยใช้ apiService
      try {
        const itemsData = await apiService.get('items');
        const itemsPool = itemsData.items || [];

        // ดึงข้อมูลมอนสเตอร์จาก localStorage (ที่มี dropTable)
        if (typeof window !== 'undefined') {
          const battleData = localStorage.getItem(BATTLE_DATA_KEY);
          if (battleData) {
            const { enemyData } = JSON.parse(battleData);

            if (enemyData && enemyData.dropTable && Array.isArray(enemyData.dropTable)) {
              // คำนวณ drop items
              for (const dropEntry of enemyData.dropTable) {
                const roll = Math.random();

                if (roll <= dropEntry.dropChance) {
                  // กรองไอเทมตาม type และ rarity
                  const matchingItems = itemsPool.filter(
                    item => item.type === dropEntry.itemType &&
                            item.rarity === dropEntry.itemRarity
                  );

                  if (matchingItems.length > 0) {
                    // สุ่มเลือกไอเทม
                    const randomIndex = Math.floor(Math.random() * matchingItems.length);
                    const selectedItem = matchingItems[randomIndex];

                    droppedItems.push(selectedItem);

                    // แสดง log พร้อม emoji rarity
                    const rarityEmoji = {
                      common: '⚪',
                      rare: '🔵',
                      epic: '🟣',
                      legendary: '🟠'
                    };
                    const emoji = rarityEmoji[selectedItem.rarity] || '⚪';
                    pushLog(`${emoji} Loot: ${selectedItem.name} [${selectedItem.rarity}]`);
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching items for drop:', error);
      }

      // ถ้าไม่มีไอเทมดรอป
      if (droppedItems.length === 0) {
        pushLog('No loot this time.');
      } else {
        pushLog(`💰 Got ${droppedItems.length} item(s)!`);
      }

      // เพิ่มไอเทมลง inventory
      droppedItems.forEach(item => addLoot(item));

      if (battleSource === 'dungeon') {
        const activeDungeon = DUNGEONS[dungeonIndex];
        if (roomIndex < activeDungeon.rooms.length - 1) {
          setRoomIndex((idx) => idx + 1);
        } else {
          pushLog(`Dungeon cleared: ${activeDungeon.name}!`);
          setDungeonIndex((idx) => (idx + 1) % DUNGEONS.length);
          setRoomIndex(0);
        }
      }

      // บันทึกผลการต่อสู้ลง database
      setTimeout(async () => {
        const updates = {
          stats: baseStats,
          level,
          exp: xp + reward,
          expToNext: xpToNext,
          statPoints: statPoints,
          equipment,
          inventory: [...inventory, ...droppedItems],
          dungeonProgress: {
            dungeonIndex,
            roomIndex: battleSource === 'dungeon'
              ? (roomIndex < DUNGEONS[dungeonIndex].rooms.length - 1 ? roomIndex + 1 : 0)
              : roomIndex,
          },
        };

        await saveCharacterToDB(updates);

        // Sync กับ localStorage
        const payload = {
          stats: baseStats,
          level,
          xp: xp + reward,
          xpToNext,
          equipment,
          inventory: [...inventory, ...droppedItems],
          dungeonIndex: updates.dungeonProgress.dungeonIndex,
          roomIndex: updates.dungeonProgress.roomIndex,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
      }, 500);

    } else {
      pushLog('You were defeated... Try changing gear or stats.');
    }
  };

  const doSkill = (user, skill) => {
    if (!player || !enemy) return;

    const actorIsPlayer = user === 'player';
    const actingEntity = actorIsPlayer ? player : enemy;
    const targetEntity = actorIsPlayer ? enemy : player;

    if (skill.id === 'guard') {
      if (actorIsPlayer) {
        setGuarded((state) => ({ ...state, player: true }));
        setPlayer((state) => ({ ...state, mp: clamp(state.mp + 2, 0, state.derived.maxMP) }));
      } else {
        setGuarded((state) => ({ ...state, enemy: true }));
        setEnemy((state) => ({ ...state, mp: clamp(state.mp + 2, 0, state.derived.maxMP) }));
      }
      pushLog(`${actingEntity.name} guards and recovers 2 MP.`);
      setTurn(actorIsPlayer ? 'enemy' : 'player');
      flash(user);
      return;
    }

    if (actingEntity.mp < skill.mp) {
      pushLog(`${actingEntity.name} tried ${skill.name} but lacked MP!`);
      setTurn(actorIsPlayer ? 'enemy' : 'player');
      return;
    }

    if (skill.id === 'heal') {
      const healResult = skill.use(actingEntity, targetEntity);
      const healAmount = healResult.heal || 0;
      const before = actingEntity.hp;
      const mpAfter = clamp(actingEntity.mp - skill.mp, 0, actingEntity.derived.maxMP);
      const hpAfter = clamp(actingEntity.hp + healAmount, 0, actingEntity.derived.maxHP);
      const actual = hpAfter - before;

      if (actorIsPlayer) {
        setPlayer((state) => ({ ...state, mp: mpAfter, hp: hpAfter }));
      } else {
        setEnemy((state) => ({ ...state, mp: mpAfter, hp: hpAfter }));
      }

      pushLog(`${actingEntity.name} casts ${skill.name} and heals ${formatDamage(actual)} HP.`);
      setTurn(actorIsPlayer ? 'enemy' : 'player');
      flash(user);
      return;
    }

    const mpAfter = clamp(actingEntity.mp - skill.mp, 0, actingEntity.derived.maxMP);
    if (actorIsPlayer) {
      setPlayer((state) => ({ ...state, mp: mpAfter }));
    } else {
      setEnemy((state) => ({ ...state, mp: mpAfter }));
    }

    const skillResult = skill.use(actingEntity, targetEntity);

    if (skillResult.type === 'phys' && tryEvade(targetEntity)) {
      pushLog(`${actingEntity.name} used ${skill.name} but ${targetEntity.name} evaded!`);
      flash(actorIsPlayer ? 'enemy' : 'player');
    } else {
      const guardedTarget = actorIsPlayer ? guarded.enemy : guarded.player;
      const { updated, dealt } = resolveDamage(targetEntity, skillResult.dmg || 0, guardedTarget);

      if (actorIsPlayer) {
        setGuarded((state) => ({ ...state, enemy: false }));
        setEnemy(updated);
      } else {
        setGuarded((state) => ({ ...state, player: false }));
        setPlayer(updated);
      }

      pushLog(`${actingEntity.name} used ${skill.name} for ${formatDamage(dealt)} dmg!`);
      flash(actorIsPlayer ? 'enemy' : 'player');

      if (updated.hp <= 0) {
        endBattle(actorIsPlayer);
        return;
      }
    }

    setTurn(actorIsPlayer ? 'enemy' : 'player');
  };

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      const battleData = localStorage.getItem(BATTLE_DATA_KEY);
      if (battleData) {
        const data = JSON.parse(battleData);
        initializeBattle(data);
      }
    }
  };

  const handleExitBattle = () => {
    if (battleSource === 'map') {
      router.push('/map');
    } else {
      router.push('/game');
    }
  };

  const initializeBattle = (battleData) => {
    const { enemyData, source, room } = battleData;

    setBattleSource(source || 'dungeon');

    const hero = createEntity(character?.name || 'Hero', level, baseStats, gearMods);
    let foe;

    if (enemyData) {
      // Battle from map - use provided enemy data
      foe = createEntity(enemyData.name, enemyData.level || level, {
        STR: enemyData.attack || 5,
        DEX: 3,
        INT: 2,
        VIT: enemyData.defense || 5,
        AGI: 3,
        LUK: 2,
      }, {});
    } else if (room) {
      // Battle from dungeon
      foe = pickEnemyForRoom(room);
    } else {
      // Fallback
      const activeDungeon = DUNGEONS[dungeonIndex];
      const currentRoom = activeDungeon.rooms[roomIndex];
      foe = pickEnemyForRoom(currentRoom);
    }

    setPlayer(hero);
    setEnemy(foe);
    setGuarded({ player: false, enemy: false });
    setBattleLog([]);
    setTurn(hero.derived.spd >= foe.derived.spd ? 'player' : 'enemy');

    const activeDungeon = DUNGEONS[dungeonIndex];
    const bossLabel = room?.boss ? ' (Boss)' : '';
    const locationText = source === 'map'
      ? `Wild Encounter - ${foe.name} (Lv.${foe.lvl}) appears!`
      : `${activeDungeon.name} - Room ${roomIndex + 1}${bossLabel} - ${foe.name} (Lv.${foe.lvl}) appears!`;

    pushLog(locationText);
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

  // Initialize battle after character is loaded
  useEffect(() => {
    if (!character || loading) return;

    if (typeof window !== 'undefined') {
      const battleData = localStorage.getItem(BATTLE_DATA_KEY);
      if (battleData) {
        try {
          const data = JSON.parse(battleData);
          initializeBattle(data);
        } catch {
          router.push('/game');
        }
      } else {
        router.push('/game');
      }
    }
  }, [character, loading]);

  // Enemy AI
  useEffect(() => {
    if (turn !== 'enemy' || !player || !enemy) return;

    const timeout = setTimeout(() => {
      const options = [SKILLS[0]];
      if (enemy.mp >= 6) options.push(SKILLS[4]);
      if (enemy.mp >= 4) options.push(SKILLS[3]);
      if (enemy.mp >= 3) options.push(SKILLS[2]);
      if (enemy.mp >= 2) options.push(SKILLS[1]);
      if (enemy.hp < enemy.derived.maxHP * 0.4 && enemy.mp >= 5) options.push(SKILLS[5]);
      if (Math.random() < 0.2) options.push(SKILLS[6]);

      const chosen = options[irand(0, options.length - 1)];
      doSkill('enemy', chosen);
    }, 600);

    return () => clearTimeout(timeout);
  }, [turn, enemy, player]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⚔️</div>
          <p className="text-white text-xl">กำลังเตรียมการต่อสู้...</p>
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

  if (!player || !enemy) {
    return (
      <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-100 text-gray-800 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading battle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-100 text-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <BattleArena
          player={player}
          enemy={enemy}
          turn={turn}
          skills={SKILLS}
          onSkill={(skill) => turn === 'player' && doSkill('player', skill)}
          log={battleLog}
          onRetry={handleRetry}
          onExit={handleExitBattle}
          equipment={equipment}
          meta={{
            level,
            xp,
            xpToNext,
            dungeonName: activeDungeon.name,
            roomIndex,
            totalRooms: activeDungeon.rooms.length,
          }}
          hitState={hitState}
        />
      </div>
    </div>
  );
}
