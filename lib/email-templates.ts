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
  const eventText = eventType 
    ? eventType === 'Both events' 
      ? ' for the ceremony and reception'
      : ` for ${eventType}`
    : '';
  
  const subject = isUpdate 
    ? `RSVP Updated`
    : `RSVP Received`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RSVP Confirmation</title>
  <style>
    body {
      font-family: Georgia, 'Times New Roman', serif;
      line-height: 1.7;
      color: #374151;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
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
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 1.6rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
      letter-spacing: 1px;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
      font-style: italic;
    }
    .subtitle {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 1.3rem;
      color: #6b7280;
      margin: 10px 0 0 0;
      font-style: italic;
    }
    .content {
      font-size: 1.1rem;
      margin-bottom: 20px;
    }
    .rsvp-details {
      border: 2px solid #e5e7eb;
      padding: 30px;
      border-radius: 6px;
      margin: 30px 0;
      background-color: #ffffff;
      text-align: center;
    }
    .detail-row {
      margin-bottom: 12px;
      padding: 6px 0;
      font-size: 0.9rem;
    }
    .detail-label {
      font-weight: 600;
      color: #374151;
    }
    .detail-value {
      color: #6b7280;
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
      background-color: #ffffff;
      color: #1f2937;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      margin: 20px 0;
      border: 2px solid #1f2937;
      transition: all 0.3s ease;
    }
    .button:hover {
      background-color: #1f2937;
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="rsvp-details">
      <h1 class="title">${isUpdate 
        ? `RSVP Updated`
        : `RSVP Received`}</h1>
      <div class="details-section">
      <div class="detail-row">
        <span class="detail-label">Name: </span>
        <span class="detail-value">${name}${data.plusOneName ? ` + ${data.plusOneName}` : ''}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Attending: </span>
        <span class="detail-value">${canAttend}</span>
      </div>
      ${eventType ? `
      <div class="detail-row">
        <span class="detail-label">Event: </span>
        <span class="detail-value">${eventType}</span>
      </div>
      ` : ''}
      ${accommodationDetails ? `
      <div class="detail-row">
        <span class="detail-label">Accommodation: </span>
        <span class="detail-value">Details requested</span>
      </div>
      ` : ''}
      ${transportationDetails ? `
      <div class="detail-row">
        <span class="detail-label">Transportation: </span>
        <span class="detail-value">Details requested</span>
      </div>
      ` : ''}
      ${data.dietaryRestrictions ? `
      <div class="detail-row">
        <span class="detail-label">Dietary Restrictions: </span>
        <span class="detail-value">${data.dietaryRestrictions}</span>
      </div>
      ` : ''}
      ${data.accessibilityRestrictions ? `
      <div class="detail-row">
        <span class="detail-label">Accessibility Needs: </span>
        <span class="detail-value">${data.accessibilityRestrictions}</span>
      </div>
      ` : ''}
      </div>
      
      
      <div class="footer">
        <p>This email was sent in response to your RSVP submission. If you need to make any changes, please visit our wedding website.</p>
        <p><a href="https://www.hangeric.com/rsvp" class="button">Update RSVP</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = `
RSVP Received
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
      font-family: Georgia, 'Times New Roman', serif;
      line-height: 1.6;
      color: #374151;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
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
      border: 2px solid #e5e7eb;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
      background-color: #ffffff;
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
        <span class="detail-label">Name: </span>
        <span class="detail-value">${data.name}${data.plusOneName ? ` + ${data.plusOneName}` : ''}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email: </span>
        <span class="detail-value">${data.email}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone: </span>
        <span class="detail-value">${data.phone || 'Not provided'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Attending: </span>
        <span class="detail-value">${data.canAttend}</span>
      </div>
      ${eventType ? `
      <div class="detail-row">
        <span class="detail-label">Event: </span>
        <span class="detail-value">${eventType}</span>
      </div>
      ` : ''}
      <div class="detail-row">
        <span class="detail-label">Accommodation Details: </span>
        <span class="detail-value">${data.accommodationDetails ? 'Yes' : 'No'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Transportation Details: </span>
        <span class="detail-value">${data.transportationDetails ? 'Yes' : 'No'}</span>
      </div>
      ${data.dietaryRestrictions ? `
      <div class="detail-row">
        <span class="detail-label">Dietary Restrictions: </span>
        <span class="detail-value">${data.dietaryRestrictions}</span>
      </div>
      ` : ''}
      ${data.accessibilityRestrictions ? `
      <div class="detail-row">
        <span class="detail-label">Accessibility Needs: </span>
        <span class="detail-value">${data.accessibilityRestrictions}</span>
      </div>
      ` : ''}
      ${data.notificationMethod ? `
      <div class="detail-row">
        <span class="detail-label">Notification Preference: </span>
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
