import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Proposal validation schema (simplified from actual schema)
const proposalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email'),
  projectName: z.string().min(1, 'Project name is required'),
  status: z.enum(['draft', 'sent', 'viewed', 'signed']).default('draft'),
});

describe('Proposal Creation Validation', () => {
  it('should validate a correct proposal', () => {
    const validProposal = {
      title: 'Website Redesign Proposal',
      clientName: 'Acme Corp',
      clientEmail: 'contact@acme.com',
      projectName: 'Acme Website',
      status: 'draft' as const,
    };

    const result = proposalSchema.safeParse(validProposal);
    expect(result.success).toBe(true);
  });

  it('should reject proposal with missing title', () => {
    const invalidProposal = {
      title: '',
      clientName: 'Acme Corp',
      clientEmail: 'contact@acme.com',
      projectName: 'Acme Website',
      status: 'draft' as const,
    };

    const result = proposalSchema.safeParse(invalidProposal);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required');
    }
  });

  it('should reject proposal with invalid email', () => {
    const invalidProposal = {
      title: 'Website Redesign',
      clientName: 'Acme Corp',
      clientEmail: 'invalid-email',
      projectName: 'Acme Website',
      status: 'draft' as const,
    };

    const result = proposalSchema.safeParse(invalidProposal);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email');
    }
  });

  it('should reject proposal with title too long', () => {
    const invalidProposal = {
      title: 'A'.repeat(201), // 201 characters
      clientName: 'Acme Corp',
      clientEmail: 'contact@acme.com',
      projectName: 'Acme Website',
      status: 'draft' as const,
    };

    const result = proposalSchema.safeParse(invalidProposal);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title too long');
    }
  });

  it('should default status to draft if not provided', () => {
    const proposalWithoutStatus = {
      title: 'Website Redesign',
      clientName: 'Acme Corp',
      clientEmail: 'contact@acme.com',
      projectName: 'Acme Website',
    };

    const result = proposalSchema.safeParse(proposalWithoutStatus);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe('draft');
    }
  });
});

