import { NextResponse } from 'next/server';
import { getData, insertData } from '@/lib/mongodb';

// GET /api/items - ดึงรายการไอเทมทั้งหมด
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const rarity = searchParams.get('rarity');
    const limit = parseInt(searchParams.get('limit')) || 100;

    // Build query options
    const options = { limit };

    if (type || rarity) {
      options.where = {};
      if (type) options.where.type = type;
      if (rarity) options.where.rarity = rarity;
    } else {
      options.all = true;
    }

    const result = await getData('items', options);

    if (!result.status) {
      throw new Error(result.message || 'Failed to fetch items');
    }

    return NextResponse.json({
      success: true,
      items: result.data,
      count: result.data.length,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถดึงข้อมูลไอเทมได้' },
      { status: 500 }
    );
  }
}

// POST /api/items - สร้างไอเทมใหม่
export async function POST(request) {
  try {
    const body = await request.json();

    // Add timestamps
    body.createdAt = new Date();
    body.updatedAt = new Date();

    const result = await insertData('items', body);

    if (!result.status) {
      throw new Error(result.message || 'Failed to create item');
    }

    return NextResponse.json({
      success: true,
      item: { _id: result.insertedId, ...body },
      message: 'สร้างไอเทมสำเร็จ',
    });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถสร้างไอเทมได้' },
      { status: 500 }
    );
  }
}
