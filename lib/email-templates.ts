export interface RSVPData {
  name: string;
  plusOneName?: string;
  canAttend: string;
  email: string;
  phone?: string;
  eventType?: string;
  accommodationDetails: boolean;
  transportationDetails: boolean;
  dietaryRestrictions?: string;
  accessibilityRestrictions?: string;
  notificationMethod?: string;
  notificationOther?: string;
  instagramHandle?: string;
  isUpdate?: boolean; // New field to indicate if this is an update
}

export function generateRSVPConfirmationEmail(data: RSVPData): { subject: string; html: string; text: string } {
  const { name, canAttend, eventType, accommodationDetails, transportationDetails, isUpdate } = data;
  
  const isAttending = canAttend === 'Yes';
  const plusOneText = data.plusOneName ? ` and ${data.plusOneName}` : '';
  const eventText = eventType ? ` for ${eventType}` : '';
  
  const subject = isUpdate 
    ? `RSVP Updated - ${isAttending ? 'We can\'t wait to celebrate with you!' : 'Thank you for letting us know'}`
    : `RSVP Confirmation - ${isAttending ? 'We can\'t wait to celebrate with you!' : 'Thank you for letting us know'}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RSVP Confirmation</title>
  <style>
    body {
      font-family: 'Cormorant Garamond', Georgia, serif;
      line-height: 1.6;
      color: #374151;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9fafb;
    }
    .container {
      background-color: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 20px;
    }
    .title {
      font-family: 'Moon Dance', cursive;
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }
    .subtitle {
      font-family: 'Moon Dance', cursive;
      font-size: 1.2rem;
      color: #6b7280;
      margin: 10px 0 0 0;
    }
    .content {
      font-size: 1.1rem;
      margin-bottom: 20px;
    }
    .rsvp-details {
      background-color: #f3f4f6;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 4px 0;
    }
    .detail-label {
      font-weight: 600;
      color: #374151;
    }
    .detail-value {
      color: #6b7280;
    }
    .attending {
      color: #059669;
      font-weight: 600;
    }
    .not-attending {
      color: #dc2626;
      font-weight: 600;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 0.9rem;
      color: #6b7280;
    }
    .button {
      display: inline-block;
      background-color: #1f2937;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">Eric + Hang's Wedding</h1>
      <p class="subtitle">RSVP Confirmation</p>
    </div>
    
    <div class="content">
      <p>Dear ${name}${plusOneText},</p>
      
      ${isUpdate 
        ? `<p>We've received your RSVP update!</p>`
        : `<p>We've received your RSVP!</p>`
      }
      
      ${isAttending 
        ? `<p>We're thrilled that you'll be joining us for our special day! 🎉</p>
           <p>We can't wait to celebrate with you${eventText}.</p>`
        : `<p>Thank you so much for letting us know that you won't be able to attend${eventText}.</p>
           <p>We completely understand and will miss you on our special day.</p>`
      }
    </div>
    
    <div class="rsvp-details">
      <h3 style="margin-top: 0; color: #1f2937;">Your RSVP Details:</h3>
      <div class="detail-row">
        <span class="detail-label">Name:</span>
        <span class="detail-value">${name}${data.plusOneName ? ` + ${data.plusOneName}` : ''}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Attending:</span>
        <span class="detail-value ${isAttending ? 'attending' : 'not-attending'}">${canAttend}</span>
      </div>
      ${eventType ? `
      <div class="detail-row">
        <span class="detail-label">Event:</span>
        <span class="detail-value">${eventType}</span>
      </div>
      ` : ''}
      ${accommodationDetails ? `
      <div class="detail-row">
        <span class="detail-label">Accommodation:</span>
        <span class="detail-value">Details requested</span>
      </div>
      ` : ''}
      ${transportationDetails ? `
      <div class="detail-row">
        <span class="detail-label">Transportation:</span>
        <span class="detail-value">Details requested</span>
      </div>
      ` : ''}
      ${data.dietaryRestrictions ? `
      <div class="detail-row">
        <span class="detail-label">Dietary Restrictions:</span>
        <span class="detail-value">${data.dietaryRestrictions}</span>
      </div>
      ` : ''}
      ${data.accessibilityRestrictions ? `
      <div class="detail-row">
        <span class="detail-label">Accessibility Needs:</span>
        <span class="detail-value">${data.accessibilityRestrictions}</span>
      </div>
      ` : ''}
    </div>
    
    ${isAttending ? `
    <div class="content">
      <p>We'll be sending out more details about the wedding as the date approaches, including:</p>
      <ul>
        <li>Detailed schedule and timeline</li>
        <li>Venue information and directions</li>
        <li>Accommodation recommendations</li>
        <li>Dress code and other helpful details</li>
      </ul>
      
      <p>If you have any other questions in the meantime, please don't hesitate to reach out to us! Or trial our chatbot at https://www.hangeric.com/chatbot.</p>
    </div>
    ` : ''}
    
    <div class="content">
      <p>Thank you for being part of our special day!</p>
      <p>Best,<br><strong>Eric & Hang</strong></p>
    </div>
    
    <div class="footer">
      <p>This email was sent in response to your RSVP submission. If you need to make any changes, please visit our wedding website.</p>
      <p><a href="https://www.hangeric.com/rsvp" class="button">Update RSVP</a></p>
    </div>
  </div>
</body>
</html>`;

  const text = `
Eric + Hang's Wedding - RSVP Confirmation

Dear ${name}${plusOneText},

${isUpdate 
  ? `We've received your RSVP update!`
  : `We've received your RSVP!`
}

${isAttending 
  ? `We're thrilled that you'll be joining us for our special day! 🎉
We can't wait to celebrate with you${eventText}.`
  : `Thank you so much for letting us know that you won't be able to attend${eventText}.
We completely understand and will miss you on our special day.`
}

Your RSVP Details:
- Name: ${name}${data.plusOneName ? ` + ${data.plusOneName}` : ''}
- Attending: ${canAttend}
${eventType ? `- Event: ${eventType}` : ''}
${accommodationDetails ? '- Accommodation: Details requested' : ''}
${transportationDetails ? '- Transportation: Details requested' : ''}
${data.dietaryRestrictions ? `- Dietary Restrictions: ${data.dietaryRestrictions}` : ''}
${data.accessibilityRestrictions ? `- Accessibility Needs: ${data.accessibilityRestrictions}` : ''}

${isAttending ? `
We'll be sending out more details about the wedding as the date approaches, including:
- Detailed schedule and timeline
- Venue information and directions
- Accommodation recommendations
- Dress code and other helpful details

To change your RSVP or modify any information submitted, please re-visit the RSVP page: https://www.hangeric.com/rsvp and resubmit your information.
If you have any other questions in the meantime, please don't hesitate to reach out to us! Or trial our chatbot at https://www.hangeric.com/chatbot.
` : ''}

Thank you for being part of our special day!

Best,
Eric & Hang
`;

  return { subject, html, text };
}

export function generateAdminNotificationEmail(data: RSVPData): { subject: string; html: string; text: string } {
  const { name, canAttend, eventType } = data;
  const isAttending = canAttend === 'Yes';
  
  const subject = `New RSVP: ${name} - ${isAttending ? 'Attending' : 'Not Attending'}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New RSVP Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #374151;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9fafb;
    }
    .container {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: ${isAttending ? '#10b981' : '#ef4444'};
      color: white;
      padding: 20px;
      border-radius: 6px;
      text-align: center;
      margin-bottom: 20px;
    }
    .status {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0;
    }
    .details {
      background-color: #f3f4f6;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 4px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #374151;
    }
    .detail-value {
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="status">${isAttending ? '✅ New RSVP - Attending!' : '❌ New RSVP - Not Attending'}</h1>
    </div>
    
    <div class="details">
      <div class="detail-row">
        <span class="detail-label">Name:</span>
        <span class="detail-value">${data.name}${data.plusOneName ? ` + ${data.plusOneName}` : ''}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${data.email}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone:</span>
        <span class="detail-value">${data.phone || 'Not provided'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Attending:</span>
        <span class="detail-value">${data.canAttend}</span>
      </div>
      ${eventType ? `
      <div class="detail-row">
        <span class="detail-label">Event:</span>
        <span class="detail-value">${eventType}</span>
      </div>
      ` : ''}
      <div class="detail-row">
        <span class="detail-label">Accommodation Details:</span>
        <span class="detail-value">${data.accommodationDetails ? 'Yes' : 'No'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Transportation Details:</span>
        <span class="detail-value">${data.transportationDetails ? 'Yes' : 'No'}</span>
      </div>
      ${data.dietaryRestrictions ? `
      <div class="detail-row">
        <span class="detail-label">Dietary Restrictions:</span>
        <span class="detail-value">${data.dietaryRestrictions}</span>
      </div>
      ` : ''}
      ${data.accessibilityRestrictions ? `
      <div class="detail-row">
        <span class="detail-label">Accessibility Needs:</span>
        <span class="detail-value">${data.accessibilityRestrictions}</span>
      </div>
      ` : ''}
      ${data.notificationMethod ? `
      <div class="detail-row">
        <span class="detail-label">Notification Preference:</span>
        <span class="detail-value">${data.notificationMethod}${data.instagramHandle ? ` (${data.instagramHandle})` : ''}${data.notificationOther ? ` (${data.notificationOther})` : ''}</span>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;

  const text = `
New RSVP Notification - ${isAttending ? 'Attending!' : 'Not Attending'}

Name: ${data.name}${data.plusOneName ? ` + ${data.plusOneName}` : ''}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Attending: ${data.canAttend}
${eventType ? `Event: ${eventType}` : ''}
Accommodation Details: ${data.accommodationDetails ? 'Yes' : 'No'}
Transportation Details: ${data.transportationDetails ? 'Yes' : 'No'}
${data.dietaryRestrictions ? `Dietary Restrictions: ${data.dietaryRestrictions}` : ''}
${data.accessibilityRestrictions ? `Accessibility Needs: ${data.accessibilityRestrictions}` : ''}
${data.notificationMethod ? `Notification Preference: ${data.notificationMethod}${data.instagramHandle ? ` (${data.instagramHandle})` : ''}${data.notificationOther ? ` (${data.notificationOther})` : ''}` : ''}
`;

  return { subject, html, text };
}
