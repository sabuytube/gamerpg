import { NextResponse } from 'next/server';
import { deleteData, insertDataArray } from '@/lib/mongodb';
import { SKILLS } from '@/lib/game/skills';

// SKILLS contains function references which are not serializable for DB.
// We'll persist only the serializable metadata (id, name, mp, desc).
const serializableSkills = SKILLS.map(s => ({
  id: s.id,
  name: s.name,
  mp: s.mp ?? 0,
  desc: s.desc ?? '',
}));

export async function POST() {
  try {
    console.log('✨ เริ่ม seed ทักษะ (skills)...');

    const deleteResult = await deleteData('skills', {});
    console.log('🗑️  ลบทักษะเก่า:', deleteResult.affectedRows || 0);

    const result = await insertDataArray('skills', serializableSkills);
    if (!result.status) throw new Error(result.message || 'Failed to insert skills');

    console.log(`✅ เพิ่มทักษะ ${result.affectedRows} รายการสำเร็จ`);

    return NextResponse.json({
      success: true,
      message: `Seed Skills สำเร็จ! เพิ่ม ${result.affectedRows} รายการ`,
      count: result.affectedRows,
    });
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการ Seed Skills:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Allow GET to trigger seeding (so client can use apiService.get)
  return await POST();
}
