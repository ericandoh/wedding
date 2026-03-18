import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

// Apple Photos sheet:
// https://docs.google.com/spreadsheets/d/1rzDM1oQgXTFah2bcV4ww7dtdfK0ylRoEg7Rv7Zpw690/edit?gid=1815666152#gid=1815666152
const APPLE_PHOTO_SPREADSHEET_ID =
  '1rzDM1oQgXTFah2bcV4ww7dtdfK0ylRoEg7Rv7Zpw690';

export async function POST(request: NextRequest) {
  try {
    const { rsvpEmail, appleEmail } = await request.json();

    if (!rsvpEmail || typeof rsvpEmail !== 'string' || rsvpEmail.trim().length === 0) {
      return NextResponse.json({ error: 'RSVP email is required' }, { status: 400 });
    }

    if (!appleEmail || typeof appleEmail !== 'string' || appleEmail.trim().length === 0) {
      return NextResponse.json({ error: 'Apple Photos email is required' }, { status: 400 });
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

    const normalizedRsvpEmail = rsvpEmail.trim().toLowerCase();
    const trimmedAppleEmail = appleEmail.trim();

    // Read existing rows to see if there's already a request
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'ApplePhoto!A:C',
    });
    const rows = readResponse.data.values || [];

    let existingRowIndex: number | null = null;

    rows.forEach((row, index) => {
      if (index === 0) return; // skip header
      const rowEmail = (row[0] || '').trim().toLowerCase();
      if (rowEmail === normalizedRsvpEmail) {
        existingRowIndex = index + 1; // 1-based index for Sheets API
      }
    });

    if (existingRowIndex) {
      // Update existing row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `ApplePhoto!A${existingRowIndex}:C${existingRowIndex}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[normalizedRsvpEmail, trimmedAppleEmail, 'NO']],
        },
      });
    } else {
      // Append new row
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'ApplePhoto!A:C',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [[normalizedRsvpEmail, trimmedAppleEmail, 'NO']],
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving Apple Photos request:', error);
    return NextResponse.json(
      {
        error: 'Failed to save Apple Photos request. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    );
  }
}

