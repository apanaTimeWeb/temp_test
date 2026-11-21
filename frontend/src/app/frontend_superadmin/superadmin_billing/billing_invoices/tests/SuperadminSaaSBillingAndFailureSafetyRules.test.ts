// RESPONSIBILITY: Validate Platform SaaS Billing, Invoices, GST calculations, and Failure Safety Rules.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_BILLING_SAMPLE_INVOICES } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/mocks/fixtures/SuperadminBillingInvoicesSampleMockFixtures';
import { CANONICAL_LIBRARY_TENANTS } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/components/SuperadminBillingCreateInvoiceModal';

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

  it('pre-populates canonical library dropdown with default "City Central Library" in invoice creation', () => {
    expect(CANONICAL_LIBRARY_TENANTS.length).toBeGreaterThanOrEqual(8);
    const defaultLib = CANONICAL_LIBRARY_TENANTS[0];
    expect(defaultLib.name).toBe('City Central Library');
    expect(defaultLib.legalName).toBe('Central Library Educational Society');
    expect(defaultLib.gst).toMatch(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/);
    expect(defaultLib.billingAddress).toBeTruthy();
    expect(defaultLib.cityStatePin).toContain('Lucknow');
    expect(defaultLib.defaultTaxType).toBe('intra');

    // All registered libraries have complete profile data for automated invoice creation
    CANONICAL_LIBRARY_TENANTS.forEach((lib) => {
      expect(lib.name).toBeTruthy();
      expect(lib.legalName).toBeTruthy();
      expect(lib.gst).toMatch(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/);
      expect(lib.billingAddress).toBeTruthy();
      expect(lib.cityStatePin).toBeTruthy();
      expect(lib.email).toContain('@');
      expect(lib.phone).toMatch(/^\+91/);
      expect(['intra', 'inter']).toContain(lib.defaultTaxType);
    });
  });
});
