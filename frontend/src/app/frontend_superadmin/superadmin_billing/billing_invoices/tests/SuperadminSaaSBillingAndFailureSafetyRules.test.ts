// RESPONSIBILITY: Validate Platform SaaS Billing, Invoices, GST calculations, and Failure Safety Rules.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BILLING_SAMPLE_INVOICES } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/mocks/fixtures/SuperadminBillingInvoicesSampleMockFixtures';

describe('Superadmin SaaS Billing & Failure Safety Suite', () => {
  it('enforces sequential invoice format INV-2026-XXXX on platform records', () => {
    SUPERADMIN_BILLING_SAMPLE_INVOICES.forEach((inv) => {
      expect(inv.id).toMatch(/^INV-2026-\d{4}$/);
    });
  });

  it('verifies GST breakdown calculation (CGST + SGST for intra-state, IGST for inter-state)', () => {
    // Intra-state invoice with CGST and SGST
    const intra = SUPERADMIN_BILLING_SAMPLE_INVOICES.find((i) => i.cgst && i.sgst);
    expect(intra).toBeDefined();
    if (intra && intra.subtotal && intra.cgst && intra.sgst) {
      expect(intra.cgst).toBe(Math.round(intra.subtotal * 0.09));
      expect(intra.sgst).toBe(Math.round(intra.subtotal * 0.09));
      expect(intra.amount).toBe(intra.subtotal + intra.cgst + intra.sgst);
    }

    // Inter-state invoice with IGST
    const inter = SUPERADMIN_BILLING_SAMPLE_INVOICES.find((i) => i.igst);
    expect(inter).toBeDefined();
    if (inter && inter.subtotal && inter.igst) {
      expect(inter.igst).toBe(Math.round(inter.subtotal * 0.18));
      expect(inter.amount).toBe(inter.subtotal + inter.igst);
    }
  });

  it('tracks failed payments with retry counts and detailed failure reasons', () => {
    const failed = SUPERADMIN_BILLING_SAMPLE_INVOICES.find((i) => i.status === 'Failed');
    expect(failed).toBeDefined();
    expect(failed?.retryCount).toBeGreaterThanOrEqual(1);
    expect(failed?.failureReason).toBeTruthy();
    expect(failed?.failureReason).toContain('Grace Period');
  });

  it('supports multiple payment gateways: Razorpay, Stripe, UPI', () => {
    const gateways = new Set(SUPERADMIN_BILLING_SAMPLE_INVOICES.map((i) => i.gateway).filter(Boolean));
    expect(gateways.has('Razorpay')).toBe(true);
    expect(gateways.has('Stripe')).toBe(true);
    expect(gateways.has('UPI')).toBe(true);
  });

  it('tracks refunded subscriptions and links credit notes', () => {
    const refunded = SUPERADMIN_BILLING_SAMPLE_INVOICES.find((i) => i.status === 'Refunded');
    expect(refunded).toBeDefined();
    expect(refunded?.creditNoteId).toBeTruthy();
    expect(refunded?.creditNoteId).toMatch(/^CN-2026-\d{4}$/);
  });
});
