import { createEntity } from './entities';
import { irand } from './math';

const NORMAL_ENEMY_FACTORIES = [
  (lvl) => createEntity('Slime', lvl, { STR: 2, DEX: 1, INT: 0, VIT: 2, AGI: 1, LUK: 0 }),
  (lvl) => createEntity('Goblin', lvl, { STR: 3, DEX: 3, INT: 0, VIT: 2, AGI: 2, LUK: 1 }),
  (lvl) => createEntity('Wolf', lvl, { STR: 4, DEX: 4, INT: 0, VIT: 3, AGI: 4, LUK: 1 }),
  (lvl) => createEntity('Apprentice Mage', lvl, { STR: 1, DEX: 2, INT: 5, VIT: 2, AGI: 2, LUK: 2 }),
  (lvl) => createEntity('Bandit', lvl, { STR: 4, DEX: 5, INT: 1, VIT: 3, AGI: 4, LUK: 3 }),
  (lvl) => createEntity('Stone Golem', lvl, { STR: 7, DEX: 1, INT: 0, VIT: 7, AGI: 1, LUK: 0 }),
];

const BOSS_FACTORY = (lvl) => createEntity('Orc Chief', lvl, { STR: 8, DEX: 4, INT: 1, VIT: 7, AGI: 3, LUK: 2 });

export const spawnEnemyForRoom = (room) => {
  if (room.boss) return BOSS_FACTORY(room.lvl);

  const factory = NORMAL_ENEMY_FACTORIES[irand(0, NORMAL_ENEMY_FACTORIES.length - 1)];
  return factory(room.lvl);
};

export const enemyFactories = {
  normal: NORMAL_ENEMY_FACTORIES,
  boss: BOSS_FACTORY,
};