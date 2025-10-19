import { NextResponse } from 'next/server';
import { deleteData, insertDataArray } from '@/lib/mongodb';
import { CHARACTER_CLASSES } from '@/lib/game/classes';

// CHARACTER_CLASSES is serializable and can be inserted directly.
export async function POST() {
  try {
    console.log('🧭 เริ่ม seed คลาสตัวละคร (classes)...');

    const deleteResult = await deleteData('classes', {});
    console.log('🗑️  ลบคลาสเก่า:', deleteResult.affectedRows || 0);

    const result = await insertDataArray('classes', CHARACTER_CLASSES);
    if (!result.status) throw new Error(result.message || 'Failed to insert classes');

    console.log(`✅ เพิ่มคลาส ${result.affectedRows} รายการสำเร็จ`);

    return NextResponse.json({
      success: true,
      message: `Seed Classes สำเร็จ! เพิ่ม ${result.affectedRows} รายการ`,
      count: result.affectedRows,
    });
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการ Seed Classes:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Allow GET to trigger seeding (so client can use apiService.get)
  return await POST();
}
