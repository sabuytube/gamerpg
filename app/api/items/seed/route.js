import { NextResponse } from 'next/server';
import { deleteData, insertDataArray } from '@/lib/mongodb';

const sampleItems = [
  // ===== WEAPONS =====
  {
    name: 'ดาบเหล็กสนิม',
    type: 'weapon',
    slot: 'weapon',
    rarity: 'common',
    description: 'ดาบเหล็กธรรมดาที่มีรอยสนิม',
    stats: { STR: 2, DEX: 1 },
    icon: '🗡️',
    level: 1,
    price: 50,
    sellPrice: 10,
  },
  {
    name: 'ดาบเหล็กกล้า',
    type: 'weapon',
    slot: 'weapon',
    rarity: 'rare',
    description: 'ดาบที่หล่อจากเหล็กกล้าคุณภาพดี',
    stats: { STR: 5, DEX: 2 },
    icon: '⚔️',
    level: 5,
    price: 200,
    sellPrice: 40,
  },
  {
    name: 'ดาบเงา',
    type: 'weapon',
    slot: 'weapon',
    rarity: 'epic',
    description: 'ดาบลึกลับที่หลอมจากเงามืด',
    stats: { STR: 8, DEX: 5, AGI: 3 },
    icon: '🗡️',
    level: 10,
    price: 500,
    sellPrice: 100,
  },
  {
    name: 'ดาบเทพเจ้า',
    type: 'weapon',
    slot: 'weapon',
    rarity: 'legendary',
    description: 'ดาบศักดิ์สิทธิ์ที่เทพเจ้ามอบให้',
    stats: { STR: 15, DEX: 8, AGI: 5, INT: 3 },
    icon: '⚔️',
    level: 20,
    price: 2000,
    sellPrice: 500,
  },
  {
    name: 'คทาไม้',
    type: 'weapon',
    slot: 'weapon',
    rarity: 'common',
    description: 'คทาไม้ธรรมดาสำหรับนักเวทย์',
    stats: { INT: 3, STR: 1 },
    icon: '🪄',
    level: 1,
    price: 50,
    sellPrice: 10,
  },
  {
    name: 'คทาคริสตัล',
    type: 'weapon',
    slot: 'weapon',
    rarity: 'epic',
    description: 'คทาที่ประดับด้วยคริสตัลมหัศจรรย์',
    stats: { INT: 10, DEX: 3, LUK: 2 },
    icon: '✨',
    level: 12,
    price: 600,
    sellPrice: 120,
  },
  {
    name: 'ธนูไม้',
    type: 'weapon',
    slot: 'weapon',
    rarity: 'common',
    description: 'ธนูไม้ธรรมดาที่ทำจากไม้ยืน',
    stats: { DEX: 3, AGI: 2 },
    icon: '🏹',
    level: 2,
    price: 60,
    sellPrice: 12,
  },
  {
    name: 'ธนูเงิน',
    type: 'weapon',
    slot: 'weapon',
    rarity: 'rare',
    description: 'ธนูที่หล่อจากเงินบริสุทธิ์',
    stats: { DEX: 6, AGI: 4, LUK: 2 },
    icon: '🏹',
    level: 8,
    price: 300,
    sellPrice: 60,
  },

  // ===== ARMOR =====
  {
    name: 'เสื้อผ้าขาด',
    type: 'armor',
    slot: 'armor',
    rarity: 'common',
    description: 'เสื้อผ้าธรรมดาที่มีรอยขาด',
    stats: { VIT: 2 },
    icon: '👕',
    level: 1,
    price: 40,
    sellPrice: 8,
  },
  {
    name: 'เกราะหนัง',
    type: 'armor',
    slot: 'armor',
    rarity: 'common',
    description: 'เกราะหนังที่ป้องกันได้พอสมควร',
    stats: { VIT: 3, DEX: 1 },
    icon: '🦺',
    level: 3,
    price: 100,
    sellPrice: 20,
  },
  {
    name: 'เกราะเหล็ก',
    type: 'armor',
    slot: 'armor',
    rarity: 'rare',
    description: 'เกราะเหล็กหนาที่ป้องกันได้ดี',
    stats: { VIT: 6, STR: 2 },
    icon: '🛡️',
    level: 7,
    price: 250,
    sellPrice: 50,
  },
  {
    name: 'เกราะมังกร',
    type: 'armor',
    slot: 'armor',
    rarity: 'epic',
    description: 'เกราะที่ทำจากเกล็ดมังกร',
    stats: { VIT: 10, STR: 4, AGI: 2 },
    icon: '🐉',
    level: 15,
    price: 800,
    sellPrice: 160,
  },
  {
    name: 'เกราะศักดิ์สิทธิ์',
    type: 'armor',
    slot: 'armor',
    rarity: 'legendary',
    description: 'เกราะที่ได้รับพรจากเทพเจ้า',
    stats: { VIT: 18, STR: 6, INT: 4, AGI: 3 },
    icon: '✨',
    level: 20,
    price: 2500,
    sellPrice: 600,
  },
  {
    name: 'เสื้อคลุมผ้าไหม',
    type: 'armor',
    slot: 'armor',
    rarity: 'rare',
    description: 'เสื้อคลุมที่ทอจากผ้าไหมนุ่มนวล',
    stats: { INT: 4, VIT: 3, AGI: 2 },
    icon: '🧥',
    level: 6,
    price: 220,
    sellPrice: 44,
  },

  // ===== CHARMS =====
  {
    name: 'จี้ไม้',
    type: 'charm',
    slot: 'charm',
    rarity: 'common',
    description: 'จี้ไม้ธรรมดาที่แกะสลักอย่างง่าย',
    stats: { LUK: 1 },
    icon: '📿',
    level: 1,
    price: 30,
    sellPrice: 6,
  },
  {
    name: 'แหวนเงิน',
    type: 'charm',
    slot: 'charm',
    rarity: 'rare',
    description: 'แหวนเงินที่ประดับด้วยอัญมณี',
    stats: { LUK: 3, INT: 2 },
    icon: '💍',
    level: 5,
    price: 180,
    sellPrice: 36,
  },
  {
    name: 'สร้อยคอทับทิม',
    type: 'charm',
    slot: 'charm',
    rarity: 'epic',
    description: 'สร้อยคอที่ประดับด้วยทับทิมแดงสด',
    stats: { LUK: 5, STR: 3, VIT: 2 },
    icon: '📿',
    level: 10,
    price: 450,
    sellPrice: 90,
  },
  {
    name: 'ตาเทพ',
    type: 'charm',
    slot: 'charm',
    rarity: 'legendary',
    description: 'จี้ลึกลับที่มีดวงตาของเทพเจ้า',
    stats: { LUK: 10, INT: 6, AGI: 4, DEX: 4 },
    icon: '👁️',
    level: 18,
    price: 1800,
    sellPrice: 400,
  },
  {
    name: 'แหวนมังกร',
    type: 'charm',
    slot: 'charm',
    rarity: 'epic',
    description: 'แหวนที่มีพลังของมังกรโบราณ',
    stats: { STR: 4, VIT: 4, LUK: 2 },
    icon: '💍',
    level: 12,
    price: 500,
    sellPrice: 100,
  },
  {
    name: 'สร้อยไข่มุกดำ',
    type: 'charm',
    slot: 'charm',
    rarity: 'rare',
    description: 'สร้อยคอที่ประดับด้วยไข่มุกดำหายาก',
    stats: { INT: 3, LUK: 3, AGI: 1 },
    icon: '📿',
    level: 7,
    price: 280,
    sellPrice: 56,
  },

  // ===== CONSUMABLES =====
  {
    name: 'ยาฟื้นฟู HP เล็ก',
    type: 'consumable',
    rarity: 'common',
    description: 'ฟื้นฟู HP 50 หน่วย',
    stats: { healHP: 50 },
    icon: '🧪',
    level: 1,
    price: 20,
    sellPrice: 4,
    stackable: true,
    maxStack: 99,
  },
  {
    name: 'ยาฟื้นฟู HP กลาง',
    type: 'consumable',
    rarity: 'rare',
    description: 'ฟื้นฟู HP 150 หน่วย',
    stats: { healHP: 150 },
    icon: '🧪',
    level: 5,
    price: 50,
    sellPrice: 10,
    stackable: true,
    maxStack: 99,
  },
  {
    name: 'ยาฟื้นฟู HP ใหญ่',
    type: 'consumable',
    rarity: 'epic',
    description: 'ฟื้นฟู HP 300 หน่วย',
    stats: { healHP: 300 },
    icon: '🧪',
    level: 10,
    price: 100,
    sellPrice: 20,
    stackable: true,
    maxStack: 99,
  },
  {
    name: 'ยาฟื้นฟู MP เล็ก',
    type: 'consumable',
    rarity: 'common',
    description: 'ฟื้นฟู MP 30 หน่วย',
    stats: { healMP: 30 },
    icon: '💊',
    level: 1,
    price: 15,
    sellPrice: 3,
    stackable: true,
    maxStack: 99,
  },
  {
    name: 'ยาฟื้นฟู MP กลาง',
    type: 'consumable',
    rarity: 'rare',
    description: 'ฟื้นฟู MP 80 หน่วย',
    stats: { healMP: 80 },
    icon: '💊',
    level: 5,
    price: 40,
    sellPrice: 8,
    stackable: true,
    maxStack: 99,
  },
];

export async function POST() {
  try {
    console.log('🔗 กำลังเชื่อมต่อ MongoDB...');

    console.log('🗑️  กำลังลบข้อมูลไอเทมเก่า...');
    const deleteResult = await deleteData('items', {});
    console.log(`🗑️  ลบไอเทมเก่า ${deleteResult.affectedRows || 0} รายการ`);

    console.log('📦 กำลังเพิ่มข้อมูลไอเทมใหม่...');
    const result = await insertDataArray('items', sampleItems);

    if (!result.status) {
      throw new Error(result.message || 'Failed to insert items');
    }

    console.log(`✅ เพิ่มไอเทม ${result.affectedRows} รายการสำเร็จ`);

    // สรุปผล
    const weaponCount = sampleItems.filter(i => i.type === 'weapon').length;
    const armorCount = sampleItems.filter(i => i.type === 'armor').length;
    const charmCount = sampleItems.filter(i => i.type === 'charm').length;
    const consumableCount = sampleItems.filter(i => i.type === 'consumable').length;

    console.log('\n📊 สรุป:');
    console.log(`  🗡️  อาวุธ: ${weaponCount} ชิ้น`);
    console.log(`  🛡️  เกราะ: ${armorCount} ชิ้น`);
    console.log(`  ✨ เครื่องราง: ${charmCount} ชิ้น`);
    console.log(`  🧪 ของใช้: ${consumableCount} ชิ้น`);

    return NextResponse.json({
      success: true,
      message: `Seed Items สำเร็จ! เพิ่ม ${result.affectedRows} รายการ`,
      count: result.affectedRows,
      summary: {
        weapons: weaponCount,
        armor: armorCount,
        charms: charmCount,
        consumables: consumableCount,
      },
    });
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการ Seed Items:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);

    return NextResponse.json(
      {
        success: false,
        error: 'ไม่สามารถ Seed Items ได้',
        details: error.message,
        errorName: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Allow GET to trigger seeding (so client can use apiService.get)
  return await POST();
}
