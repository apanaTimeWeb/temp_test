import type { AdminFinanceDemoReferrer } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';

export const ADMIN_FINANCE_DEMO_REFERRERS: AdminFinanceDemoReferrer[] = [
  { id: 1, name: 'Rahul Kumar',  smartId: 'STU101', referredNames: ['Priya S', 'Aman V', 'Sneha P', 'Vikas S', 'Neha G'], bonusEarned: 50000, redeemed: 30000, balance: 20000 },
  { id: 2, name: 'Priya Singh',  smartId: 'STU102', referredNames: ['Aman V', 'Rohan M'], bonusEarned: 20000, redeemed: 20000, balance: 0 },
  { id: 3, name: 'Aman Verma',   smartId: 'STU103', referredNames: ['Sneha P', 'Vikas S'], bonusEarned: 20000, redeemed: 0,   balance: 20000 },
  { id: 4, name: 'Sneha Patel',  smartId: 'STU104', referredNames: ['Neha G', 'Rohan M', 'Kiran D'], bonusEarned: 30000, redeemed: 10000, balance: 20000 },
  { id: 5, name: 'Vikas Sharma', smartId: 'STU105', referredNames: ['Kiran D'], bonusEarned: 10000, redeemed: 0,   balance: 10000 },
  { id: 6, name: 'Neha Gupta',   smartId: 'STU106', referredNames: ['Rohan M'], bonusEarned: 10000, redeemed: 0,   balance: 10000 },
];
