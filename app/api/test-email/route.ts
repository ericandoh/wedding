import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const senderEmail = process.env.SENDER_EMAIL;
    const senderPassword = process.env.SENDER_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    const envCheck = {
      SENDER_EMAIL: !!senderEmail,
      SENDER_PASSWORD: !!senderPassword,
      ADMIN_EMAIL: !!adminEmail,
      NEXT_PUBLIC_BASE_URL: !!baseUrl,
    };

    console.log('Environment check:', envCheck);

    if (!senderEmail || !senderPassword) {
      return NextResponse.json({
        error: 'Missing email environment variables',
        details: envCheck,
        message: 'Please set SENDER_EMAIL and SENDER_PASSWORD in your environment variables'
      }, { status: 400 });
    }

    // Test email sending
    let testEmailResult = null;
    try {
      const testEmailResponse = await fetch(`${baseUrl || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: adminEmail || senderEmail,
          subject: 'Test Email from Wedding RSVP System',
          htmlContent: '<h1>Test Email</h1><p>This is a test email to verify the SMTP setup is working.</p>',
          textContent: 'Test Email\n\nThis is a test email to verify the SMTP setup is working.',
        }),
      });

      if (testEmailResponse.ok) {
        const testEmailData = await testEmailResponse.json();
        testEmailResult = {
          success: true,
          status: testEmailResponse.status,
          statusText: testEmailResponse.statusText,
          response: testEmailData,
        };
      } else {
        const errorText = await testEmailResponse.text();
        testEmailResult = {
          success: false,
          status: testEmailResponse.status,
          statusText: testEmailResponse.statusText,
          error: errorText,
        };
      }
    } catch (fetchError) {
      testEmailResult = {
        success: false,
        error: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
      };
    }

    return NextResponse.json({
      success: true,
      environment: envCheck,
      testEmail: testEmailResult,
    });

  } catch (error) {
    console.error('Email test error:', error);
    
    return NextResponse.json({
      error: 'Email test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
