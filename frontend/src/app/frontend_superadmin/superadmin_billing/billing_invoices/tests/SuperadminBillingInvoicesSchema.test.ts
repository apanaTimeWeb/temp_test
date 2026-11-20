import { describe, expect, it } from 'vitest';
import { SUPERADMIN_CREATE_INVOICE_SCHEMA } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/schemas/superadmin_billing_invoices.schema';

describe('Superadmin Billing Invoices Schemas', () => {
  it('validates a valid invoice creation payload with sequential format INV-2026-XXXX', () => {
    const valid = {
      invoiceId: 'INV-2026-0099',
      tenant: 'City Library Central',
      legalName: 'City Library Society',
      subtotal: 15000,
      discount: 0,
      taxType: 'intra',
      method: 'UPI',
      status: 'Paid',
      billingCycle: 'Annual',
      gst: '07AAACS9988D1Z2',
    };
    const res = SUPERADMIN_CREATE_INVOICE_SCHEMA.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('rejects an invalid invoice ID format', () => {
    const invalid = {
      invoiceId: 'INVALID-INV-1',
      tenant: 'City Library Central',
      subtotal: 15000,
      taxType: 'intra',
      method: 'UPI',
      status: 'Paid',
      billingCycle: 'Annual',
    };
    const res = SUPERADMIN_CREATE_INVOICE_SCHEMA.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});
