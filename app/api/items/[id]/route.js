import { NextResponse } from 'next/server';
import { getData, updateData, deleteData } from '@/lib/mongodb';

// GET /api/items/[id] - ดึงไอเทมเฉพาะ
export async function GET(request, { params }) {
  try {
    const result = await getData('items', {
      where: { _id: params.id },
      limit: 1,
    });

    if (!result.status || !result.data || result.data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบไอเทม' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item: result.data[0],
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถดึงข้อมูลไอเทมได้' },
      { status: 500 }
    );
  }
}

// PATCH /api/items/[id] - อัพเดทไอเทม
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();

    // Add updated timestamp
    body.updatedAt = new Date();

    const result = await updateData('items',
      body,
      { _id: params.id }
    );

    if (!result.status || result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบไอเทม' },
        { status: 404 }
      );
    }

    // Fetch updated item
    const updated = await getData('items', {
      where: { _id: params.id },
      limit: 1,
    });

    return NextResponse.json({
      success: true,
      item: updated.data[0],
      message: 'อัพเดทไอเทมสำเร็จ',
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถอัพเดทไอเทมได้' },
      { status: 500 }
    );
  }
}

// DELETE /api/items/[id] - ลบไอเทม
export async function DELETE(request, { params }) {
  try {
    const result = await deleteData('items', {
      _id: params.id
    });

    if (!result.status || result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบไอเทม' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบไอเทมสำเร็จ',
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถลบไอเทมได้' },
      { status: 500 }
    );
  }
}
