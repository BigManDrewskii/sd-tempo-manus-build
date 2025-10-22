import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Signature validation schema
const signatureSchema = z.object({
  proposalId: z.number().positive('Invalid proposal ID'),
  clientName: z.string().min(1, 'Client name is required').max(100, 'Name too long'),
  clientEmail: z.string().email('Invalid email address'),
  signatureData: z.string().min(10, 'Signature is required'),
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: 'Must agree to terms and conditions',
  }),
  signedAt: z.date().optional(),
});

// Helper to validate signature
function validateSignature(data: any) {
  return signatureSchema.safeParse(data);
}

// Helper to check if proposal can be signed
function canSignProposal(proposalStatus: string, alreadySigned: boolean): boolean {
  if (alreadySigned) return false;
  if (proposalStatus !== 'sent' && proposalStatus !== 'viewed') return false;
  return true;
}

describe('Signature Validation', () => {
  const validSignatureData = {
    proposalId: 123,
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
    agreedToTerms: true,
  };

  it('should validate a correct signature', () => {
    const result = validateSignature(validSignatureData);
    expect(result.success).toBe(true);
  });

  it('should reject signature without client name', () => {
    const invalid = { ...validSignatureData, clientName: '' };
    const result = validateSignature(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Client name is required');
    }
  });

  it('should reject signature with invalid email', () => {
    const invalid = { ...validSignatureData, clientEmail: 'not-an-email' };
    const result = validateSignature(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address');
    }
  });

  it('should reject signature without terms agreement', () => {
    const invalid = { ...validSignatureData, agreedToTerms: false };
    const result = validateSignature(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Must agree to terms and conditions');
    }
  });

  it('should reject signature with invalid proposal ID', () => {
    const invalid = { ...validSignatureData, proposalId: -1 };
    const result = validateSignature(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid proposal ID');
    }
  });

  it('should allow signing proposals with status "sent"', () => {
    expect(canSignProposal('sent', false)).toBe(true);
  });

  it('should allow signing proposals with status "viewed"', () => {
    expect(canSignProposal('viewed', false)).toBe(true);
  });

  it('should not allow signing draft proposals', () => {
    expect(canSignProposal('draft', false)).toBe(false);
  });

  it('should not allow signing already signed proposals', () => {
    expect(canSignProposal('sent', true)).toBe(false);
  });
});

