/**
 * Component-level Finance preview records. These are static layout fixtures only;
 * they are not live business data and must not be used to imply persisted operations.
 */
export const MANAGER_FINANCE_SAMPLE_RECEIPTS = [
  { id: 'SL360-TRX-99421-X', receiptNumber: 'REC-20260411-001', studentName: 'Aravind Sharma',  studentId: 'LIB-2024-883', phone: '9876543210', date: '2024-10-24T00:00:00Z', amount: 124900, lateFee: 0,     status: 'Completed', paymentMode: 'UPI',          planName: 'Premium Reading Zone (Monthly)',  shift: 'Morning', seat: 'A-01', collectedBy: 'Branch Manager Satyam' },
  { id: 'SL360-TRX-88310-Y', receiptNumber: 'REC-20260410-002', studentName: 'Gajodhar Prasad', studentId: 'STU-001234',   phone: '8765432109', date: '2026-04-10T00:00:00Z', amount: 171600, lateFee: 25000, status: 'Completed', paymentMode: 'UPI',          planName: 'Annual Library Membership',       shift: 'Evening', seat: 'B-05', collectedBy: 'Branch Manager Satyam' },
  { id: 'SL360-TRX-77203-Z', receiptNumber: 'REC-20260409-003', studentName: 'Sara Mishra',     studentId: 'STU-008821',   phone: '7654321098', date: '2024-10-10T00:00:00Z', amount: 975000, lateFee: 50000, status: 'Completed', paymentMode: 'Bank Transfer', planName: 'Security Deposit Refund',         shift: 'Night',   seat: 'C-12', collectedBy: 'Accountant Verma' },
  { id: 'SL360-TRX-66192-A', receiptNumber: 'REC-20260408-004', studentName: 'Rohan Khanna',    studentId: 'STU-007654',   phone: '6543210987', date: '2026-04-08T00:00:00Z', amount: 90000,  lateFee: 10000, status: 'Completed', paymentMode: 'Cash',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'D-10', collectedBy: 'Branch Manager Satyam' },
  { id: 'SL360-TRX-55081-B', receiptNumber: 'REC-20260407-005', studentName: 'Priya Nair',      studentId: 'STU-003891',   phone: '5432109876', date: '2026-04-07T00:00:00Z', amount: 240000, lateFee: 15000, status: 'Completed', paymentMode: 'Card',         planName: 'Quarterly Premium Plan',          shift: 'Full Day','seat': 'A-05', collectedBy: 'Front Desk Rahul' },
];

export const MANAGER_FINANCE_SAMPLE_INVOICES = [
  { id: '1', invoiceNumber: 'INV-20260411-001', studentName: 'Gajodhar Prasad', studentId: 'STU-001234', phone: '9876543210', invoiceDate: '2026-04-11T00:00:00Z', grandTotal: 171600, paymentStatus: 'paid',    paymentMode: 'UPI',          planName: 'Annual Library Membership',       shift: 'Evening', seat: 'B-05' },
  { id: '2', invoiceNumber: 'INV-20260410-002', studentName: 'Aravind Sharma',  studentId: 'STU-002567', phone: '8765432109', invoiceDate: '2026-04-10T00:00:00Z', grandTotal: 120000, paymentStatus: 'paid',    paymentMode: 'Cash',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'A-01' },
  { id: '3', invoiceNumber: 'INV-20260409-003', studentName: 'Priya Nair',      studentId: 'STU-003891', phone: '7654321098', invoiceDate: '2026-04-09T00:00:00Z', grandTotal: 240000, paymentStatus: 'pending', paymentMode: 'Bank Transfer', planName: 'Quarterly Premium Plan',          shift: 'Full Day','seat': 'A-05' },
  { id: '4', invoiceNumber: 'INV-20260408-004', studentName: 'Rohan Khanna',    studentId: 'STU-004312', phone: '6543210987', invoiceDate: '2026-04-08T00:00:00Z', grandTotal: 90000,  paymentStatus: 'paid',    paymentMode: 'Card',         planName: 'Monthly Basic Plan',              shift: 'Morning', seat: 'D-10' },
  { id: '5', invoiceNumber: 'INV-20260407-005', studentName: 'Sara Mishra',     studentId: 'STU-005678', phone: '5432109876', invoiceDate: '2026-04-07T00:00:00Z', grandTotal: 150000, paymentStatus: 'overdue', paymentMode: '',             planName: 'Half-Yearly Plan',                shift: 'Night',   seat: 'C-12' },
];

export const MANAGER_FINANCE_SAMPLE_REFERRERS = [
  { id: 1, name: 'Rahul Kumar',  smartId: 'STU101', referredNames: ['Priya S', 'Aman V', 'Sneha P', 'Vikas S', 'Neha G'], referredCount: 8, bonusEarned: 80000, redeemed: 30000, balance: 50000 },
  { id: 2, name: 'Priya Singh',  smartId: 'STU102', referredNames: ['Aman V', 'Rohan M'],                                   referredCount: 5, bonusEarned: 50000, redeemed: 20000, balance: 30000 },
  { id: 3, name: 'Aman Verma',   smartId: 'STU103', referredNames: ['Sneha P', 'Vikas S'],                                  referredCount: 4, bonusEarned: 40000, redeemed: 0,   balance: 40000 },
  { id: 4, name: 'Sneha Patel',  smartId: 'STU104', referredNames: ['Neha G', 'Rohan M', 'Kiran D'],                        referredCount: 3, bonusEarned: 30000, redeemed: 10000, balance: 20000 },
  { id: 5, name: 'Vikas Sharma', smartId: 'STU105', referredNames: ['Kiran D'],                                             referredCount: 2, bonusEarned: 20000, redeemed: 0,   balance: 20000 },
  { id: 6, name: 'Neha Gupta',   smartId: 'STU106', referredNames: ['Rohan M'],                                             referredCount: 1, bonusEarned: 10000, redeemed: 0,   balance: 10000 },
];

export const MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS = [
  { id: 1, studentName: 'Aarav Sharma',  smartId: 'STU001', plan: 'Premium Plan', shift: 'Morning', startDate: '2026-01-01', endDate: '2026-06-30', daysLeft: 12,  base: 1500000, discount: 0,    total: 1500000, paid: 1500000, due: 0,    status: 'active'    },
  { id: 2, studentName: 'Priya Patel',   smartId: 'STU002', plan: 'Basic Plan',   shift: 'Evening', startDate: '2025-11-01', endDate: '2026-04-30', daysLeft: 3,   base: 800000,  discount: 20000,  total: 780000,  paid: 600000, due: 180000, status: 'active'    },
  { id: 3, studentName: 'Rohan Kumar',   smartId: 'STU003', plan: 'Premium Plan', shift: 'Full Day',startDate: '2025-08-01', endDate: '2025-12-31', daysLeft: -15, base: 1800000, discount: 0,    total: 1800000, paid: 1800000,due: 0,    status: 'expired'   },
  { id: 4, studentName: 'Sneha Singh',   smartId: 'STU004', plan: 'Basic Plan',   shift: 'Morning', startDate: '2026-02-01', endDate: '2026-07-31', daysLeft: 45,  base: 900000,  discount: 0,    total: 900000,  paid: 450000, due: 450000, status: 'suspended' },
  { id: 5, studentName: 'Vikram Rao',    smartId: 'STU005', plan: 'Premium Plan', shift: 'Evening', startDate: '2025-10-01', endDate: '2025-12-31', daysLeft: -45, base: 1600000, discount: 50000,  total: 1550000, paid: 1550000,due: 0,    status: 'cancelled' },
  { id: 6, studentName: 'Ananya Gupta',  smartId: 'STU006', plan: 'Basic Plan',   shift: 'Full Day',startDate: '2026-03-01', endDate: '2026-08-31', daysLeft: 8,   base: 750000,  discount: 0,    total: 750000,  paid: 750000, due: 0,    status: 'active'    },
  { id: 7, studentName: 'Karan Mehta',   smartId: 'STU007', plan: 'Premium Plan', shift: 'Morning', startDate: '2025-09-01', endDate: '2026-02-28', daysLeft: -5,  base: 1400000, discount: 0,    total: 1400000, paid: 1000000,due: 400000, status: 'expired'   },
];

export const MANAGER_FINANCE_SAMPLE_AUTO_SUSPEND_CONFIG = { daysBeforeSuspend: 7, currentlySuspended: 4, autoRestoredThisMonth: 2, manualRestores: 1 };

export const MANAGER_FINANCE_SAMPLE_SUSPENDED_STUDENTS = [
  { id: 1, studentId: 101, studentName: 'Rahul Kumar',  smartId: 'STU101', seat: 'A-12', shift: 'Morning',  daysOverdue: 14, suspendedSince: '2026-03-28' },
  { id: 2, studentId: 102, studentName: 'Priya Singh',  smartId: 'STU102', seat: 'B-05', shift: 'Evening',  daysOverdue: 9,  suspendedSince: '2026-04-02' },
  { id: 3, studentId: 103, studentName: 'Aman Verma',   smartId: 'STU103', seat: 'C-18', shift: 'Full Day', daysOverdue: 21, suspendedSince: '2026-03-21' },
  { id: 4, studentId: 104, studentName: 'Sneha Patel',  smartId: 'STU104', seat: 'A-07', shift: 'Morning',  daysOverdue: 8,  suspendedSince: '2026-04-03' },
];

export const MANAGER_FINANCE_SAMPLE_TRUST_SCORE_STUDENTS = [
  { rank: 1, studentName: 'Rahul Kumar',  smartId: 'STU101', shift: 'Morning',  trustScore: 92, totalPromises: 12, timesChanged: 0, fulfilledCount: 12, badge: 'reliable' },
  { rank: 2, studentName: 'Priya Singh',  smartId: 'STU102', shift: 'Evening',  trustScore: 85, totalPromises: 9,  timesChanged: 1, fulfilledCount: 8,  badge: 'reliable' },
  { rank: 3, studentName: 'Aman Verma',   smartId: 'STU103', shift: 'Full Day', trustScore: 67, totalPromises: 15, timesChanged: 3, fulfilledCount: 9,  badge: 'moderate' },
  { rank: 4, studentName: 'Sneha Patel',  smartId: 'STU104', shift: 'Morning',  trustScore: 45, totalPromises: 8,  timesChanged: 4, fulfilledCount: 3,  badge: 'low'      },
  { rank: 5, studentName: 'Vikas Sharma', smartId: 'STU105', shift: 'Evening',  trustScore: 78, totalPromises: 11, timesChanged: 2, fulfilledCount: 10, badge: 'moderate' },
  { rank: 6, studentName: 'Neha Gupta',   smartId: 'STU106', shift: 'Full Day', trustScore: 33, totalPromises: 7,  timesChanged: 5, fulfilledCount: 2,  badge: 'low'      },
];

export const MANAGER_FINANCE_SAMPLE_RENEWALS = [
  { id: 1, studentName: 'Aarav Sharma',  smartId: 'STU001', shift: 'Morning', plan: 'Premium', planId: 2, expiryDate: '2026-04-05', daysLeft: -6,  lastPaymentDate: '2026-03-01', due: 149900, total: 149900 },
  { id: 2, studentName: 'Priya Patel',   smartId: 'STU002', shift: 'Evening', plan: 'Basic',   planId: 1, expiryDate: '2026-04-15', daysLeft: 4,   lastPaymentDate: '2026-03-15', due: 99900,  total: 99900  },
  { id: 3, studentName: 'Rohan Kumar',   smartId: 'STU003', shift: 'Morning', plan: 'Elite',   planId: 3, expiryDate: '2026-04-20', daysLeft: 12,  lastPaymentDate: '2026-03-20', due: 249900, total: 249900 },
  { id: 4, studentName: 'Ananya Singh',  smartId: 'STU004', shift: 'Evening', plan: 'Premium', planId: 2, expiryDate: '2026-04-08', daysLeft: -2,  lastPaymentDate: '2026-03-08', due: 149900, total: 149900 },
  { id: 5, studentName: 'Vikram Rao',    smartId: 'STU005', shift: 'Morning', plan: 'Basic',   planId: 1, expiryDate: '2026-04-16', daysLeft: 6,   lastPaymentDate: '2026-03-16', due: 99900,  total: 99900  },
  { id: 6, studentName: 'Sneha Gupta',   smartId: 'STU006', shift: 'Evening', plan: 'Elite',   planId: 3, expiryDate: '2026-04-22', daysLeft: 14,  lastPaymentDate: '2026-03-22', due: 249900, total: 249900 },
];

export const MANAGER_FINANCE_SAMPLE_PENDING_FINES = [
    { id: 'F-101', member: 'Rahul Sharma (LIB-001)', type: 'Overdue Book', amount: 15000, status: 'Pending', date: '2026-09-25' },
    { id: 'F-102', member: 'Priya Verma (LIB-022)', type: 'Lost Book Charge', amount: 50000, status: 'Pending', date: '2026-09-28' },
    { id: 'F-103', member: 'Amit Kumar (LIB-045)', type: 'Damage Charge', amount: 20000, status: 'Partially Paid', date: '2026-09-29' },
  ];

export const MANAGER_FINANCE_SAMPLE_PAYMENT_HISTORY = [
    { id: 'TXN-901', receipt: 'REC-26010', member: 'Sneha Patel (LIB-012)', type: 'Overdue Book', amount: 5000, mode: 'UPI', date: '2026-10-01 10:15', collectedBy: 'Manager' },
    { id: 'TXN-902', receipt: 'REC-26011', member: 'Rohan Gupta (LIB-034)', type: 'Late Fee', amount: 10000, mode: 'Cash', date: '2026-10-01 11:30', collectedBy: 'Staff A' },
  ];

export const MANAGER_FINANCE_SAMPLE_FINE_DASHBOARD_AMOUNTS = { totalPendingFines: 450000, todaysCollection: 125000, overdueFines: 210000, lostBookCharges: 150000, damageCharges: 85000 } as const;
