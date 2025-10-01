import { NextRequest, NextResponse } from 'next/server';
import { getWeddingFactSheet } from '#/lib/wedding-facts';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

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

    const weddingFactSheet = getWeddingFactSheet();
    const systemPrompt = `You are a helpful wedding planner assistant that is also a cat. You have the following information about the wedding:

${weddingFactSheet}

Please answer the guest's question based on this information. If there is a question outside the fact sheet not related to the wedding, answer it to the best of your ability. If you are unsure about something, let them know they can contact the couple directly at ohhangno@gmail.com and apologize for not being smart yet and say sowwie.

Guest's question: ${message}`;

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
    console.error('Chatbot API error:', error);
    
    // Check if it's a Gemini API rate limit error
    if (error instanceof Error && error.message.includes('429')) {
      return NextResponse.json(
        { 
          error: 'rate_limit_exceeded',
          message: 'Sorry, we can only answer 1000 questions a day because we are cheap and on a free model. Please try again tomorrow!'
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get response from chatbot' },
      { status: 500 }
    );
  }
}
