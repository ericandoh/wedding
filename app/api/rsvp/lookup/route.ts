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
      range: 'RSVP!A:O', // All columns including new fields
    });

    const rows = response.data.values || [];

    // Find the row with matching email
    // Handle both old format (email at index 4) and new format (email at index 6)
    const matchingRow = rows.find((row, index) => {
      // Skip header row (index 0)
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

    if (matchingRow) {
      // Determine if this is old format (email at index 4) or new format (email at index 6)
      const isOldFormat = matchingRow[4] && matchingRow[4].includes('@');
      
      // Parse notification field back into components
      // Old format: index 10, New format: index 12
      const notificationField = isOldFormat ? (matchingRow[10] || '') : (matchingRow[12] || '');
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

      // Parse children CSV back into array: "name:age, name:age" -> [{name, age}, ...]
      // Old format: index 12, New format: index 14
      const childrenCSV = isOldFormat ? (matchingRow[12] || '') : (matchingRow[14] || '');
      let children: { name: string; age: string }[] = [];
      if (childrenCSV && childrenCSV.trim()) {
        children = childrenCSV.split(',').map((child: string) => {
          const [name, age] = child.trim().split(':');
          return { name: name || '', age: age || '' };
        });
      }

      // Return the existing data
      // Column mapping: A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7, I=8, J=9, K=10, L=11, M=12, N=13, O=14
      // Handle backward compatibility: old rows might have email at index 4 (old E) or 6 (new G)
      // isOldFormat is already declared above
      
      return NextResponse.json({
        found: true,
        data: {
          name: matchingRow[0] || '',
          plusOneName: matchingRow[1] || '',
          children,
          canAttendPreWedding: isOldFormat ? false : (matchingRow[4] === 'Yes'),
          canAttendWesternWedding: matchingRow[2] === 'Yes',
          canAttendAfterparty: isOldFormat ? false : (matchingRow[5] === 'Yes'),
          canAttendTeaCeremony: matchingRow[3] === 'Yes',
          email: isOldFormat ? (matchingRow[4] || '') : (matchingRow[6] || ''),
          phone: isOldFormat ? (matchingRow[5] || '') : (matchingRow[7] || ''),
          accommodationDetails: isOldFormat ? (matchingRow[6] === 'Yes') : (matchingRow[8] === 'Yes'),
          transportationDetails: isOldFormat ? (matchingRow[7] === 'Yes') : (matchingRow[9] === 'Yes'),
          dietaryRestrictions: isOldFormat ? (matchingRow[8] || '') : (matchingRow[10] || ''),
          accessibilityRestrictions: isOldFormat ? (matchingRow[9] || '') : (matchingRow[11] || ''),
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
