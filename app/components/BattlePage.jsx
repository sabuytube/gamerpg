'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import BattleArena from '@/components/game/BattleArena';
import { chance, clamp, irand } from '@/lib/game/math';
import { computeGearModifiers, createEmptyEquipment } from '@/lib/game/gear';
import { createEntity, formatDamage, tryEvade } from '@/lib/game/entities';
import { randomItem } from '@/lib/game/items';
import { SKILLS } from '@/lib/game/skills';
import { DUNGEONS, pickEnemyForRoom } from '@/lib/game/dungeon';

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

  const grantXp = (amount) => {
    setXp((currentXp) => {
      let pool = currentXp + amount;
      let newLevel = level;
      let nextCap = xpToNext;

      while (pool >= nextCap) {
        pool -= nextCap;
        newLevel += 1;
        levelUp(newLevel);
        nextCap = Math.round(20 + newLevel * 10);
      }

      setLevel(newLevel);
      setXpToNext(nextCap);

      return pool;
    });
  };

  const levelUp = (newLevel) => {
    const stats = ['STR', 'DEX', 'INT', 'VIT', 'AGI', 'LUK'];
    const first = stats[irand(0, stats.length - 1)];
    const second = stats[irand(0, stats.length - 1)];

    setBaseStats((current) => {
      const next = { ...current, [first]: current[first] + 1, [second]: current[second] + 1 };

      setPlayer((existing) => {
        if (!existing) return existing;
        return createEntity(existing.name, newLevel, next, gearMods);
      });

      return next;
    });

    pushLog(`Level Up!  ->  Lv.${newLevel} (+1 ${first}, +1 ${second})`);
    pushLog('You feel refreshed (fully healed)!');
  };

  const endBattle = (victory) => {
    setTurn('end');
    if (!player || !enemy) return;

    if (victory) {
      const reward = 10 + Math.round(enemy.lvl * 5);
      pushLog(`You win! +${reward} XP`);
      grantXp(reward);

      if (chance(0.8)) {
        const loot = randomItem();
        addLoot(loot);
        pushLog(`Loot: ${loot.name} [${loot.rarity}]`);
      } else {
        pushLog('No loot this time.');
      }

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
    // Reload battle from saved data
    if (typeof window !== 'undefined') {
      const battleData = localStorage.getItem(BATTLE_DATA_KEY);
      if (battleData) {
        const data = JSON.parse(battleData);
        initializeBattle(data);
      }
    }
  };

  const handleExitBattle = () => {
    // Save current state and return to previous page
    saveGameState();
    if (battleSource === 'map') {
      router.push('/map');
    } else {
      router.push('/game');
    }
  };

  const initializeBattle = (battleData) => {
    const { enemyData, source, room } = battleData;

    setBattleSource(source || 'dungeon');

    const hero = createEntity('Hero', level, baseStats, gearMods);
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

  const saveGameState = () => {
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
  };

  // Load game state on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
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
    }

    // Load battle data
    const battleData = localStorage.getItem(BATTLE_DATA_KEY);
    if (battleData) {
      try {
        const data = JSON.parse(battleData);
        initializeBattle(data);
      } catch {
        // If no battle data, redirect back
        router.push('/game');
      }
    } else {
      // No battle data, redirect
      router.push('/game');
    }
  }, []);

  // Save game state periodically
  useEffect(() => {
    saveGameState();
  }, [baseStats, level, xp, xpToNext, equipment, inventory, dungeonIndex, roomIndex]);

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
