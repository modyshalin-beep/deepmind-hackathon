import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const clientApiKey = (formData.get('apiKey') as string) || '';
    const localTranscript = (formData.get('localTranscript') as string) || '';
    const disciplineId = (formData.get('disciplineId') as string) || 'yoga';
    const skillLevel = (formData.get('skillLevel') as string) || 'beginner';

    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (apiKey && audioFile) {
      try {
        const rawType = audioFile.type || 'audio/webm';
        const cleanMimeType = rawType.split(';')[0].trim() || 'audio/webm';
        const arrayBuffer = await audioFile.arrayBuffer();
        const base64Audio = Buffer.from(arrayBuffer).toString('base64');

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: cleanMimeType,
                    data: base64Audio,
                  },
                },
                {
                  text: `Analyze the student's voice audio for ${disciplineId} (${skillLevel} level).
Return JSON strictly in this format:
{"userTranscript": "<exact words student spoke>", "responseText": "<short 12-word coach answer>"}`,
                },
              ],
            },
          ],
        });

        const outputText = response.text || '';
        const match = outputText.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          return NextResponse.json({
            userTranscript: parsed.userTranscript || localTranscript || 'Student question',
            responseText: parsed.responseText || `I heard your question! Let's check Step 1 stance together.`,
          });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call warning:', geminiError?.message || geminiError);
      }
    }

    // Dynamic fallback using what the student actually spoke
    const actualTranscript = localTranscript.trim() || 'How do I position my posture?';
    return NextResponse.json({
      userTranscript: actualTranscript,
      responseText: `I heard you ask "${actualTranscript}"! Step 1 setup: place feet 4 feet apart and turn front foot 90 degrees.`,
    });
  } catch (err: any) {
    console.error('Gemini audio API error:', err);
    return NextResponse.json({
      userTranscript: 'Question for coach',
      responseText: "Let me guide you on step 1 posture setup.",
    });
  }
}
