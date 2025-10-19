import { NextResponse } from 'next/server';
import { getData, insertData } from '@/lib/mongodb';

// GET /api/classes - ดึงรายการคลาสทั้งหมด
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;

    const result = await getData('classes', { all: true, limit });

    if (!result.status) {
      return NextResponse.json({ success: false, error: result.message || 'Failed to fetch classes' }, { status: 500 });
    }

    return NextResponse.json({ success: true, classes: result.data, count: result.data.length });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ success: false, error: error.message || 'ไม่สามารถดึงข้อมูลคลาสได้' }, { status: 500 });
  }
}

// POST (optional) - สร้างคลาสใหม่
export async function POST(request) {
  try {
    const body = await request.json();
    body.createdAt = new Date();
    body.updatedAt = new Date();

    const result = await insertData('classes', body);
    if (!result.status) {
      return NextResponse.json({ success: false, error: result.message || 'Failed to create class' }, { status: 500 });
    }

    return NextResponse.json({ success: true, class: { _id: result.insertedId, ...body }, message: 'Class created' });
  } catch (error) {
    console.error('Error creating class:', error);
    return NextResponse.json({ success: false, error: error.message || 'ไม่สามารถสร้างคลาสได้' }, { status: 500 });
  }
}
