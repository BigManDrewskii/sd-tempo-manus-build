import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Email sending validation schema
const emailSchema = z.object({
  to: z.string().email('Invalid recipient email'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  proposalId: z.number().positive('Invalid proposal ID'),
  senderName: z.string().min(1, 'Sender name is required'),
  message: z.string().max(1000, 'Message too long').optional(),
});

// Helper to validate email data
function validateEmail(data: any) {
  return emailSchema.safeParse(data);
}

// Helper to check if proposal can be sent
function canSendProposal(proposalStatus: string, hasRequiredFields: boolean): boolean {
  if (!hasRequiredFields) return false;
  // Can send draft or already sent proposals
  if (proposalStatus === 'signed') return false; // Don't send already signed proposals
  return true;
}

// Helper to generate email subject
function generateEmailSubject(projectName: string, senderName: string): string {
  return `Proposal: ${projectName} from ${senderName}`;
}

describe('Email Validation', () => {
  const validEmailData = {
    to: 'client@example.com',
    subject: 'Your Website Redesign Proposal',
    proposalId: 123,
    senderName: 'John Designer',
    message: 'Please review the attached proposal.',
  };

  it('should validate correct email data', () => {
    const result = validateEmail(validEmailData);
    expect(result.success).toBe(true);
  });

  it('should reject email with invalid recipient', () => {
    const invalid = { ...validEmailData, to: 'not-an-email' };
    const result = validateEmail(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid recipient email');
    }
  });

  it('should reject email without subject', () => {
    const invalid = { ...validEmailData, subject: '' };
    const result = validateEmail(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Subject is required');
    }
  });

  it('should reject email with subject too long', () => {
    const invalid = { ...validEmailData, subject: 'A'.repeat(201) };
    const result = validateEmail(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Subject too long');
    }
  });

  it('should allow email without optional message', () => {
    const { message, ...dataWithoutMessage } = validEmailData;
    const result = validateEmail(dataWithoutMessage);
    expect(result.success).toBe(true);
  });

  it('should reject email with message too long', () => {
    const invalid = { ...validEmailData, message: 'A'.repeat(1001) };
    const result = validateEmail(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Message too long');
    }
  });

  it('should allow sending draft proposals', () => {
    expect(canSendProposal('draft', true)).toBe(true);
  });

  it('should allow sending already sent proposals', () => {
    expect(canSendProposal('sent', true)).toBe(true);
  });

  it('should not allow sending signed proposals', () => {
    expect(canSendProposal('signed', true)).toBe(false);
  });

  it('should not allow sending without required fields', () => {
    expect(canSendProposal('draft', false)).toBe(false);
  });

  it('should generate correct email subject', () => {
    const subject = generateEmailSubject('Acme Website', 'John Designer');
    expect(subject).toBe('Proposal: Acme Website from John Designer');
  });
});

