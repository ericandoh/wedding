import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

// Apple Photos sheet:
// https://docs.google.com/spreadsheets/d/1rzDM1oQgXTFah2bcV4ww7dtdfK0ylRoEg7Rv7Zpw690/edit?gid=1815666152#gid=1815666152
const APPLE_PHOTO_SPREADSHEET_ID =
  '1rzDM1oQgXTFah2bcV4ww7dtdfK0ylRoEg7Rv7Zpw690';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const privateKey = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const projectId = process.env.GCP_PROJECT_ID;
    const clientEmail = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
    const spreadsheetId = APPLE_PHOTO_SPREADSHEET_ID;

    if (!privateKey || !projectId || !clientEmail) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'ApplePhoto!A:C',
    });

    const rows = response.data.values || [];
    const normalizedEmail = email.trim().toLowerCase();

    const matchingRow = rows.find((row, index) => {
      if (index === 0) return false;
      const rowEmail = (row[0] || '').trim().toLowerCase();
      return rowEmail === normalizedEmail;
    });

    if (!matchingRow) {
      return NextResponse.json({
        hasRequest: false,
        alreadyAdded: false,
        appleEmail: null,
      });
    }

    const appleEmail = (matchingRow[1] || '').trim();
    const status = (matchingRow[2] || '').trim().toUpperCase();
    const alreadyAdded = status === 'YES';

    return NextResponse.json({
      hasRequest: true,
      alreadyAdded,
      appleEmail: appleEmail || null,
    });
  } catch (error) {
    console.error('Error checking Apple Photos status:', error);
    return NextResponse.json(
      {
        error: 'Failed to check Apple Photos status. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    );
  }
}

