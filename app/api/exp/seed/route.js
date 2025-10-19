import { NextResponse } from 'next/server';
import { deleteData, insertDataArray } from '@/lib/mongodb';

function generateExpTable(maxLevel = 100) {
  const rows = [];
  let total = 0;

  // We'll use a quadratic curve: expToNext = Math.round(100 * level^2)
  // This gives gentle growth and is easy to tune later.
  for (let level = 1; level <= maxLevel; level++) {
    const expToNext = Math.round(100 * Math.pow(level, 2));
    total += expToNext;
    rows.push({ level, expToNext, totalExp: total });
  }

  return rows;
}

const expTable = generateExpTable(100);

export async function POST() {
  try {
    console.log('📈 เริ่ม seed ตาราง EXP (1..100)...');

    const deleteResult = await deleteData('exp', {});
    console.log('🗑️  ลบข้อมูล EXP เก่า:', deleteResult.affectedRows || 0);

    const result = await insertDataArray('exp', expTable);
    if (!result.status) {
      console.error('❌ Failed to insert exp table:', result.message);
      return NextResponse.json({ success: false, error: result.message || 'Failed to insert exp table' }, { status: 500 });
    }

    console.log(`✅ เพิ่มระดับ EXP ${result.affectedRows} เร็คคอร์ดสำเร็จ`);

    return NextResponse.json({
      success: true,
      message: `Seed EXP สำเร็จ! เพิ่ม ${result.affectedRows} ระดับ (1..100)`,
      count: result.affectedRows,
    });
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการ Seed EXP:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Allow GET to trigger seeding (so client can use apiService.get)
  return await POST();
}
