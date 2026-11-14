// RESPONSIBILITY: Define local sample fixtures for billing member invoices; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_member_invoices/mocks/fixtures/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.

/** Synthetic local preview fixture; it does not represent persisted backend state. */
export const SUPERADMIN_FINANCE_SAMPLE_INVOICE_DETAIL = {
  invoiceNumber:        'SAMPLE-INV-001',
  libraryName:          'Demo Library — Sample Only',
  libraryAddress:       'Sample address — not a real business',
  libraryGstin:         'SAMPLE-GSTIN-NOT-VALID',
  libraryPhone:         '0000000000',
  studentName:          'Sample Student A',
  studentSmartId:       'STU-SAMPLE-001',
  studentPhone:         '0000000000',
  studentAddress:       'Sample address — not a real person',
  invoiceDate:          '2026-01-01T00:00:00Z',
  paymentDate:          '2026-01-01T00:00:00Z',
  shift:                'Evening',
  seat:                 'B-05',
  items: [
    { description: 'Annual Library Membership', hsnCode: '9992', duration: '12 months', amount: 1200, gstPercent: 18, gstAmount: 216 },
    { description: 'Book Issue Fee',            hsnCode: '9992', duration: '—',         amount: 300,  gstPercent: 0,  gstAmount: 0   },
  ],
  subtotal:             1500,
  totalGst:             216,
  grandTotal:           1716,
  paymentMode:          'UPI',
  paymentTransactionId: 'SAMPLE-NO-TRANSACTION',
  paymentStatus:        'sample-only',
};
