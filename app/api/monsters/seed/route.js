import { NextResponse } from 'next/server';
import { deleteData, insertDataArray } from '@/lib/mongodb';
import { generateDropTable } from '@/lib/game/drop';

// ตัวอย่างมอนสเตอร์ 10 ตัว
const sampleMonsters = [
  {
    name: 'สไลม์น้อย',
    nameEn: 'Baby Slime',
    icon: '👾',
    description: 'สไลม์ตัวเล็กที่อ่อนแอ เหมาะสำหรับผู้เริ่มต้น',
    type: 'normal',
    level: 1,
    stats: {
      hp: 50,
      attack: 5,
      defense: 2,
      speed: 3,
    },
    rewards: {
      exp: { min: 5, max: 10 },
      gold: { min: 2, max: 5 },
      dropRate: 0.2,
    },
    dropTable: generateDropTable('normal', 1),
    spawnInfo: {
      respawnTime: 30,
      location: 'grassland',
      maxSpawn: 5,
    },
    skills: ['tackle'],
    isActive: true,
  },
  {
    name: 'หมาป่าดุร้าย',
    nameEn: 'Wild Wolf',
    icon: '🐺',
    description: 'หมาป่าที่โหดเหี้ยม มักโจมตีเป็นฝูง',
    type: 'normal',
    level: 3,
    stats: {
      hp: 120,
      attack: 15,
      defense: 8,
      speed: 12,
    },
    rewards: {
      exp: { min: 15, max: 25 },
      gold: { min: 8, max: 15 },
      dropRate: 0.3,
    },
    dropTable: generateDropTable('normal', 3),
    spawnInfo: {
      respawnTime: 60,
      location: 'forest',
      maxSpawn: 3,
    },
    skills: ['bite', 'howl'],
    isActive: true,
  },
  {
    name: 'ค้างคาวแวมไพร์',
    nameEn: 'Vampire Bat',
    icon: '🦇',
    description: 'ค้างคาวดูดเลือดที่อาศัยในถ้ำมืด',
    type: 'normal',
    level: 5,
    stats: {
      hp: 150,
      attack: 20,
      defense: 10,
      speed: 18,
    },
    rewards: {
      exp: { min: 25, max: 40 },
      gold: { min: 15, max: 25 },
      dropRate: 0.35,
    },
    dropTable: generateDropTable('normal', 5),
    spawnInfo: {
      respawnTime: 90,
      location: 'cave',
      maxSpawn: 4,
    },
    skills: ['blood_drain', 'sonic_screech'],
    isActive: true,
  },
  {
    name: 'แมงป่องพิษ',
    nameEn: 'Poison Scorpion',
    icon: '🦂',
    description: 'แมงป่องขนาดใหญ่ที่มีพิษร้ายแรง',
    type: 'elite',
    level: 7,
    stats: {
      hp: 300,
      attack: 35,
      defense: 20,
      speed: 10,
    },
    rewards: {
      exp: { min: 50, max: 80 },
      gold: { min: 30, max: 50 },
      dropRate: 0.5,
    },
    dropTable: generateDropTable('elite', 7),
    spawnInfo: {
      respawnTime: 180,
      location: 'desert',
      maxSpawn: 2,
    },
    skills: ['poison_sting', 'tail_whip'],
    isActive: true,
  },
  {
    name: 'งูยักษ์',
    nameEn: 'Giant Python',
    icon: '🐍',
    description: 'งูยักษ์ที่สามารถกลืนเหยื่อทั้งตัว',
    type: 'elite',
    level: 10,
    stats: {
      hp: 500,
      attack: 45,
      defense: 25,
      speed: 15,
    },
    rewards: {
      exp: { min: 80, max: 120 },
      gold: { min: 50, max: 80 },
      dropRate: 0.6,
    },
    dropTable: generateDropTable('elite', 10),
    spawnInfo: {
      respawnTime: 240,
      location: 'jungle',
      maxSpawn: 1,
    },
    skills: ['constrict', 'venom_bite', 'swallow'],
    isActive: true,
  },
  {
    name: 'ฉลามดำ',
    nameEn: 'Black Shark',
    icon: '🦈',
    description: 'ฉลามขนาดใหญ่ที่อาศัยในน่านน้ำลึก',
    type: 'elite',
    level: 12,
    stats: {
      hp: 600,
      attack: 55,
      defense: 30,
      speed: 20,
    },
    rewards: {
      exp: { min: 100, max: 150 },
      gold: { min: 70, max: 100 },
      dropRate: 0.65,
    },
    dropTable: generateDropTable('elite', 12),
    spawnInfo: {
      respawnTime: 300,
      location: 'ocean',
      maxSpawn: 1,
    },
    skills: ['razor_bite', 'tail_slam', 'water_jet'],
    isActive: true,
  },
  {
    name: 'ไทแรนโนซอรัส',
    nameEn: 'T-Rex',
    icon: '🦖',
    description: 'ไดโนเสาร์กินเนื้อที่ดุร้ายที่สุด',
    type: 'boss',
    level: 15,
    stats: {
      hp: 1500,
      attack: 80,
      defense: 50,
      speed: 12,
    },
    rewards: {
      exp: { min: 200, max: 300 },
      gold: { min: 150, max: 250 },
      dropRate: 0.8,
    },
    dropTable: generateDropTable('boss', 15),
    spawnInfo: {
      respawnTime: 600,
      location: 'ancient_ruins',
      maxSpawn: 1,
    },
    skills: ['devastating_bite', 'tail_swipe', 'roar', 'rampage'],
    isActive: true,
  },
  {
    name: 'ซอมบี้ลอร์ด',
    nameEn: 'Zombie Lord',
    icon: '🧟',
    description: 'ราชาแห่งซอมบี้ที่ควบคุมกองทัพอันเดด',
    type: 'boss',
    level: 18,
    stats: {
      hp: 2000,
      attack: 90,
      defense: 60,
      speed: 8,
    },
    rewards: {
      exp: { min: 300, max: 450 },
      gold: { min: 200, max: 350 },
      dropRate: 0.85,
    },
    dropTable: generateDropTable('boss', 18),
    spawnInfo: {
      respawnTime: 720,
      location: 'cemetery',
      maxSpawn: 1,
    },
    skills: ['death_grip', 'plague_cloud', 'summon_undead', 'life_drain'],
    isActive: true,
  },
  {
    name: 'ราชามังกรไฟ',
    nameEn: 'Fire Dragon King',
    icon: '🐉',
    description: 'มังกรไฟที่ทรงพลังที่สุดในดินแดน',
    type: 'world_boss',
    level: 25,
    stats: {
      hp: 5000,
      attack: 150,
      defense: 100,
      speed: 15,
    },
    rewards: {
      exp: { min: 800, max: 1200 },
      gold: { min: 500, max: 800 },
      dropRate: 0.95,
    },
    dropTable: generateDropTable('world_boss', 25),
    spawnInfo: {
      respawnTime: 1800,
      location: 'dragon_peak',
      maxSpawn: 1,
    },
    skills: ['fire_breath', 'meteor_strike', 'dragon_claw', 'inferno', 'fly'],
    isActive: true,
  },
  {
    name: 'จอมยมทูต',
    nameEn: 'Death Reaper',
    icon: '💀',
    description: 'ผู้นำวิญญาณสู่ความตาย อมตะและทรงพลัง',
    type: 'world_boss',
    level: 30,
    stats: {
      hp: 8000,
      attack: 200,
      defense: 120,
      speed: 18,
    },
    rewards: {
      exp: { min: 1500, max: 2000 },
      gold: { min: 1000, max: 1500 },
      dropRate: 1.0,
    },
    dropTable: generateDropTable('world_boss', 30),
    spawnInfo: {
      respawnTime: 3600,
      location: 'underworld',
      maxSpawn: 1,
    },
    skills: ['soul_reap', 'death_scythe', 'dark_aura', 'curse', 'resurrection'],
    isActive: true,
  },
];

export async function POST() {
  try {
    // ลบข้อมูลเก่า (ถ้ามี)
    const deleteResult = await deleteData('monsters', {});
    console.log('🗑️  Cleared existing monsters:', deleteResult.affectedRows || 0);

    // เพิ่มข้อมูลให��่
    const result = await insertDataArray('monsters', sampleMonsters);

    if (!result.status) {
      console.error('❌ Failed to insert monsters:', result.message);
      return NextResponse.json({ success: false, error: result.message || 'Failed to insert monsters' }, { status: 500 });
    }

    console.log(`✨ Added ${result.affectedRows} monsters successfully!`);

    return NextResponse.json({
      success: true,
      message: `เพิ่มมอนสเตอร์สำเร็จ ${result.affectedRows} ตัว (พร้อม Drop Table)`,
      count: result.affectedRows,
    });
  } catch (error) {
    console.error('❌ Error seeding monsters:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Allow GET to trigger seeding (so client can use apiService.get)
  return await POST();
}
