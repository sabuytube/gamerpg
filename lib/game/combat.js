import { rand } from './math';

export const physicalDamage = (attacker, defender, multiplier = 1) => {
  const base = (attacker.derived.atk + attacker.stats.STR * 1.2) * multiplier;
  const variance = rand(0.9, 1.1);
  const crit = Math.random() < attacker.derived.crit ? 1.7 : 1;
  const armor = defender.derived.armor || 1;

  return Math.max(0, (base * variance * crit) / armor);
};

export const magicDamage = (attacker, defender, multiplier = 1) => {
  const base = (attacker.derived.wpower + attacker.stats.INT * 2.2) * multiplier;
  const variance = rand(0.92, 1.08);
  const resist = 1 + defender.lvl * 0.03;

  return Math.max(0, (base * variance) / resist);
};