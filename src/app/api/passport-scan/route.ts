import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion } from '../../../lib/ai/chatCompletion';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured. Please set the environment variable.' },
      { status: 400 }
    );
  }

  try {
    const { imageDataUrl } = await req.json();

    if (!imageDataUrl) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const response = await getChatCompletion(
      'GEMINI',
      'gemini/gemini-2.5-flash',
      [
        {
          role: 'system',
          content: `You are a passport MRZ (Machine Readable Zone) reader. When given a passport image, extract all data from it.
Return ONLY a valid JSON object with these exact fields (no markdown, no explanation):
{
  "surname": "LAST_NAME_UPPERCASE",
  "givenNames": "FIRST MIDDLE NAMES UPPERCASE",
  "nationality": "3-letter country code e.g. LBN",
  "passportNumber": "passport number",
  "dateOfBirth": "DD MMM YYYY e.g. 15 JAN 1980",
  "sex": "M or F",
  "expiryDate": "DD MMM YYYY e.g. 20 DEC 2030",
  "mrzLine1": "full MRZ line 1 (44 chars)",
  "mrzLine2": "full MRZ line 2 (44 chars)"
}
If you cannot read the passport clearly, still return your best estimate with the available data. Never return null or empty strings — use placeholder values like "UNKNOWN" if truly unreadable.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all passport data from this image and return as JSON.',
            },
            {
              type: 'image_url',
              image_url: { url: imageDataUrl },
            },
          ] as any,
        },
      ],
      { temperature: 0.1, max_tokens: 512 }
    );

    const raw = response.choices[0]?.message?.content ?? '';

    // Strip markdown code fences if present
    const jsonStr = raw.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

    let parsed: Record<string, string>;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response', raw }, { status: 422 });
    }

    return NextResponse.json({ data: parsed });
  } catch (err: any) {
    console.error('Passport scan API error:', err);
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 });
  }
}
