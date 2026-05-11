import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Tab "Seating" in the main wedding spreadsheet (GCP_SPREADSHEET_ID):
// Columns A–B = one side vs opposite side of the left table (same row = facing pair).
// Columns C–D = same for the right table.
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
      range: 'Seating!A:D',
    });

    const rows = response.data.values || [];

    const isHeaderRow = (row: string[]) => {
      const a = (row[0] ?? '').trim();
      const b = (row[1] ?? '').trim();
      const c = (row[2] ?? '').trim();
      const d = (row[3] ?? '').trim();
      if (!a && !b && !c && !d) return false;
      // Legacy two-column header: Left | Right
      if (
        /^left$/i.test(a) &&
        (/^right$/i.test(b) || /^table\s*2$/i.test(b) || /^b$/i.test(b)) &&
        !c &&
        !d
      ) {
        return true;
      }
      // Four-column header, e.g. Left wall | Left aisle | Right wall | Right aisle
      if (/^left/i.test(a) && /^left/i.test(b) && /^right/i.test(c)) {
        return true;
      }
      return false;
    };

    let dataRows = rows;
    if (dataRows.length > 0 && isHeaderRow(dataRows[0])) {
      dataRows = dataRows.slice(1);
    }

    type SeatingRow = {
      leftA: string;
      leftB: string;
      rightA: string;
      rightB: string;
    };

    const seatingRows: SeatingRow[] = [];

    for (const row of dataRows) {
      const leftA = (row[0] ?? '').trim();
      const leftB = (row[1] ?? '').trim();
      const rightA = (row[2] ?? '').trim();
      const rightB = (row[3] ?? '').trim();
      if (leftA || leftB || rightA || rightB) {
        seatingRows.push({ leftA, leftB, rightA, rightB });
      }
    }

    return NextResponse.json({ seatingRows });
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
