import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const text = searchParams.get('text') || 'Hello';
    const cleanText = text.slice(0, 200);

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=en&client=tw-ob`;

    const res = await fetch(ttsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
    });

    if (!res.ok) {
      throw new Error(`TTS server response error: ${res.status}`);
    }

    const audioBuffer = await res.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'TTS request' }, { status: 200 });
  }
}
