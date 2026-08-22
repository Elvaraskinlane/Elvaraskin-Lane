import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      }
    });
    const data = await response.json();
    return NextResponse.json({ models: data.data?.map((m: any) => m.id) || data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
