import { irand } from './math';

export const WEAPONS = [
  { id: 'stick', name: 'Wooden Stick', slot: 'weapon', mods: { ATK: 2 }, rarity: 'C' },
  { id: 'dagger', name: 'Rusty Dagger', slot: 'weapon', mods: { DEX: 1, ATK: 1, CRIT: 0.02 }, rarity: 'C' },
  { id: 'wand', name: 'Apprentice Wand', slot: 'weapon', mods: { INT: 2, WPOW: 2 }, rarity: 'B' },
  { id: 'sword', name: 'Iron Sword', slot: 'weapon', mods: { STR: 2, ATK: 4 }, rarity: 'B' },
  { id: 'blaze', name: 'Blazing Rod', slot: 'weapon', mods: { INT: 3, WPOW: 6, CRIT: 0.03 }, rarity: 'A' },
];

export const ARMORS = [
  { id: 'cloth', name: 'Cloth Shirt', slot: 'armor', mods: { VIT: 1 }, rarity: 'C' },
  { id: 'leather', name: 'Leather Vest', slot: 'armor', mods: { AGI: 1, ARM: 0.1 }, rarity: 'C' },
  { id: 'chain', name: 'Chainmail', slot: 'armor', mods: { VIT: 2, ARM: 0.2 }, rarity: 'B' },
  { id: 'mage', name: 'Mystic Robe', slot: 'armor', mods: { INT: 2, MP: 10 }, rarity: 'B' },
  { id: 'plate', name: 'Iron Plate', slot: 'armor', mods: { VIT: 3, ARM: 0.4 }, rarity: 'A' },
];

export const CHARMS = [
  { id: 'clover', name: 'Lucky Clover', slot: 'charm', mods: { LUK: 2, CRIT: 0.02 }, rarity: 'B' },
  { id: 'fleet', name: 'Fleet Anklet', slot: 'charm', mods: { AGI: 2, SPD: 1 }, rarity: 'B' },
  { id: 'focus', name: 'Focus Bead', slot: 'charm', mods: { INT: 1, WPOW: 2 }, rarity: 'C' },
  { id: 'heart', name: 'Heart Locket', slot: 'charm', mods: { VIT: 1, HP: 10 }, rarity: 'C' },
  { id: 'killer', name: 'Assassin Seal', slot: 'charm', mods: { DEX: 2, CRIT: 0.04 }, rarity: 'A' },
];

export const LOOT_TABLE = { C: 0.65, B: 0.28, A: 0.07 };

export const rollRarity = () => {
  const roll = Math.random();

  if (roll < LOOT_TABLE.A) return 'A';
  if (roll < LOOT_TABLE.A + LOOT_TABLE.B) return 'B';
  return 'C';
};

export const randomItem = () => {
  const rarity = rollRarity();
  const pool = [...WEAPONS, ...ARMORS, ...CHARMS].filter((item) => item.rarity === rarity);

  return pool[irand(0, pool.length - 1)];
};