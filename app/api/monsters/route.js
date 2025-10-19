import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Monster from '@/models/Monster';
import { checkPayload } from '@/lib/utils';

// GET - ดึงรายการมอนสเตอร์ทั้งหมด
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    const isActive = searchParams.get('isActive');

    let query = {};

    if (type) query.type = type;
    if (level) query.level = parseInt(level);
    if (isActive !== null && isActive !== undefined) query.isActive = isActive === 'true';

    const monsters = await Monster.find(query).sort({ level: 1, type: 1 });

    return NextResponse.json({
      success: true,
      monsters,
      count: monsters.length,
    });

  } catch (error) {
    console.error('Error fetching monsters:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลมอนสเตอร์' },
      { status: 500 }
    );
  }
}

// POST - สร้างมอนสเตอร์ใหม่
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const { body } = await checkPayload(request);

    await connectDB();

    const newMonster = await Monster.create(body);

    return NextResponse.json({
      success: true,
      monster: newMonster,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating monster:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการสร้างมอนสเตอร์' },
      { status: 500 }
    );
  }
}


