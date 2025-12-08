import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

interface Message {
  message: string;
  by: string;
  date: string;
}

// GET - Fetch messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

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

    // Get all messages from the Messages tab
    let response;
    try {
      response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Messages!A:A',
      });
    } catch (error: any) {
      // If Messages tab doesn't exist, return empty array
      if (error.message?.includes('Unable to parse range')) {
        return NextResponse.json({
          messages: [],
          hasMore: false,
          total: 0,
        });
      }
      throw error;
    }

    const rows = response.data.values || [];
    
    // Parse messages (skip header row if it exists)
    interface MessageWithIndex {
      messages: Message[];
      rowIndex: number;
    }
    
    const messagesWithIndex: MessageWithIndex[] = [];
    const startIndex = rows.length > 0 && rows[0]?.[0]?.toLowerCase() === 'messages' ? 1 : 0;
    
    for (let i = startIndex; i < rows.length; i++) {
      const cellValue = rows[i]?.[0] || '';
      if (cellValue.trim()) {
        try {
          const messageArray: Message[] = JSON.parse(cellValue);
          if (Array.isArray(messageArray) && messageArray.length > 0) {
            messagesWithIndex.push({
              messages: messageArray,
              rowIndex: i + 1, // 1-based row index in Google Sheets
            });
          }
        } catch (e) {
          console.error('Error parsing message JSON:', e, 'Cell value:', cellValue);
        }
      }
    }

    // Sort by date (newest first) - use the first message's date in each array
    messagesWithIndex.sort((a, b) => {
      const dateA = a.messages[0]?.date || '';
      const dateB = b.messages[0]?.date || '';
      return dateB.localeCompare(dateA);
    });

    // Apply pagination
    const paginatedMessages = messagesWithIndex.slice(offset, offset + limit);
    const hasMore = offset + limit < messagesWithIndex.length;

    return NextResponse.json({
      messages: paginatedMessages.map(m => m.messages),
      rowIndices: paginatedMessages.map(m => m.rowIndex),
      hasMore,
      total: messagesWithIndex.length,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch messages. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    );
  }
}

// POST - Create new message or reply
export async function POST(request: NextRequest) {
  try {
    const { email, message, messageIndex } = await request.json();

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
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

    const newMessage: Message = {
      message: message.trim(),
      by: email.trim().toLowerCase(),
      date: new Date().toISOString(),
    };

    // Check if this is a reply (messageIndex provided) or a new message
    const isReply = messageIndex !== undefined && messageIndex !== null && messageIndex !== '';
    
    if (isReply) {
      // This is a reply - update existing row
      // messageIndex is the row number in the sheet (1-based)
      const rowNumber = typeof messageIndex === 'number' ? messageIndex : parseInt(String(messageIndex));
      
      if (isNaN(rowNumber) || rowNumber < 1) {
        console.error('Invalid message index:', messageIndex, 'parsed as:', rowNumber);
        return NextResponse.json({ error: 'Invalid message index' }, { status: 400 });
      }
      
      console.log('Replying to message at row:', rowNumber);
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `Messages!A${rowNumber}:A${rowNumber}`,
      });

      const existingCell = response.data.values?.[0]?.[0] || '[]';
      let messageArray: Message[] = [];
      
      try {
        messageArray = JSON.parse(existingCell);
        if (!Array.isArray(messageArray)) {
          messageArray = [];
        }
      } catch (e) {
        console.error('Error parsing existing message:', e);
        messageArray = [];
      }

      messageArray.push(newMessage);
      
      console.log('Updating row', rowNumber, 'with', messageArray.length, 'messages');

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Messages!A${rowNumber}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[JSON.stringify(messageArray)]],
        },
      });
      
      console.log('Reply added successfully');
    } else {
      console.log('Creating new message (not a reply)');
      // This is a new message - append new row
      // First, try to create the Messages sheet if it doesn't exist
      try {
        await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'Messages!A1',
        });
      } catch (error: any) {
        // If sheet doesn't exist, create it
        if (error.message?.includes('Unable to parse range')) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [{
                addSheet: {
                  properties: {
                    title: 'Messages',
                  },
                },
              }],
            },
          });
        }
      }

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Messages!A:A',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[JSON.stringify([newMessage])]],
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      {
        error: 'Failed to create message. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    );
  }
}

// PUT - Edit message
export async function PUT(request: NextRequest) {
  try {
    const { email, messageIndex, replyIndex, newMessage } = await request.json();

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (messageIndex === undefined || messageIndex === null) {
      return NextResponse.json({ error: 'Message index is required' }, { status: 400 });
    }

    if (!newMessage || typeof newMessage !== 'string' || newMessage.trim().length === 0) {
      return NextResponse.json({ error: 'New message is required' }, { status: 400 });
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

    // Get existing message
    // messageIndex is the row number in the sheet (1-based)
    const rowNumber = typeof messageIndex === 'number' ? messageIndex : parseInt(String(messageIndex));
    
    if (isNaN(rowNumber) || rowNumber < 1) {
      console.error('Invalid message index for edit:', messageIndex);
      return NextResponse.json({ error: 'Invalid message index' }, { status: 400 });
    }
    
    console.log('Editing message at row:', rowNumber, 'replyIndex:', replyIndex);
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `Messages!A${rowNumber}:A${rowNumber}`,
    });

    const existingCell = response.data.values?.[0]?.[0] || '[]';
    let messageArray: Message[] = [];
    
    try {
      messageArray = JSON.parse(existingCell);
      if (!Array.isArray(messageArray)) {
        return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
      }
    } catch (e) {
      console.error('Error parsing message for edit:', e);
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    // Check if user is the author
    const targetIndex = replyIndex !== undefined && replyIndex !== null ? replyIndex : 0;
    const messageAuthor = messageArray[targetIndex]?.by?.toLowerCase()?.trim() || '';
    const userEmailLower = email.trim().toLowerCase();
    
    console.log('Edit authorization check:');
    console.log('  Message author:', messageAuthor);
    console.log('  User email:', userEmailLower);
    console.log('  Target index:', targetIndex);
    console.log('  Message array length:', messageArray.length);
    console.log('  Match:', messageAuthor === userEmailLower);
    
    if (!messageAuthor || messageAuthor !== userEmailLower) {
      console.error('Unauthorized edit attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update the message
    messageArray[targetIndex].message = newMessage.trim();

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Messages!A${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[JSON.stringify(messageArray)]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error editing message:', error);
    return NextResponse.json(
      {
        error: 'Failed to edit message. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 },
    );
  }
}

