import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getData, updateData, deleteData } from '@/lib/mongodb';
import { checkPayload } from '@/lib/utils';

// Helper: check if session user is admin
function isAdmin(session) {
  if (!session || !session.user || !session.user.email) return false;
  const adminEnv = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
  if (!adminEnv) return false;
  const admins = adminEnv.split(',').map(a => a.trim().toLowerCase()).filter(Boolean);
  return admins.includes(session.user.email.toLowerCase());
}

// GET - ดึงข้อมูลมอนสเตอร์ตัวเดียว
export async function GET(request, { params }) {
  try {
    const result = await getData('monsters', {
      where: { _id: params.id },
      limit: 1,
    });

    if (!result.status || !result.data || result.data.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลมอนสเตอร์' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      monster: result.data[0],
    });

  } catch (error) {
    console.error('Error fetching monster:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลมอนสเตอร์' },
      { status: 500 }
    );
  }
}

// PATCH - อัพเดทข้อมูลมอนสเตอร์
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const { body } = await checkPayload(request);

    // Add updated timestamp
    body.updatedAt = new Date();

    const result = await updateData('monsters',
      body,
      { _id: params.id }
    );

    if (!result.status || result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลมอนสเตอร์' },
        { status: 404 }
      );
    }

    // Fetch updated monster
    const updated = await getData('monsters', {
      where: { _id: params.id },
      limit: 1,
    });

    return NextResponse.json({
      success: true,
      monster: updated.data[0],
    });

  } catch (error) {
    console.error('Error updating monster:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทมอนสเตอร์' },
      { status: 500 }
    );
  }
}

// DELETE - ลบมอนสเตอร์
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const result = await deleteData('monsters', {
      _id: params.id
    });

    if (!result.status || result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลมอนสเตอร์' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ลบมอนสเตอร์สำเร็จ',
    });

  } catch (error) {
    console.error('Error deleting monster:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบมอนสเตอร์' },
      { status: 500 }
    );
  }
}
