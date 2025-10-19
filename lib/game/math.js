export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const rand = (min, max) => Math.random() * (max - min) + min;

export const irand = (min, max) => Math.floor(rand(min, max + 1));

export const chance = (probability) => Math.random() < probability;

export const gearToStats = (mods = {}) => ({
  STR: mods.STR || 0,
  DEX: mods.DEX || 0,
  INT: mods.INT || 0,
  VIT: mods.VIT || 0,
  AGI: mods.AGI || 0,
  LUK: mods.LUK || 0,
});

export const sumStats = (a, b) => ({
  STR: a.STR + b.STR,
  DEX: a.DEX + b.DEX,
  INT: a.INT + b.INT,
  VIT: a.VIT + b.VIT,
  AGI: a.AGI + b.AGI,
  LUK: a.LUK + b.LUK,
});

export const calculateDerivedStats = (baseStats, gearMods = {}) => {
  const statsWithGear = sumStats(baseStats, gearToStats(gearMods));
  const { STR, DEX, INT, VIT, AGI, LUK } = statsWithGear;

  return {
    maxHP: Math.round(30 + VIT * 10 + (gearMods.HP || 0)),
    maxMP: Math.round(10 + INT * 6 + (gearMods.MP || 0)),
    atk: 4 + STR * 3 + (gearMods.ATK || 0),
    spd: 5 + AGI * 2 + DEX * 0.5 + (gearMods.SPD || 0),
    crit: clamp(0.03 + DEX * 0.02 + LUK * 0.01 + (gearMods.CRIT || 0), 0.03, 0.8),
    evade: clamp(AGI * 0.01 + (gearMods.EVA || 0), 0, 0.35),
    armor: 1 + VIT * 0.04 + (gearMods.ARM || 0),
    wpower: 6 + INT * 2.8 + (gearMods.WPOW || 0),
  };
};