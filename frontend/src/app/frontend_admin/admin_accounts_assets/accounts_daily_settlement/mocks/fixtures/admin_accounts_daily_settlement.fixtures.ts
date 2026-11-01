// mocks/fixtures/admin_accounts_daily_settlement.fixtures.ts
import type { DailySettlementRecord, DailySettlementKpiSummary } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';

export const ADMIN_DAILY_SETTLEMENT_FIXTURES: DailySettlementRecord[] = [
  {
    id: 'stl-delhi-001',
    date: '2026-11-01',
    branchId: 'br-karol-bagh',
    branchName: 'Karol Bagh Central',
    shiftName: 'Evening Shift (2 PM - 10 PM)',
    managerId: 'mgr-rahul-01',
    managerName: 'Rahul Sharma',
    openingCash: 300000, // ₹3,000.00
    cashCollected: 850000, // ₹8,500.00
    upiCollected: 1420000, // ₹14,200.00
    expensesPaid: 120000, // ₹1,200.00
    expectedClosingCash: 1030000, // ₹10,300.00
    actualHandoverCash: 1030000, // ₹10,300.00
    difference: 0,
    bankDepositSlipUrl: 'https://placehold.co/600x400/png?text=Deposit+Slip+UPI-HDFC-9921',
    bankReferenceNumber: 'HDFC-DEP-9921884',
    managerNotes: 'All student cash collected for November renewals. ₹1,200 paid for water jar & sanitation.',
    adminNotes: null,
    status: 'PENDING_APPROVAL',
    createdAt: '2026-11-01T21:45:00Z',
    approvedAt: null,
    approvedBy: null,
  },
  {
    id: 'stl-delhi-002',
    date: '2026-11-01',
    branchId: 'br-laxmi-nagar',
    branchName: 'Laxmi Nagar Hub',
    shiftName: 'Morning Shift (6 AM - 2 PM)',
    managerId: 'mgr-priya-02',
    managerName: 'Priya Verma',
    openingCash: 200000, // ₹2,000.00
    cashCollected: 1500000, // ₹15,000.00
    upiCollected: 2150000, // ₹21,500.00
    expensesPaid: 50000, // ₹500.00
    expectedClosingCash: 1650000, // ₹16,500.00
    actualHandoverCash: 1550000, // ₹15,500.00
    difference: -100000, // -₹1,000.00 shortage
    bankDepositSlipUrl: 'https://placehold.co/600x400/png?text=ICICI+Transfer+Slip',
    bankReferenceNumber: 'ICICI-IMPS-449120',
    managerNotes: '₹1,000 short due to emergency plumber call cash advance. Slip attached.',
    adminNotes: null,
    status: 'PENDING_APPROVAL',
    createdAt: '2026-11-01T14:30:00Z',
    approvedAt: null,
    approvedBy: null,
  },
  {
    id: 'stl-delhi-003',
    date: '2026-10-31',
    branchId: 'br-karol-bagh',
    branchName: 'Karol Bagh Central',
    shiftName: 'Morning Shift (6 AM - 2 PM)',
    managerId: 'mgr-rahul-01',
    managerName: 'Rahul Sharma',
    openingCash: 200000,
    cashCollected: 1200000,
    upiCollected: 1800000,
    expensesPaid: 0,
    expectedClosingCash: 1400000,
    actualHandoverCash: 1400000,
    difference: 0,
    bankDepositSlipUrl: 'https://placehold.co/600x400/png?text=Bank+Challan+0319',
    bankReferenceNumber: 'SBI-CHALLAN-031922',
    managerNotes: 'Direct bank counter deposit in SBI Pusa Road branch.',
    adminNotes: 'Verified against SBI bank statement. Transaction cleared.',
    status: 'APPROVED',
    createdAt: '2026-10-31T14:40:00Z',
    approvedAt: '2026-10-31T16:15:00Z',
    approvedBy: 'Admin Satyam',
  },
  {
    id: 'stl-delhi-004',
    date: '2026-10-31',
    branchId: 'br-mukherjee-nagar',
    branchName: 'Mukherjee Nagar Study Center',
    shiftName: 'Night Shift (10 PM - 6 AM)',
    managerId: 'mgr-vikas-03',
    managerName: 'Vikas Kumar',
    openingCash: 150000,
    cashCollected: 750000,
    upiCollected: 950000,
    expensesPaid: 0,
    expectedClosingCash: 900000,
    actualHandoverCash: 700000,
    difference: -200000, // -₹2,000.00
    bankDepositSlipUrl: null,
    bankReferenceNumber: null,
    managerNotes: 'Cash drawer count mismatch. Locker key was missing for 2 hours.',
    adminNotes: 'Physical drawer mismatch detected. CCTV audit initiated with branch security.',
    status: 'DISCREPANCY_FLAGGED',
    createdAt: '2026-10-31T06:30:00Z',
    approvedAt: null,
    approvedBy: 'Admin Satyam',
  },
  {
    id: 'stl-delhi-005',
    date: '2026-10-30',
    branchId: 'br-noida-62',
    branchName: 'Noida Sector 62 Campus',
    shiftName: 'General Shift (8 AM - 8 PM)',
    managerId: 'mgr-sunita-04',
    managerName: 'Sunita Rao',
    openingCash: 250000,
    cashCollected: 2000000,
    upiCollected: 3500000,
    expensesPaid: 50000,
    expectedClosingCash: 2200000,
    actualHandoverCash: 2200000,
    difference: 0,
    bankDepositSlipUrl: 'https://placehold.co/600x400/png?text=HDFC+CDM+Slip+Noida',
    bankReferenceNumber: 'HDFC-CDM-772199',
    managerNotes: 'Deposited into HDFC Cash Deposit Machine at Sector 62 market.',
    adminNotes: 'Verified CDM receipt and statement credit.',
    status: 'APPROVED',
    createdAt: '2026-10-30T20:30:00Z',
    approvedAt: '2026-10-30T21:10:00Z',
    approvedBy: 'Admin Satyam',
  },
];

export const ADMIN_DAILY_SETTLEMENT_KPI_FIXTURES: DailySettlementKpiSummary = {
  expectedCashToday: 2680000, // ₹26,800.00
  clearedCashToday: 3600000, // ₹36,000.00
  pendingHandoverAmount: 2580000, // ₹25,800.00
  discrepancyShortageAmount: 300000, // ₹3,000.00
  totalPendingCount: 2,
  totalFlaggedCount: 1,
};

