// RESPONSIBILITY: Define local sample fixtures for billing member invoices; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_billing/billing_member_invoices/mocks/fixtures/SuperadminBillingInvoicesMemberInvoicesMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.

/** Synthetic local preview fixture; it does not represent persisted backend state. */
export const SUPERADMIN_FINANCE_SAMPLE_INVOICES = [
  { id: '1', invoiceNumber: 'SAMPLE-INV-001', studentName: 'Sample Student A', studentId: 'STU-SAMPLE-001', phone: '0000000000', invoiceDate: '2026-04-11T00:00:00Z', grandTotal: 1716, paymentStatus: 'paid',    paymentMode: 'UPI',          planName: 'Annual Library Membership',       shift: 'Evening', seat: 'B-05' },
  { id: '2', invoiceNumber: 'SAMPLE-INV-002', studentName: 'Sample Student B',  studentId: 'STU-SAMPLE-002', phone: '0000000000', invoiceDate: '2026-04-10T00:00:00Z', grandTotal: 1200, paymentStatus: 'paid',    paymentMode: 'Cash',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'A-01' },
  { id: '3', invoiceNumber: 'SAMPLE-INV-003', studentName: 'Sample Student C',      studentId: 'STU-SAMPLE-003', phone: '0000000000', invoiceDate: '2026-04-09T00:00:00Z', grandTotal: 2400, paymentStatus: 'pending', paymentMode: 'Bank Transfer', planName: 'Quarterly Premium Plan',          shift: 'Full Day','seat': 'A-05' },
  { id: '4', invoiceNumber: 'SAMPLE-INV-004', studentName: 'Sample Student D',    studentId: 'STU-SAMPLE-004', phone: '0000000000', invoiceDate: '2026-04-08T00:00:00Z', grandTotal: 900,  paymentStatus: 'paid',    paymentMode: 'Card',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'D-10' },
  { id: '5', invoiceNumber: 'SAMPLE-INV-005', studentName: 'Sample Student E',     studentId: 'STU-SAMPLE-005', phone: '0000000000', invoiceDate: '2026-04-07T00:00:00Z', grandTotal: 1500, paymentStatus: 'overdue', paymentMode: '',             planName: 'Half-Yearly Plan',                shift: 'Night',   seat: 'C-12' },
];
