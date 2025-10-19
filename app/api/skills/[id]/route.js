import { NextResponse } from 'next/server';
import { getData, updateData, deleteData } from '@/lib/mongodb';

// GET /api/skills/[id] - ดึงทักษะเฉพาะ
export async function GET(request, { params }) {
  try {
    const result = await getData('skills', {
      where: { _id: params.id },
      limit: 1,
    });

    if (!result.status || !result.data || result.data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบทักษะ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      skill: result.data[0],
    });
  } catch (error) {
    console.error('Error fetching skill:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถดึงข้อมูลทักษะได้' },
      { status: 500 }
    );
  }
}

// PATCH /api/skills/[id] - อัพเดททักษะ
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();

    // Add updated timestamp
    body.updatedAt = new Date();

    const result = await updateData('skills',
      body,
      { _id: params.id }
    );

    if (!result.status || result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบทักษะ' },
        { status: 404 }
      );
    }

    // Fetch updated skill
    const updated = await getData('skills', {
      where: { _id: params.id },
      limit: 1,
    });

    return NextResponse.json({
      success: true,
      skill: updated.data[0],
      message: 'อัพเดททักษะสำเร็จ',
    });
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถอัพเดททักษะได้' },
      { status: 500 }
    );
  }
}

// DELETE /api/skills/[id] - ลบทักษะ
export async function DELETE(request, { params }) {
  try {
    const result = await deleteData('skills', {
      _id: params.id
    });

    if (!result.status || result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบทักษะ' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบทักษะสำเร็จ',
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถลบทักษะได้' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { getData, insertData } from '@/lib/mongodb';

// GET /api/skills - ดึงรายการทักษะทั้งหมด
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;

    const result = await getData('skills', { all: true, limit });

    if (!result.status) {
      throw new Error(result.message || 'Failed to fetch skills');
    }

    return NextResponse.json({
      success: true,
      skills: result.data,
      count: result.data.length,
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถดึงข้อมูลทักษะได้' },
      { status: 500 }
    );
  }
}

// POST /api/skills - สร้างทักษะใหม่
export async function POST(request) {
  try {
    const body = await request.json();

    // Add timestamps
    body.createdAt = new Date();
    body.updatedAt = new Date();

    const result = await insertData('skills', body);

    if (!result.status) {
      throw new Error(result.message || 'Failed to create skill');
    }

    return NextResponse.json({
      success: true,
      skill: { _id: result.insertedId, ...body },
      message: 'สร้างทักษะสำเร็จ',
    });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถสร้างทักษะได้' },
      { status: 500 }
    );
  }
}

