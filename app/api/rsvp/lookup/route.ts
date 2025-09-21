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

    // Get all data from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'RSVP!A:L', // All columns including new fields
    });

    const rows = response.data.values || [];

    // Find the row with matching email (column D, index 3)
    const matchingRow = rows.find((row, index) => {
      // Skip header row (index 0) and check if email matches
      return (
        index > 0 &&
        row[3] &&
        row[3].trim().toLowerCase() === email.trim().toLowerCase()
      );
    });

    if (matchingRow) {
      // Parse notification field back into components
      const notificationField = matchingRow[10] || '';
      let notificationMethod = '';
      let notificationOther = '';
      let instagramHandle = '';
      
      if (notificationField) {
        if (notificationField.startsWith('IG (')) {
          notificationMethod = 'IG';
          instagramHandle = notificationField.slice(4, -1); // Remove 'IG (' and ')'
        } else if (notificationField.startsWith('Other (')) {
          notificationMethod = 'Other';
          notificationOther = notificationField.slice(7, -1); // Remove 'Other (' and ')'
        } else {
          notificationMethod = notificationField;
        }
      }

      // Return the existing data
      return NextResponse.json({
        found: true,
        data: {
          name: matchingRow[0] || '',
          plusOneName: matchingRow[1] || '',
          canAttend: matchingRow[2] || '',
          email: matchingRow[3] || '',
          phone: matchingRow[4] || '',
          eventType: matchingRow[5] || '',
          accommodationDetails: matchingRow[6] === 'Yes',
          transportationDetails: matchingRow[7] === 'Yes',
          dietaryRestrictions: matchingRow[8] || '',
          accessibilityRestrictions: matchingRow[9] || '',
          notificationMethod,
          notificationOther,
          instagramHandle,
          rowIndex: rows.indexOf(matchingRow) + 1, // 1-based index for Google Sheets
        },
      });
    } else {
      return NextResponse.json({ found: false, data: null });
    }
  } catch (error) {
    console.error('Error looking up RSVP:', error);

    return NextResponse.json(
      {
        error: 'Failed to lookup RSVP. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    );
  }
}
