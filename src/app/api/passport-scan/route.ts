import { NextRequest, NextResponse } from 'next/server';
import { completion } from '@rocketnew/llm-sdk';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured. Please set the environment variable.' },
      { status: 400 }
    );
  }

  let imageDataUrl: string | undefined;

  try {
    const body = await req.json();
    imageDataUrl = body.imageDataUrl;
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!imageDataUrl) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  try {
    const response = await completion({
      model: 'gemini/gemini-3.6-flash',
      api_key: apiKey,
      stream: false,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a passport OCR expert. Carefully examine this passport image and extract all visible data fields.

Return ONLY a valid JSON object — no markdown, no explanation, no code fences. Use this exact structure:
{
  "surname": "LAST_NAME_IN_UPPERCASE",
  "givenNames": "FIRST AND MIDDLE NAMES IN UPPERCASE",
  "nationality": "3-letter ISO country code e.g. SAU",
  "passportNumber": "passport number as printed",
  "dateOfBirth": "DD MMM YYYY e.g. 15 JAN 1980",
  "sex": "M or F",
  "expiryDate": "DD MMM YYYY e.g. 20 DEC 2030",
  "mrzLine1": "full MRZ line 1 exactly 44 characters",
  "mrzLine2": "full MRZ line 2 exactly 44 characters"
}

Rules:
- Use UPPERCASE for all name fields
- If a field is not visible, use "UNKNOWN" as the value
- Never return null or empty strings
- Return ONLY the JSON object, nothing else`,
            },
            {
              type: 'image_url',
              image_url: { url: imageDataUrl },
            },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 600,
    } as any);

    const raw = (response as any)?.choices?.[0]?.message?.content ?? '';

    if (!raw) {
      return NextResponse.json({ error: 'Empty response from AI model' }, { status: 422 });
    }

    // Strip markdown code fences if model wraps the JSON
    const jsonStr = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    let parsed: Record<string, string>;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      // Try to extract JSON object from the response
      const match = jsonStr.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          return NextResponse.json({ error: 'Failed to parse AI response as JSON', raw }, { status: 422 });
        }
      } else {
        return NextResponse.json({ error: 'No JSON found in AI response', raw }, { status: 422 });
      }
    }

    return NextResponse.json({ data: parsed });
  } catch (err: any) {
    console.error('Passport scan error:', err);
    const message = err?.message ?? 'Internal server error';
    const status = err?.statusCode ?? err?.status ?? 500;
    return NextResponse.json({ error: message }, { status });
  }
}
