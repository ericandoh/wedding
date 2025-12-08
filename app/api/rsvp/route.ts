import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { generateRSVPConfirmationEmail, generateAdminNotificationEmail } from '../../../lib/email-templates';
import * as nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const {
      name,
      plusOneName,
      children,
      canAttendPreWedding,
      canAttendWesternWedding,
      canAttendAfterparty,
      canAttendTeaCeremony,
      email,
      phone,
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

    // Format children as CSV: "name:age, name:age"
    let childrenCSV = '';
    if (children && Array.isArray(children) && children.length > 0) {
      childrenCSV = children
        .map((child: { name: string; age: string }) => `${child.name}:${child.age}`)
        .join(', ');
    }

    // Check if this is an update operation (has rowIndex)
    const isUpdate = formData.rowIndex && formData.rowIndex > 0;

    let response;

    if (isUpdate) {
      // Update existing row
      response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `RSVP!A${formData.rowIndex}:O${formData.rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              name.trim(),
              plusOneName || '',
              canAttendWesternWedding ? 'Yes' : 'No',
              canAttendTeaCeremony ? 'Yes' : 'No',
              canAttendPreWedding ? 'Yes' : 'No',
              canAttendAfterparty ? 'Yes' : 'No',
              email.trim(),
              phone || '',
              accommodationDetails ? 'Yes' : 'No',
              transportationDetails ? 'Yes' : 'No',
              dietaryRestrictions || '',
              accessibilityRestrictions || '',
              notificationField,
              timestamp,
              childrenCSV,
            ],
          ],
        },
      });
    } else {
      // Add new row to spreadsheet
      response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'RSVP!A:O', // Extended range for all fields including children
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              name.trim(),
              plusOneName || '',
              canAttendWesternWedding ? 'Yes' : 'No',
              canAttendTeaCeremony ? 'Yes' : 'No',
              canAttendPreWedding ? 'Yes' : 'No',
              canAttendAfterparty ? 'Yes' : 'No',
              email.trim(),
              phone || '',
              accommodationDetails ? 'Yes' : 'No',
              transportationDetails ? 'Yes' : 'No',
              dietaryRestrictions || '',
              accessibilityRestrictions || '',
              notificationField,
              timestamp,
              childrenCSV,
            ],
          ],
        },
      });
    }


    // Send confirmation email to the guest only if they subscribed (notificationMethod is 'email')
    if (notificationMethod === 'email') {
      try {
        const emailData = {
          name: name.trim(),
          plusOneName: plusOneName || '',
          canAttendPreWedding,
          canAttendWesternWedding,
          canAttendAfterparty,
          canAttendTeaCeremony,
          email: email.trim(),
          phone: phone || '',
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
        
        // Send email directly using nodemailer
        const senderEmail = process.env.SENDER_EMAIL;
        const senderPassword = process.env.SENDER_PASSWORD;
        const senderName = process.env.SENDER_NAME || "Eric & Hang's Wedding";

        if (!senderEmail || !senderPassword) {
          console.error('Missing SENDER_EMAIL or SENDER_PASSWORD environment variables');
          throw new Error('Email configuration missing');
        }

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: senderEmail,
            pass: senderPassword,
          },
        });

        const mailOptions = {
          from: `"${senderName}" <${senderEmail}>`,
          to: email.trim(),
          subject: confirmationEmail.subject,
          html: confirmationEmail.html,
          text: confirmationEmail.text,
        };

        await transporter.sendMail(mailOptions);

        // Send notification email to admin (you)
        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
          const adminNotification = generateAdminNotificationEmail(emailData);
          
          const adminMailOptions = {
            from: `"${senderName}" <${senderEmail}>`,
            to: adminEmail,
            subject: adminNotification.subject,
            html: adminNotification.html,
            text: adminNotification.text,
          };

          await transporter.sendMail(adminMailOptions);
        }
      } catch (emailError) {
        // Don't fail the RSVP submission if email fails
      }
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
