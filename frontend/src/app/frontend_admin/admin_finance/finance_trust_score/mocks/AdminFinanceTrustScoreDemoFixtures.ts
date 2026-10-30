import type { AdminFinanceTrustScoreStudent } from '@/app/frontend_admin/admin_finance/finance_trust_score/types/AdminFinanceTrustScoreTypes';

export const ADMIN_FINANCE_DEMO_TRUST_SCORE_STUDENTS: readonly AdminFinanceTrustScoreStudent[] = [
  { rank: 1, studentName: 'Rahul Kumar', smartId: 'STU101', shift: 'Morning', trustScore: 92, totalPromises: 12, timesChanged: 0, fulfilledCount: 12, badge: 'reliable' },
  { rank: 2, studentName: 'Priya Singh', smartId: 'STU102', shift: 'Evening', trustScore: 85, totalPromises: 9, timesChanged: 1, fulfilledCount: 8, badge: 'reliable' },
  { rank: 3, studentName: 'Aman Verma', smartId: 'STU103', shift: 'Full Day', trustScore: 67, totalPromises: 15, timesChanged: 3, fulfilledCount: 9, badge: 'moderate' },
  { rank: 4, studentName: 'Sneha Patel', smartId: 'STU104', shift: 'Morning', trustScore: 45, totalPromises: 8, timesChanged: 4, fulfilledCount: 3, badge: 'low' },
  { rank: 5, studentName: 'Vikas Sharma', smartId: 'STU105', shift: 'Evening', trustScore: 78, totalPromises: 11, timesChanged: 2, fulfilledCount: 10, badge: 'moderate' },
  { rank: 6, studentName: 'Neha Gupta', smartId: 'STU106', shift: 'Full Day', trustScore: 33, totalPromises: 7, timesChanged: 5, fulfilledCount: 2, badge: 'low' },
];
