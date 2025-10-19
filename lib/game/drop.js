import { irand } from './math';

/**
 * คำนวณ drop items จากมอนสเตอร์ตาม drop table
 * @param {Object} monster - มอนสเตอร์ที่มี dropTable
 * @param {Array} itemsPool - รายการไอเทมทั้งหมดจาก database
 * @returns {Array} - รายการไอเทมที่ดรอป
 */
export function calculateMonsterDrops(monster, itemsPool = []) {
  const droppedItems = [];

  if (!monster.dropTable || monster.dropTable.length === 0) {
    return droppedItems;
  }

  // วนลูปตรวจสอบแต่ละไอเทมใน drop table
  for (const dropEntry of monster.dropTable) {
    const roll = Math.random();

    // ถ้า roll ได้น้อยกว่า dropChance = ดรอป!
    if (roll <= dropEntry.dropChance) {
      // กรองไอเทมตาม type และ rarity
      const matchingItems = itemsPool.filter(
        item => item.type === dropEntry.itemType &&
                item.rarity === dropEntry.itemRarity
      );

      if (matchingItems.length > 0) {
        // สุ่มเลือกไอเทม
        const selectedItem = matchingItems[irand(0, matchingItems.length - 1)];

        // สุ่มจำนวน
        const quantity = irand(dropEntry.quantity.min, dropEntry.quantity.max);

        droppedItems.push({
          ...selectedItem,
          quantity: quantity,
        });
      }
    }
  }

  return droppedItems;
}

/**
 * สร้าง drop table แบบอัตโนมัติตามระดับและประเภทมอนสเตอร์
 * @param {String} monsterType - ประเภทมอนสเตอร์ (normal, elite, boss, world_boss)
 * @param {Number} level - ระดับมอนสเตอร์
 * @returns {Array} - drop table
 */
export function generateDropTable(monsterType, level) {
  const dropTable = [];

  switch (monsterType) {
    case 'normal':
      // มอนสเตอร์ธรรมดา - ดรอปของธรรมดา
      dropTable.push(
        { itemType: 'weapon', itemRarity: 'common', dropChance: 0.15, quantity: { min: 1, max: 1 } },
        { itemType: 'armor', itemRarity: 'common', dropChance: 0.15, quantity: { min: 1, max: 1 } },
        { itemType: 'charm', itemRarity: 'common', dropChance: 0.10, quantity: { min: 1, max: 1 } },
        { itemType: 'consumable', itemRarity: 'common', dropChance: 0.25, quantity: { min: 1, max: 3 } }
      );

      // ถ้าเลเวลสูง มีโอกาสดรอป rare
      if (level >= 5) {
        dropTable.push(
          { itemType: 'weapon', itemRarity: 'rare', dropChance: 0.05, quantity: { min: 1, max: 1 } },
          { itemType: 'armor', itemRarity: 'rare', dropChance: 0.05, quantity: { min: 1, max: 1 } }
        );
      }
      break;

    case 'elite':
      // มอนสเตอร์ยาก - ดรอปของดีขึ้น
      dropTable.push(
        { itemType: 'weapon', itemRarity: 'common', dropChance: 0.20, quantity: { min: 1, max: 1 } },
        { itemType: 'armor', itemRarity: 'common', dropChance: 0.20, quantity: { min: 1, max: 1 } },
        { itemType: 'weapon', itemRarity: 'rare', dropChance: 0.15, quantity: { min: 1, max: 1 } },
        { itemType: 'armor', itemRarity: 'rare', dropChance: 0.15, quantity: { min: 1, max: 1 } },
        { itemType: 'charm', itemRarity: 'rare', dropChance: 0.12, quantity: { min: 1, max: 1 } },
        { itemType: 'consumable', itemRarity: 'rare', dropChance: 0.30, quantity: { min: 1, max: 2 } }
      );

      if (level >= 10) {
        dropTable.push(
          { itemType: 'weapon', itemRarity: 'epic', dropChance: 0.08, quantity: { min: 1, max: 1 } },
          { itemType: 'armor', itemRarity: 'epic', dropChance: 0.08, quantity: { min: 1, max: 1 } }
        );
      }
      break;

    case 'boss':
      // บอส - ดรอปของดีแน่นอน
      dropTable.push(
        { itemType: 'weapon', itemRarity: 'rare', dropChance: 0.40, quantity: { min: 1, max: 1 } },
        { itemType: 'armor', itemRarity: 'rare', dropChance: 0.40, quantity: { min: 1, max: 1 } },
        { itemType: 'charm', itemRarity: 'rare', dropChance: 0.35, quantity: { min: 1, max: 1 } },
        { itemType: 'weapon', itemRarity: 'epic', dropChance: 0.25, quantity: { min: 1, max: 1 } },
        { itemType: 'armor', itemRarity: 'epic', dropChance: 0.25, quantity: { min: 1, max: 1 } },
        { itemType: 'charm', itemRarity: 'epic', dropChance: 0.20, quantity: { min: 1, max: 1 } },
        { itemType: 'consumable', itemRarity: 'epic', dropChance: 0.50, quantity: { min: 2, max: 5 } }
      );

      if (level >= 15) {
        dropTable.push(
          { itemType: 'weapon', itemRarity: 'legendary', dropChance: 0.10, quantity: { min: 1, max: 1 } },
          { itemType: 'armor', itemRarity: 'legendary', dropChance: 0.10, quantity: { min: 1, max: 1 } }
        );
      }
      break;

    case 'world_boss':
      // บอสใหญ่ - ดรอปของหายากแน่นอน
      dropTable.push(
        { itemType: 'weapon', itemRarity: 'epic', dropChance: 0.60, quantity: { min: 1, max: 2 } },
        { itemType: 'armor', itemRarity: 'epic', dropChance: 0.60, quantity: { min: 1, max: 2 } },
        { itemType: 'charm', itemRarity: 'epic', dropChance: 0.50, quantity: { min: 1, max: 2 } },
        { itemType: 'weapon', itemRarity: 'legendary', dropChance: 0.30, quantity: { min: 1, max: 1 } },
        { itemType: 'armor', itemRarity: 'legendary', dropChance: 0.30, quantity: { min: 1, max: 1 } },
        { itemType: 'charm', itemRarity: 'legendary', dropChance: 0.25, quantity: { min: 1, max: 1 } },
        { itemType: 'consumable', itemRarity: 'legendary', dropChance: 0.80, quantity: { min: 5, max: 10 } }
      );
      break;
  }

  return dropTable;
}

/**
 * สร้างข้อความแสดงรายการไอเทมที่ดรอป
 * @param {Array} items - รายการไอเทมที่ดรอป
 * @returns {String} - ข้อความ
 */
export function formatDropMessage(items) {
  if (!items || items.length === 0) {
    return 'ไม่มีไอเทมดรอป';
  }

  const messages = items.map(item => {
    const rarityEmoji = {
      common: '⚪',
      rare: '🔵',
      epic: '🟣',
      legendary: '🟠'
    };

    const emoji = rarityEmoji[item.rarity] || '⚪';
    const qtyText = item.quantity > 1 ? ` x${item.quantity}` : '';

    return `${emoji} ${item.name}${qtyText}`;
  });

  return messages.join(', ');
}

