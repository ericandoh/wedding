import { NextRequest, NextResponse } from 'next/server';
import { getThingsToDoFactSheet } from '#/lib/things-to-do-facts';

export async function POST(request: NextRequest) {
  try {
    const { message, region } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GCP_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const factSheet = getThingsToDoFactSheet(
      region === 'central' || region === 'south' ? region : undefined
    );

    const regionNote =
      region === 'central'
        ? 'Focus on Central Vietnam (Da Nang, Hoi An, Hue and nearby).'
        : region === 'south'
        ? 'Focus on South Vietnam (Sa Dec, Can Tho, Ho Chi Minh City and nearby).'
        : 'You can use both Central and South Vietnam recommendations, but prefer Central Vietnam for Da Nang wedding guests unless the guest clearly asks about the South.';

    const systemPrompt = `You are a helpful, opinionated trip-planning assistant for guests attending Hang and Eric's wedding in Vietnam.

You have the following saved places from their personal Google Maps lists (copied from CSV files). These are their personally vetted recommendations and should be preferred when possible:

${factSheet}

${regionNote}

Instructions:
- Prefer places from this fact sheet when making concrete recommendations (food, cafes, shopping, sights, etc.), but you may occasionally suggest other places if they are a very natural fit or the guest asks for something not covered.
- Clearly prioritize and highlight places from the saved list, and explain why they are a good fit using the notes.
- You can propose half‑day, full‑day, or multi‑day mini-itineraries, grouping nearby spots together logically.
- Ask 1–3 quick clarifying questions if needed (e.g., dietary preferences, budget, how far they want to travel), but still try to give at least a first-pass plan.
- If the guest asks for something that is not covered by the fact sheet, you may answer generally, but clearly say when you are going beyond the saved list.

Guest's request: ${message}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const botResponse = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ response: botResponse });
  } catch (error) {
    console.error('Things chatbot API error:', error);

    if (error instanceof Error && error.message.includes('429')) {
      return NextResponse.json(
        {
          error: 'rate_limit_exceeded',
          message:
            'Sorry, we can only answer 1000 planning questions a day because we are cheap and on a free model. Please try again tomorrow!',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get response from things chatbot' },
      { status: 500 }
    );
  }
}

