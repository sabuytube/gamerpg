import { calculateDerivedStats, clamp } from './math';

export const createEntity = (name, level, baseStats, gearMods = {}) => {
  const derived = calculateDerivedStats(baseStats, gearMods);
  return {
    name,
    lvl: level,
    stats: baseStats,
    gearMods: gearMods || {},
    derived,
    hp: derived.maxHP,
    mp: derived.maxMP,
  };
};

export const refreshEntity = (entity) => {
  const derived = calculateDerivedStats(entity.stats, entity.gearMods);
  return {
    ...entity,
    derived,
    hp: clamp(entity.hp ?? derived.maxHP, 0, derived.maxHP),
    mp: clamp(entity.mp ?? derived.maxMP, 0, derived.maxMP),
  };
};

export const tryEvade = (target) => Math.random() < (target.derived.evade || 0);

export const formatDamage = (value) => `${Math.max(0, Math.round(value))}`;