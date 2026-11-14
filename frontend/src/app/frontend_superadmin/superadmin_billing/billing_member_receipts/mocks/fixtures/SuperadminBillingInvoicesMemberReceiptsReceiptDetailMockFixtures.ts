// RESPONSIBILITY: Define local sample fixtures for billing member receipts; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_member_receipts/mocks/fixtures/SuperadminBillingInvoicesMemberReceiptsReceiptDetailMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.

/** Synthetic local preview fixture; it does not represent persisted backend state. */
export const SUPERADMIN_FINANCE_SAMPLE_RECEIPT_DETAIL = {
  id:          'SAMPLE-TRX-001',
  receiptNo:   'SAMPLE-REC-001',
  date:        'Sample date — not a transaction date',
  studentName: 'Sample Student A',
  studentId:   'STU-SAMPLE-001',
  phone:       '0000000000',
  shift:       'Sample shift',
  seat:        'Sample seat',
  plan:        'Sample plan (preview only)',
  items: [
    { labelKey: 'COPY.SAMPLE_SUBSCRIPTION_LINE', amount: 1200 },
    { labelKey: 'COPY.SAMPLE_PROCESSING_LINE', amount: 49 },
  ],
  total:       1249,
  paymentMode: 'Sample only — not paid',
  txnId:       'SAMPLE-NO-TRANSACTION',
};
