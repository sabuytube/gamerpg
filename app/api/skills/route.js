import { NextResponse } from 'next/server';
import { getData, insertData } from '@/lib/mongodb';

// GET /api/skills - return list of skills
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 100;

    const result = await getData('skills', { all: true, limit });

    if (!result.status) {
      throw new Error(result.message || 'Failed to fetch skills');
    }

    return NextResponse.json({ success: true, skills: result.data, count: result.data.length });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}

// POST /api/skills - create a new skill
export async function POST(request) {
  try {
    const body = await request.json();

    // sanitize/minimal defaults
    const payload = {
      id: body.id || body._id || null,
      name: body.name || '',
      mp: typeof body.mp === 'number' ? body.mp : parseInt(body.mp) || 0,
      desc: body.desc || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await insertData('skills', payload);

    if (!result.status) {
      throw new Error(result.message || 'Failed to create skill');
    }

    return NextResponse.json({ success: true, skill: { _id: result.insertedId, ...payload }, message: 'Skill created' });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}

