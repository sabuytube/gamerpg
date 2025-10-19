import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getData, insertData, updateData } from '@/lib/mongodb';
import { checkPayload } from '@/lib/utils';

// GET - ดึงข้อมูลตัวละครของผู้ใช้
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    // Safe to log now that session exists
    console.log({ userId: session.user.id, isActive: true })

    // ดึงตัวละครที่ active ของผู้ใช้
    const result = await getData('characters', {
      where: { userId: session.user.id, isActive: true },
      orderBy: 'createdAt DESC',
      limit: 1,
    });

    if (!result.status || !result.data || result.data.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลตัวละคร' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      character: result.data[0],
    });

  } catch (error) {
    console.error('Error fetching character:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลตัวละคร' },
      { status: 500 }
    );
  }
}

// POST - สร้างตัวละครใหม่
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
    const { name, class: characterClass, stats } = body;

    if (!name || !characterClass) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // ปิดการใช้งานตัวละครเก่า (ถ้ามี)
    await updateData('characters',
      { isActive: false },
      { userId: session.user.id, isActive: true }
    );

    // สร้างตัวละครใหม่
    const characterData = {
      userId: session.user.id,
      name,
      class: {
        id: characterClass.id,
        name: characterClass.name,
        nameEn: characterClass.nameEn,
        icon: characterClass.icon,
      },
      stats: stats || characterClass.baseStats,
      level: 1,
      exp: 0,
      expToNext: 20,
      equipment: {
        weapon: null,
        armor: null,
        charm: null,
      },
      inventory: [],
      dungeonProgress: {
        dungeonIndex: 0,
        roomIndex: 0,
      },
      gold: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await insertData('characters', characterData);

    if (!result.status) {
      throw new Error(result.message || 'Failed to create character');
    }

    return NextResponse.json({
      success: true,
      character: { _id: result.insertedId, ...characterData },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating character:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างตัวละคร' },
      { status: 500 }
    );
  }
}

// PATCH - อัพเดทข้อมูลตัวละคร
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบ' },
        { status: 401 }
      );
    }

    const { body } = await checkPayload(request);

    // ตรวจสอบว่ามีตัวละครหรือไม่
    const checkResult = await getData('characters', {
      where: { userId: session.user.id, isActive: true },
      limit: 1,
    });

    if (!checkResult.status || !checkResult.data || checkResult.data.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลตัวละคร' },
        { status: 404 }
      );
    }

    // กรองข้อมูลที่อัพเดทได้
    const updateFields = { ...body };
    delete updateFields.userId;
    delete updateFields._id;
    updateFields.updatedAt = new Date();

    // อัพเดทข้อมูล
    const result = await updateData('characters',
      updateFields,
      { userId: session.user.id, isActive: true }
    );

    if (!result.status) {
      throw new Error(result.message || 'Failed to update character');
    }

    // ดึงข้อมูลที่อัพเดทแล้ว
    const updatedResult = await getData('characters', {
      where: { userId: session.user.id, isActive: true },
      limit: 1,
    });

    return NextResponse.json({
      success: true,
      character: updatedResult.data[0],
    });

  } catch (error) {
    console.error('Error updating character:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทตัวละคร' },
      { status: 500 }
    );
  }
}
