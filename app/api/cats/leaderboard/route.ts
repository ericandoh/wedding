import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

interface CatCounts {
  cypress: number;
  aspen: number;
  fiona: number;
}

interface LeaderboardEntry {
  name: string;
  cypress: number;
  aspen: number;
  fiona: number;
  total: number;
}

// GET - Fetch leaderboard data
export async function GET() {
  try {
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

    // Get all data from the Cats sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Cats!A:D', // Name, Cypress, Aspen, Fiona
    });

    const rows = response.data.values || [];
    console.log('GET: All rows from spreadsheet:', rows);
    
    // Skip header row and process data
    const leaderboard: LeaderboardEntry[] = rows.slice(1).map(row => {
      const name = row[0] || '';
      const cypress = parseInt(row[1]) || 0;
      const aspen = parseInt(row[2]) || 0;
      const fiona = parseInt(row[3]) || 0;
      const total = cypress + aspen + fiona;
      
      console.log(`Processing row: ${name} - Cypress: ${cypress}, Aspen: ${aspen}, Fiona: ${fiona}, Total: ${total}`);
      
      return { name, cypress, aspen, fiona, total };
    });

    // Sort by total pets (descending)
    leaderboard.sort((a, b) => b.total - a.total);
    console.log('GET: Final leaderboard:', leaderboard);

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching cats leaderboard:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch leaderboard. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    );
  }
}

// POST - Update cat pet count
export async function POST(request: NextRequest) {
  try {
    const { name, catType, existingUser } = await request.json();

    if (!name || !catType) {
      return NextResponse.json({ error: 'Name and cat type are required' }, { status: 400 });
    }

    if (!['cypress', 'aspen', 'fiona', 'sync'].includes(catType)) {
      return NextResponse.json({ error: 'Invalid cat type' }, { status: 400 });
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

    // Get all data from the Cats sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Cats!A:D',
    });

    const rows = response.data.values || [];
    console.log('All rows from spreadsheet:', rows);
    console.log('Looking for user:', name);
    
    // Find existing entry
    let existingRowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      console.log(`Checking row ${i}:`, rows[i]);
      if (rows[i][0] && rows[i][0].toLowerCase() === name.toLowerCase()) {
        existingRowIndex = i;
        console.log(`Found existing user at row ${i}`);
        break;
      }
    }
    
    console.log('Existing row index:', existingRowIndex);

    if (existingRowIndex >= 0) {
      // Update existing entry
      if (catType === 'sync' && existingUser) {
        // Full sync - update all counts
        const newRow = [
          name,
          existingUser.cypress,
          existingUser.aspen,
          existingUser.fiona
        ];
        
        const rowRange = `Cats!A${existingRowIndex + 1}:D${existingRowIndex + 1}`;
        
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: rowRange,
          valueInputOption: 'RAW',
          requestBody: {
            values: [newRow]
          }
        });
      } else {
        // Single cat increment
        const currentRow = rows[existingRowIndex];
        const cypress = parseInt(currentRow[1]) || 0;
        const aspen = parseInt(currentRow[2]) || 0;
        const fiona = parseInt(currentRow[3]) || 0;
        
        let newCypress = cypress;
        let newAspen = aspen;
        let newFiona = fiona;
        
        if (catType === 'cypress') newCypress++;
        else if (catType === 'aspen') newAspen++;
        else if (catType === 'fiona') newFiona++;
        
        // Update the specific cell
        const columnIndex = catType === 'cypress' ? 1 : catType === 'aspen' ? 2 : 3;
        const cellRange = `Cats!${String.fromCharCode(65 + columnIndex)}${existingRowIndex + 1}`;
        
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: cellRange,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[catType === 'cypress' ? newCypress : catType === 'aspen' ? newAspen : newFiona]]
          }
        });
      }
    } else {
      // Add new entry - use existing user data if available, otherwise start fresh
      const newRow = [
        name,
        existingUser ? existingUser.cypress : (catType === 'cypress' ? 1 : 0),
        existingUser ? existingUser.aspen : (catType === 'aspen' ? 1 : 0),
        existingUser ? existingUser.fiona : (catType === 'fiona' ? 1 : 0)
      ];
      
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Cats!A:D',
        valueInputOption: 'RAW',
        requestBody: {
          values: [newRow]
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cat pet count:', error);
    return NextResponse.json(
      {
        error: 'Failed to update pet count. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    );
  }
}
