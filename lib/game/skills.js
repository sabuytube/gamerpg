import { clamp } from './math';
import { magicDamage, physicalDamage } from './combat';

export const SKILLS = [
  {
    id: 'attack',
    name: 'Attack',
    mp: 0,
    desc: 'Basic STR hit; can crit.',
    use: (user, target) => ({ type: 'phys', dmg: physicalDamage(user, target) }),
  },
  {
    id: 'quick_strike',
    name: 'Quick Strike',
    mp: 2,
    desc: 'Fast precise hit with higher crit.',
    use: (user, target) => {
      const original = user.derived.crit;
      user.derived.crit = clamp(original + 0.2, 0, 0.95);
      const dmg = physicalDamage(user, target, 0.9);
      user.derived.crit = original;
      return { type: 'phys', dmg };
    },
  },
  {
    id: 'power_smash',
    name: 'Power Smash',
    mp: 3,
    desc: 'Big STR blow.',
    use: (user, target) => ({ type: 'phys', dmg: physicalDamage(user, target, 1.3) }),
  },
  {
    id: 'mind_bolt',
    name: 'Mind Bolt',
    mp: 4,
    desc: 'INT bolt; ignores most armor.',
    use: (user, target) => ({ type: 'magic', dmg: magicDamage(user, target, 1) }),
  },
  {
    id: 'fire_orb',
    name: 'Fire Orb',
    mp: 6,
    desc: 'Heavier INT spell.',
    use: (user, target) => ({ type: 'magic', dmg: magicDamage(user, target, 1.4) }),
  },
  {
    id: 'heal',
    name: 'Heal',
    mp: 5,
    desc: 'Restore HP based on INT.',
    use: (user) => ({ type: 'heal', heal: Math.round(10 + user.stats.INT * 6) }),
  },
  {
    id: 'guard',
    name: 'Guard',
    mp: 0,
    desc: 'Reduce next damage by 40% and gain 2 MP.',
    use: () => ({ type: 'guard' }),
  },
];