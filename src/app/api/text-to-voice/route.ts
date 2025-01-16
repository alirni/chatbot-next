import { openai } from '@/app/utils/openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    });

    // Convert the Response object to a Buffer
    const audioBuffer = await response.arrayBuffer();

    // Convert Buffer to Base64 (for sending to frontend)
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    // Return the Base64-encoded audio
    return NextResponse.json({ audio: `data:audio/wav;base64,${base64Audio}` });
  } catch (error: any) {
    console.error(
      'Error calling OpenAI API:',
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
