'use client';

import { useState, useEffect } from 'react';
import { generateRSVPConfirmationEmail, generateAdminNotificationEmail, RSVPData } from '../../../lib/email-templates';

// Email template options using actual templates from email-templates.ts
const EMAIL_TEMPLATES = {
  'custom': {
    name: 'Custom Message',
    description: 'Write your own email content'
  },
  'rsvp_confirmation': {
    name: 'RSVP Confirmation',
    description: 'Beautiful confirmation email sent to guests after RSVP'
  },
  'admin_notification': {
    name: 'Admin Notification',
    description: 'Notification email sent to you when someone RSVPs'
  }
};

// Sample RSVP data for preview
const SAMPLE_RSVP_DATA: RSVPData = {
  name: 'John Smith',
  plusOneName: 'Jane Smith',
  canAttend: 'Yes',
  email: 'john@example.com',
  phone: '+1 (555) 123-4567',
  eventType: 'Western Wedding, May 23, Da Nang',
  accommodationDetails: true,
  transportationDetails: true,
  dietaryRestrictions: 'Vegetarian',
  accessibilityRestrictions: '',
  notificationMethod: 'email',
  notificationOther: '',
  instagramHandle: '@johnsmith'
};

export default function SendEmailAdmin() {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
    template: 'custom' as keyof typeof EMAIL_TEMPLATES,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Development-only page - should not be accessible in production
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Admin send-email page is not available in production');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.to,
          subject: formData.subject,
          htmlContent: formData.message.replace(/\n/g, '<br>'),
          textContent: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: 'Email sent successfully!' });
        setFormData({ to: '', subject: '', message: '', template: 'custom' });
      } else {
        setResult({ success: false, message: data.error || 'Failed to send email' });
      }
    } catch (error) {
      setResult({ success: false, message: 'Network error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTemplateChange = (template: keyof typeof EMAIL_TEMPLATES) => {
    setFormData((prev) => {
      const newData = { ...prev, template };
      
      if (template === 'rsvp_confirmation') {
        const emailTemplate = generateRSVPConfirmationEmail(SAMPLE_RSVP_DATA);
        newData.subject = emailTemplate.subject;
        newData.message = emailTemplate.text;
      } else if (template === 'admin_notification') {
        const emailTemplate = generateAdminNotificationEmail(SAMPLE_RSVP_DATA);
        newData.subject = emailTemplate.subject;
        newData.message = emailTemplate.text;
      }
      
      return newData;
    });
  };

  const getPreviewContent = () => {
    if (formData.template === 'custom') {
      return formData.message;
    } else if (formData.template === 'rsvp_confirmation') {
      const emailTemplate = generateRSVPConfirmationEmail(SAMPLE_RSVP_DATA);
      return emailTemplate.text;
    } else if (formData.template === 'admin_notification') {
      const emailTemplate = generateAdminNotificationEmail(SAMPLE_RSVP_DATA);
      return emailTemplate.text;
    }
    return formData.message;
  };

  const getPreviewHTML = () => {
    if (formData.template === 'rsvp_confirmation') {
      const emailTemplate = generateRSVPConfirmationEmail(SAMPLE_RSVP_DATA);
      return emailTemplate.html;
    } else if (formData.template === 'admin_notification') {
      const emailTemplate = generateAdminNotificationEmail(SAMPLE_RSVP_DATA);
      return emailTemplate.html;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-title mb-8 text-center">Send Email</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Selection */}
            <div>
              <label className="text-label block text-sm font-medium text-gray-700 mb-3">
                Email Template
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTemplateChange(key as keyof typeof EMAIL_TEMPLATES)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.template === key
                        ? 'border-gray-800 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-body-sm font-medium text-gray-800">{template.name}</div>
                    <div className="text-caption-sm text-gray-600">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient */}
            <div>
              <label htmlFor="to" className="text-label block text-sm font-medium text-gray-700 mb-2">
                To (Email Address) *
              </label>
              <input
                type="email"
                id="to"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                required
                className="text-input w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="guest@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="text-label block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="text-input w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Wedding Update"
              />
            </div>

            {/* Message Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="message" className="text-label block text-sm font-medium text-gray-700">
                  Message *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-caption-sm text-gray-600 hover:text-gray-800 underline"
                >
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
              
              {showPreview ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {getPreviewHTML() ? (
                    <div 
                      className="text-body-sm text-gray-800 max-h-96 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: getPreviewHTML() || '' }}
                    />
                  ) : (
                    <div className="text-body-sm whitespace-pre-wrap text-gray-800">
                      {getPreviewContent()}
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="text-input w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                  placeholder="Dear [Name],&#10;&#10;We hope this message finds you well..."
                />
              )}
            </div>

            {result && (
              <div className={`rounded-lg p-4 ${
                result.success 
                  ? 'bg-green-100 border border-green-300 text-green-700' 
                  : 'bg-red-100 border border-red-300 text-red-700'
              }`}>
                <p className="text-body-sm">{result.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !formData.to || !formData.subject || !formData.message}
              className="text-button-lg w-full border-2 border-gray-800 px-8 py-3 text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Email'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
