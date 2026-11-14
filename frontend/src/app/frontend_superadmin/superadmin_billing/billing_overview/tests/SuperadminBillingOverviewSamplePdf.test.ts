// RESPONSIBILITY: Define source-level test coverage for billing overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_overview/tests/SuperadminBillingOverviewSamplePdf.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SuperadminBillingCreateSampleInvoicePdf } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/utils/SuperadminBillingOverviewSamplePdf';

describe('SuperadminBillingCreateSampleInvoicePdf', () => {
  it('creates a PDF document that visibly disclaims live/tax status', () => {
    const pdf = SuperadminBillingCreateSampleInvoicePdf({ id: 'SAMPLE-001', tenant: 'Preview Tenant', date: '2026-10-14', amount: 1250, status: 'Sample', method: 'UPI', gst: 'SAMPLE' });
    expect(pdf.startsWith('%PDF-1.4')).toBe(true);
    expect(pdf).toContain('/Type /Catalog');
    expect(pdf).toContain('SAMPLE BILLING PREVIEW - NOT A TAX INVOICE');
    expect(pdf).toContain('Not evidence of a charge, payment, tax liability, or live tenant record.');
    expect(pdf.endsWith('%%EOF\n')).toBe(true);
  });

  it('escapes PDF delimiters in user-facing fields', () => {
    const pdf = SuperadminBillingCreateSampleInvoicePdf({ id: 'A(1)', tenant: 'B\\Corp', date: '2026-10-14', amount: 10, status: 'Sample', method: 'Cash', gst: 'N/A' });
    expect(pdf).toContain('Invoice ID: A\\(1\\)');
    expect(pdf).toContain('Tenant: B\\\\Corp');
  });
  it('rejects non-ASCII text instead of replacing characters with question marks', () => { expect(() => SuperadminBillingCreateSampleInvoicePdf({ id: 'SAMPLE-002', tenant: 'विद्यालय', date: '2026-10-14', amount: 100, status: 'Sample', method: 'UPI', gst: 'SAMPLE' })).toThrow(/ASCII only/); });
});
