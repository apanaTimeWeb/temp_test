// RESPONSIBILITY: Define local sample fixtures for billing member receipts; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_member_receipts/mocks/fixtures/SuperadminBillingInvoicesMemberReceiptsMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.

/** Synthetic local preview fixture; it does not represent persisted backend state. */
export const SUPERADMIN_FINANCE_SAMPLE_RECEIPTS = [
  { id: 'SAMPLE-TRX-001', receiptNumber: 'SAMPLE-REC-001', studentName: 'Sample Student A',  studentId: 'STU-SAMPLE-001', phone: '0000000000', date: '2024-10-24T00:00:00Z', amount: 1249, paymentMode: 'UPI',          planName: 'Premium Reading Zone (Monthly)',  shift: 'Morning', seat: 'A-01' },
  { id: 'SAMPLE-TRX-002', receiptNumber: 'SAMPLE-REC-002', studentName: 'Sample Student B', studentId: 'STU-SAMPLE-002',   phone: '0000000000', date: '2026-04-10T00:00:00Z', amount: 1716, paymentMode: 'UPI',          planName: 'Annual Library Membership',       shift: 'Evening', seat: 'B-05' },
  { id: 'SAMPLE-TRX-003', receiptNumber: 'SAMPLE-REC-003', studentName: 'Sample Student C',     studentId: 'STU-SAMPLE-003',   phone: '0000000000', date: '2024-10-10T00:00:00Z', amount: 9750, paymentMode: 'Bank Transfer', planName: 'Security Deposit Refund',         shift: 'Night',   seat: 'C-12' },
  { id: 'SAMPLE-TRX-004', receiptNumber: 'SAMPLE-REC-004', studentName: 'Sample Student D',    studentId: 'STU-SAMPLE-004',   phone: '0000000000', date: '2026-04-08T00:00:00Z', amount: 900,  paymentMode: 'Cash',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'D-10' },
  { id: 'SAMPLE-TRX-005', receiptNumber: 'SAMPLE-REC-005', studentName: 'Sample Student E',      studentId: 'STU-SAMPLE-005',   phone: '0000000000', date: '2026-04-07T00:00:00Z', amount: 2400, paymentMode: 'Card',         planName: 'Quarterly Premium Plan',          shift: 'Full Day','seat': 'A-05' },
];
