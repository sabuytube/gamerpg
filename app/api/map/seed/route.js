import { NextResponse } from 'next/server';
import { deleteData, insertDataArray } from '@/lib/mongodb';

const sampleMaps = [
	{
		id: 'grassland',
		name: 'ทุ่งหญ้ากว้าง',
		nameEn: 'Grassland',
		icon: '\ud83c\udf3e',
		description: 'ทุ่งหญ้ากว้างที่มีมอนสเตอร์ระดับเริ่มต้น',
		levelRange: [1, 5],
		terrain: 'grassland',
		isSafeZone: false,
	},
	{
		id: 'forest',
		name: 'ป่าไม้',
		nameEn: 'Forest',
		icon: '🌲',
		description: 'ป่าที่เต็มไปด้วยสัตว์ป่าและเส้นทางลับ',
		levelRange: [3, 10],
		terrain: 'forest',
		isSafeZone: false,
	},
	{
		id: 'cave',
		name: 'ถ้ำ',
		nameEn: 'Cave',
		icon: '🕳️',
		description: 'ถ้ำมืดที่มีมอนสเตอร์ชนิดพิเศษและของหายาก',
		levelRange: [5, 15],
		terrain: 'cave',
		isSafeZone: false,
	},
	{
		id: 'desert',
		name: 'ทะเลทราย',
		nameEn: 'Desert',
		icon: '🏜️',
		description: 'ทะเลทรายร้อนระอุ มอนสเตอร์ทนความร้อนสูง',
		levelRange: [7, 20],
		terrain: 'desert',
		isSafeZone: false,
	},
	{
		id: 'ocean',
		name: 'มหาสมุทร',
		nameEn: 'Ocean',
		icon: '🌊',
		description: 'เขตทะเลที่ต้องใช้เรือหรืออุปกรณ์พิเศษในการสำรวจ',
		levelRange: [10, 25],
		terrain: 'ocean',
		isSafeZone: false,
	},
	{
		id: 'ancient_ruins',
		name: 'ซากปรักหักพังโบราณ',
		nameEn: 'Ancient Ruins',
		icon: '🏛️',
		description: 'ซากอารยธรรมที่เต็มไปด้วยกับดักและบอส',
		levelRange: [15, 30],
		terrain: 'ruins',
		isSafeZone: false,
	},
	{
		id: 'dragon_peak',
		name: 'ยอดเขามังกร',
		nameEn: 'Dragon Peak',
		icon: '🗻',
		description: 'ยอดเขาสูงที่เป็นที่อยู่ของมังกรผู้ยิ่งใหญ่',
		levelRange: [20, 40],
		terrain: 'mountain',
		isSafeZone: false,
	},
	{
		id: 'underworld',
		name: 'แดนทมิฬ',
		nameEn: 'Underworld',
		icon: '🔥',
		description: 'แดนมืดแห่งวิญญาณ มีมอนสเตอร์ระดับสูงและบอสโลก',
		levelRange: [25, 60],
		terrain: 'underworld',
		isSafeZone: false,
	},
];

export async function POST() {
	try {
		console.log('🗺️  เริ่ม seed แผนที่ (maps)...');

		const deleteResult = await deleteData('maps', {});
		console.log('🗑️  ลบแผนที่เก่า:', deleteResult.affectedRows || 0);

		const result = await insertDataArray('maps', sampleMaps);
		if (!result.status) throw new Error(result.message || 'Failed to insert maps');

		console.log(`✅ เพิ่มแผนที่ ${result.affectedRows} รายการสำเร็จ`);

		return NextResponse.json({
			success: true,
			message: `Seed Maps สำเร็จ! เพิ่ม ${result.affectedRows} รายการ`,
			count: result.affectedRows,
		});
	} catch (error) {
		console.error('❌ เกิดข้อผิดพลาดในการ Seed Maps:', error);
		return NextResponse.json({ success: false, error: error.message }, { status: 500 });
	}
}

export async function GET() {
	// Allow GET to trigger seeding (so client can use apiService.get)
	return await POST();
}
