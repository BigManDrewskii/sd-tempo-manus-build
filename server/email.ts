import { Resend } from 'resend';
import crypto from 'crypto';

// Initialize Resend with API key from environment
// For now, we'll use a placeholder - user needs to add RESEND_API_KEY to env
const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder');

// Email configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 'proposals@tempo.app';
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Tempo Proposals';
const APP_URL = process.env.VITE_APP_URL || 'http://localhost:3000';

/**
 * Generate a unique tracking token for email tracking
 */
export function generateTrackingToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Build proposal email HTML template
 */
export function buildProposalEmailHtml(params: {
  proposalTitle: string;
  senderName: string;
  clientName: string;
  projectName: string;
  expirationDate: string;
  customMessage?: string;
  proposalUrl: string;
  trackingPixelUrl: string;
}): string {
  const {
    proposalTitle,
    senderName,
    clientName,
    projectName,
    expirationDate,
    customMessage,
    proposalUrl,
    trackingPixelUrl,
  } = params;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${proposalTitle}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  
  <!-- Tracking pixel for open tracking -->
  <img src="${trackingPixelUrl}" width="1" height="1" style="display:none" alt="" />
  
  <div style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #644a40 0%, #8b6f5c 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 28px; font-weight: 600;">${proposalTitle}</h1>
      <p style="margin: 0; color: #ffdfb5; font-size: 16px;">From ${senderName}</p>
    </div>
    
    <!-- Custom Message -->
    ${customMessage ? `
    <div style="padding: 30px; border-bottom: 1px solid #e0e0e0;">
      <p style="margin: 0; color: #333; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${customMessage}</p>
    </div>
    ` : ''}
    
    <!-- Proposal Summary -->
    <div style="padding: 30px;">
      <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #644a40;">Proposal Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; font-weight: 600;">Client:</td>
          <td style="padding: 10px 0; color: #333; font-size: 14px; text-align: right;">${clientName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; font-weight: 600;">Project:</td>
          <td style="padding: 10px 0; color: #333; font-size: 14px; text-align: right;">${projectName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #666; font-size: 14px; font-weight: 600;">Valid Until:</td>
          <td style="padding: 10px 0; color: #333; font-size: 14px; text-align: right;">${expirationDate}</td>
        </tr>
      </table>
    </div>
    
    <!-- CTA Button -->
    <div style="padding: 0 30px 40px 30px; text-align: center;">
      <a href="${proposalUrl}" style="display: inline-block; background: #644a40; color: white; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(100, 74, 64, 0.2);">View Interactive Proposal</a>
      <p style="margin: 20px 0 0 0; color: #666; font-size: 14px;">This proposal includes interactive pricing calculators and digital signature capabilities.</p>
    </div>
    
    <!-- Footer -->
    <div style="background: #f9f9f9; padding: 20px 30px; border-top: 1px solid #e0e0e0; text-align: center;">
      <p style="margin: 0; color: #999; font-size: 13px;">Powered by <strong style="color: #644a40;">Tempo</strong></p>
      <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">Interactive Proposal Platform</p>
    </div>
    
  </div>
  
  <!-- Spacer -->
  <div style="height: 40px;"></div>
  
</body>
</html>
  `.trim();
}

/**
 * Build reminder email HTML template
 */
export function buildReminderEmailHtml(params: {
  proposalTitle: string;
  senderName: string;
  clientName: string;
  daysUntilExpiration: number;
  proposalUrl: string;
  trackingPixelUrl: string;
}): string {
  const {
    proposalTitle,
    senderName,
    clientName,
    daysUntilExpiration,
    proposalUrl,
    trackingPixelUrl,
  } = params;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reminder: ${proposalTitle}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  
  <!-- Tracking pixel -->
  <img src="${trackingPixelUrl}" width="1" height="1" style="display:none" alt="" />
  
  <div style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header with urgency -->
    <div style="background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0 0 10px 0; color: #ffffff; font-size: 28px; font-weight: 600;">⏰ Reminder</h1>
      <p style="margin: 0; color: #fff; font-size: 16px;">Your proposal expires in ${daysUntilExpiration} day${daysUntilExpiration !== 1 ? 's' : ''}</p>
    </div>
    
    <!-- Message -->
    <div style="padding: 30px;">
      <p style="margin: 0 0 20px 0; color: #333; font-size: 16px;">Hi ${clientName},</p>
      <p style="margin: 0 0 20px 0; color: #333; font-size: 16px;">This is a friendly reminder that your proposal <strong>"${proposalTitle}"</strong> from ${senderName} will expire soon.</p>
      <p style="margin: 0; color: #333; font-size: 16px;">Please review and sign the proposal before it expires to move forward with the project.</p>
    </div>
    
    <!-- CTA Button -->
    <div style="padding: 0 30px 40px 30px; text-align: center;">
      <a href="${proposalUrl}" style="display: inline-block; background: #d97706; color: white; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(217, 119, 6, 0.2);">Review Proposal Now</a>
    </div>
    
    <!-- Footer -->
    <div style="background: #f9f9f9; padding: 20px 30px; border-top: 1px solid #e0e0e0; text-align: center;">
      <p style="margin: 0; color: #999; font-size: 13px;">Powered by <strong style="color: #644a40;">Tempo</strong></p>
    </div>
    
  </div>
  
</body>
</html>
  `.trim();
}

/**
 * Send a proposal email to a client
 */
export async function sendProposalEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'placeholder') {
      console.warn('[Email] RESEND_API_KEY not configured, skipping email send');
      return {
        success: false,
        error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.',
      };
    }

    const { data, error } = await resend.emails.send({
      from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      console.error('[Email] Failed to send email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    console.log('[Email] Email sent successfully:', data?.id);
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error('[Email] Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get tracking pixel URL for email open tracking
 */
export function getTrackingPixelUrl(trackingToken: string): string {
  return `${APP_URL}/api/track/open/${trackingToken}`;
}

/**
 * Get proposal URL with tracking token
 */
export function getProposalUrlWithTracking(proposalId: number, trackingToken: string): string {
  return `${APP_URL}/proposal/${proposalId}?t=${trackingToken}`;
}

