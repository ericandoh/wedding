import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { isValidDonationCharity } from '../../../lib/donation-charities';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, amount, charity } = body as {
      name?: string;
      amount?: string;
      charity?: string;
    };

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!amount || typeof amount !== 'string' || amount.trim().length === 0) {
      return NextResponse.json(
        { error: 'Donation amount is required' },
        { status: 400 },
      );
    }

    if (!charity || typeof charity !== 'string' || !isValidDonationCharity(charity)) {
      return NextResponse.json(
        { error: 'Please select a valid charity' },
        { status: 400 },
      );
    }

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

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Donations!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            name.trim(),
            amount.trim(),
            charity,
            timestamp,
          ],
        ],
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error recording donation:', error);
    return NextResponse.json(
      {
        error: 'Failed to record donation. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
