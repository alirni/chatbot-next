import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/app/utils/openai';
import { Uploadable } from 'openai/uploads.mjs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: formData.get('audio') as Uploadable,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
