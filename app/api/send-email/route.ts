import * as nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, htmlContent, textContent } = await request.json();

    if (!to || !subject || !htmlContent) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, htmlContent' },
        { status: 400 }
      );
    }

    // Get environment variables
    const senderEmail = process.env.SENDER_EMAIL;
    const senderPassword = process.env.SENDER_PASSWORD; // Gmail App Password
    const senderName = process.env.SENDER_NAME || "Eric & Hang's Wedding";

    if (!senderEmail || !senderPassword) {
      console.error('Missing required environment variables for email');
      return NextResponse.json(
        { error: 'Server configuration error - missing SENDER_EMAIL or SENDER_PASSWORD' },
        { status: 500 }
      );
    }


    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPassword, // This should be an App Password, not your regular password
      },
    });

    // Verify connection configuration
    await transporter.verify();

    // Email options
    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: to,
      subject: subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully',
        messageId: info.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: process.env.NODE_ENV === 'development' ? error : undefined,
      },
      { status: 500 }
    );
  }
}
