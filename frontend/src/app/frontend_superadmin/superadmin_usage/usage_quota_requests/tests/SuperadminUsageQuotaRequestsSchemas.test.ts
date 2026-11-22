import { describe, it, expect } from 'vitest';
import {
  ApproveQuotaRequestSchema,
  RejectQuotaRequestSchema,
} from '../schemas/SuperadminUsageQuotaRequestsSchemas';

describe('SuperadminUsageQuotaRequestsSchemas', () => {
  it('validates approve request form values successfully', () => {
    const valid = ApproveQuotaRequestSchema.safeParse({
      requestId: 'req-nalanda-branch-4',
      approvedLimit: 4,
      addonFeeMonthlyInr: 1500,
      reviewNotes: 'Authorized 4th branch expansion',
    });
    expect(valid.success).toBe(true);
  });

  it('rejects approval when limit is non-positive', () => {
    const invalid = ApproveQuotaRequestSchema.safeParse({
      requestId: 'req-1',
      approvedLimit: 0,
      addonFeeMonthlyInr: 0,
    });
    expect(invalid.success).toBe(false);
  });

  it('validates reject request form values and requires explanation', () => {
    const valid = RejectQuotaRequestSchema.safeParse({
      requestId: 'req-gyansagar-sms-10k',
      rejectionReason: 'Please switch to WhatsApp business notifications.',
    });
    expect(valid.success).toBe(true);

    const invalid = RejectQuotaRequestSchema.safeParse({
      requestId: 'req-gyansagar-sms-10k',
      rejectionReason: 'No', // Too short (< 5 chars)
    });
    expect(invalid.success).toBe(false);
  });
});
