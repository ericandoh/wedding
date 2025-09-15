import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const {
      name,
      plusOneName,
      canAttend,
      email,
      phone,
      eventType,
      accommodationDetails,
      dietaryRestrictions,
      accessibilityRestrictions,
    } = formData;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!canAttend) {
      return NextResponse.json(
        { error: 'Please specify if you can attend' },
        { status: 400 },
      );
    }

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

    // Get current timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Check if this is an update operation (has rowIndex)
    const isUpdate = formData.rowIndex && formData.rowIndex > 0;

    let response;

    if (isUpdate) {
      // Update existing row
      response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Sheet1!A${formData.rowIndex}:J${formData.rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              name.trim(),
              plusOneName || '',
              canAttend,
              email.trim(),
              phone || '',
              eventType || '',
              accommodationDetails ? 'Yes' : 'No',
              dietaryRestrictions || '',
              accessibilityRestrictions || '',
              timestamp,
            ],
          ],
        },
      });
    } else {
      // Add new row to spreadsheet
      response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:J', // Extended range for all fields
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              name.trim(),
              plusOneName || '',
              canAttend,
              email.trim(),
              phone || '',
              eventType || '',
              accommodationDetails ? 'Yes' : 'No',
              dietaryRestrictions || '',
              accessibilityRestrictions || '',
              timestamp,
            ],
          ],
        },
      });
    }

    console.log('RSVP added to spreadsheet:', response.data);

    return NextResponse.json(
      {
        success: true,
        message: isUpdate
          ? 'RSVP updated successfully'
          : 'RSVP submitted successfully',
        updatedRows: isUpdate
          ? (response.data as any).updatedRows || 1
          : (response.data as any).updates?.updatedRows || 1,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error adding RSVP to spreadsheet:', error);

    return NextResponse.json(
      {
        error: 'Failed to submit RSVP. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    );
  }
}
