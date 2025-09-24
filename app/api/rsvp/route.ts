import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { generateRSVPConfirmationEmail, generateAdminNotificationEmail } from '../../../lib/email-templates';

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
      transportationDetails,
      dietaryRestrictions,
      accessibilityRestrictions,
      notificationMethod,
      notificationOther,
      instagramHandle,
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

    // Create concatenated notification field
    let notificationField = '';
    if (notificationMethod) {
      notificationField = notificationMethod;
      if (notificationMethod === 'IG' && instagramHandle) {
        notificationField += ` (${instagramHandle})`;
      } else if (notificationMethod === 'Other' && notificationOther) {
        notificationField += ` (${notificationOther})`;
      }
    }

    // Check if this is an update operation (has rowIndex)
    const isUpdate = formData.rowIndex && formData.rowIndex > 0;

    let response;

    if (isUpdate) {
      // Update existing row
      response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `RSVP!A${formData.rowIndex}:L${formData.rowIndex}`,
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
              transportationDetails ? 'Yes' : 'No',
              dietaryRestrictions || '',
              accessibilityRestrictions || '',
              notificationField,
              timestamp,
            ],
          ],
        },
      });
    } else {
      // Add new row to spreadsheet
      response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'RSVP!A:L', // Extended range for all fields
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
              transportationDetails ? 'Yes' : 'No',
              dietaryRestrictions || '',
              accessibilityRestrictions || '',
              notificationField,
              timestamp,
            ],
          ],
        },
      });
    }

    console.log('RSVP added to spreadsheet:', response.data);

    // Send confirmation email to the guest
    try {
      const emailData = {
        name: name.trim(),
        plusOneName: plusOneName || '',
        canAttend,
        email: email.trim(),
        phone: phone || '',
        eventType: eventType || '',
        accommodationDetails,
        transportationDetails,
        dietaryRestrictions: dietaryRestrictions || '',
        accessibilityRestrictions: accessibilityRestrictions || '',
        notificationMethod: notificationMethod || '',
        notificationOther: notificationOther || '',
        instagramHandle: instagramHandle || '',
        isUpdate: isUpdate, // Pass the isUpdate flag to the email template
      };

      const confirmationEmail = generateRSVPConfirmationEmail(emailData);
      
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email.trim(),
          subject: confirmationEmail.subject,
          htmlContent: confirmationEmail.html,
          textContent: confirmationEmail.text,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Failed to send confirmation email');
      } else {
        console.log('Confirmation email sent successfully');
      }

      // Send notification email to admin (you)
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const adminNotification = generateAdminNotificationEmail(emailData);
        
        const adminEmailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: adminEmail,
            subject: adminNotification.subject,
            htmlContent: adminNotification.html,
            textContent: adminNotification.text,
          }),
        });

        if (!adminEmailResponse.ok) {
          console.error('Failed to send admin notification email');
        } else {
          console.log('Admin notification email sent successfully');
        }
      }
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the RSVP submission if email fails
    }

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
