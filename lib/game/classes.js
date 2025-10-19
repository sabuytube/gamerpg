// Character Classes Configuration
export const CHARACTER_CLASSES = [
  {
    id: 'warrior',
    name: 'นักดาบ',
    nameEn: 'Warrior',
    icon: '⚔️',
    description: 'นักรบที่มีพลังและความแข็งแกร่งสูง เชี่ยวชาญการใช้ดาบและโล่',
    color: 'red',
    baseStats: {
      STR: 8,  // ความแข็งแรง (สูง)
      DEX: 4,  // ความคว่องแคล่ว
      INT: 2,  // สติปัญญา
      VIT: 7,  // พลังชีวิต (สูง)
      AGI: 3,  // ความว่องไว
      LUK: 3,  // โชค
    },
    bonuses: {
      hp: 20,      // HP เพิ่ม
      mp: 0,       // MP เพิ่ม
      atk: 5,      // ATK เพิ่ม
      def: 3,      // DEF เพิ่ม
    },
    skills: ['slash', 'guard', 'powerStrike'],
    startingWeapon: 'Iron Sword',
  },
  {
    id: 'archer',
    name: 'นักธนู',
    nameEn: 'Archer',
    icon: '🏹',
    description: 'นักรบที่เชี่ยวชาญการใช้ธนู มีความแม่นยำและความเร็วสูง',
    color: 'green',
    baseStats: {
      STR: 4,  // ความแข็งแรง
      DEX: 8,  // ความคว่องแคล่ว (สูง)
      INT: 3,  // สติปัญญา
      VIT: 4,  // พลังชีวิต
      AGI: 7,  // ความว่องไว (สูง)
      LUK: 4,  // โชค
    },
    bonuses: {
      hp: 5,       // HP เพิ่ม
      mp: 5,       // MP เพิ่ม
      atk: 4,      // ATK เพิ่ม
      def: 1,      // DEF เพิ่ม
    },
    skills: ['quickShot', 'multiShot', 'guard'],
    startingWeapon: 'Short Bow',
  },
  {
    id: 'mage',
    name: 'นักเวทมนตร์',
    nameEn: 'Mage',
    icon: '🔮',
    description: 'ผู้ใช้เวทมนตร์ที่มีพลังเวทย์สูง สามารถร่ายเวทโจมตีและรักษาได้',
    color: 'blue',
    baseStats: {
      STR: 2,  // ความแข็งแรง
      DEX: 3,  // ความคว่องแคล่ว
      INT: 8,  // สติปัญญา (สูง)
      VIT: 3,  // พลังชีวิต
      AGI: 4,  // ความว่องไว
      LUK: 5,  // โชค
    },
    bonuses: {
      hp: 0,       // HP เพิ่ม
      mp: 20,      // MP เพิ่ม (สูง)
      atk: 2,      // ATK เพิ่ม
      def: 0,      // DEF เพิ่ม
    },
    skills: ['fireball', 'heal', 'guard'],
    startingWeapon: 'Wooden Staff',
  },
];

export function getClassById(classId) {
  return CHARACTER_CLASSES.find(c => c.id === classId);
}

export function getClassBaseStats(classId) {
  const charClass = getClassById(classId);
  return charClass ? charClass.baseStats : null;
}

export function getClassBonuses(classId) {
  const charClass = getClassById(classId);
  return charClass ? charClass.bonuses : null;
}

