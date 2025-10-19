export const emptyEquipment = { weapon: null, armor: null, charm: null };

export const createEmptyEquipment = () => ({ ...emptyEquipment });

export const computeGearModifiers = (equipment) => {
  const modifiers = {
    STR: 0,
    DEX: 0,
    INT: 0,
    VIT: 0,
    AGI: 0,
    LUK: 0,
    HP: 0,
    MP: 0,
    ATK: 0,
    SPD: 0,
    CRIT: 0,
    EVA: 0,
    ARM: 0,
    WPOW: 0,
  };

  [equipment.weapon, equipment.armor, equipment.charm].forEach((item) => {
    if (!item) return;
    Object.entries(item.mods).forEach(([key, value]) => {
      modifiers[key] = (modifiers[key] || 0) + value;
    });
  });

  return modifiers;
};