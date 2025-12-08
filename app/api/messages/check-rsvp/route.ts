import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get environment variables
    const privateKey = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const projectId = process.env.GCP_PROJECT_ID;
    const clientEmail = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
    const spreadsheetId = process.env.GCP_SPREADSHEET_ID;

    if (!privateKey || !projectId || !clientEmail || !spreadsheetId) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    // Create JWT auth client
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Create sheets API instance
    const sheets = google.sheets({ version: 'v4', auth });

    // Get all data from the RSVP spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'RSVP!A:O',
    });

    const rows = response.data.values || [];

    // Find the row with matching email
    const matchingRow = rows.find((row, index) => {
      if (index === 0) return false;
      
      // Check new format first (email at index 6)
      if (row[6] && row[6].trim().toLowerCase() === email.trim().toLowerCase()) {
        return true;
      }
      
      // Check old format (email at index 4)
      if (row[4] && row[4].trim().toLowerCase() === email.trim().toLowerCase()) {
        return true;
      }
      
      return false;
    });

    return NextResponse.json({
      hasRSVP: !!matchingRow,
      email: email.trim().toLowerCase(),
    });
  } catch (error) {
    console.error('Error checking RSVP:', error);
    return NextResponse.json(
      {
        error: 'Failed to check RSVP. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    );
  }
}

