import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Tab "Seating" in the main wedding spreadsheet (GCP_SPREADSHEET_ID):
// Column A = left table (order top-to-bottom), Column B = right table.
export async function GET() {
  try {
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

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Seating!A:B',
    });

    const rows = response.data.values || [];

    const isHeaderRow = (row: string[]) => {
      const a = (row[0] ?? '').trim();
      const b = (row[1] ?? '').trim();
      if (!a && !b) return false;
      return (
        /^left$/i.test(a) &&
        (/^right$/i.test(b) || /^table\s*2$/i.test(b) || /^b$/i.test(b))
      );
    };

    let dataRows = rows;
    if (dataRows.length > 0 && isHeaderRow(dataRows[0])) {
      dataRows = dataRows.slice(1);
    }

    const leftTable: string[] = [];
    const rightTable: string[] = [];

    for (const row of dataRows) {
      const left = (row[0] ?? '').trim();
      const right = (row[1] ?? '').trim();
      if (left) leftTable.push(left);
      if (right) rightTable.push(right);
    }

    return NextResponse.json({ leftTable, rightTable });
  } catch (error) {
    console.error('Error fetching seating chart:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch seating chart.',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
