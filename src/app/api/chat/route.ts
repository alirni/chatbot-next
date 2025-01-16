import { openai } from '@/app/utils/openai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ content: message, role: 'user' }],
    });

    return NextResponse.json(response.choices[0].message.content);
  } catch (error: any) {
    console.error(error.response?.data || error.message);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
