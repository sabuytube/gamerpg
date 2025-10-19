import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getData, insertData } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า email ซ้ำหรือไม่
    const existingResult = await getData('users', {
      where: { email },
      limit: 1,
    });

    if (
      existingResult.status &&
      existingResult.data &&
      existingResult.data.length > 0
    ) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      provider: 'credentials',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await insertData('users', userData);

    if (!result.status) {
      throw new Error(result.message || 'Failed to create user');
    }

    return NextResponse.json(
      {
        user: {
          id: result.insertedId.toString(),
          name: userData.name,
          email: userData.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
