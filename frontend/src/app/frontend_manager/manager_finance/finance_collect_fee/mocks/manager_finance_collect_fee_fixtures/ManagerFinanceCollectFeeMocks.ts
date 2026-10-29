import type { ManagerFinanceCollectFeeStudent } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';

export const MANAGER_FINANCE_COLLECT_FEE_STUDENTS: ManagerFinanceCollectFeeStudent[] = [
  { id: 1, name: 'Aarav Sharma',  smartId: 'STU001', phone: '8084350824', status: 'active',    dueAmount: 0,    plan: 'Premium Plan', shift: 'Morning', seat: 'A-01', validUpto: '10 Nov 2024' },
  { id: 2, name: 'Priya Patel',   smartId: 'STU002', phone: '8084350824', status: 'active',    dueAmount: 180000, plan: 'Basic Plan',   shift: 'Evening', seat: 'B-05', validUpto: '01 Oct 2024' },
  { id: 3, name: 'Rohan Kumar',   smartId: 'STU003', phone: '8084350824', status: 'expired',   dueAmount: 400000, plan: 'Premium Plan', shift: 'Night',   seat: 'C-12', validUpto: '15 Sep 2024' },
  { id: 4, name: 'Sneha Singh',   smartId: 'STU004', phone: '8084350824', status: 'suspended', dueAmount: 450000, plan: 'Basic Plan',   shift: 'Morning', seat: 'A-08', validUpto: '01 Sep 2024' },
  { id: 5, name: 'Vikram Rao',    smartId: 'STU005', phone: '8084350824', status: 'active',    dueAmount: 0,    plan: 'Elite Plan',   shift: 'Full Day','seat': 'D-03', validUpto: '20 Dec 2024' },
  { id: 6, name: 'Ananya Gupta',  smartId: 'STU006', phone: '8084350824', status: 'active',    dueAmount: 0,    plan: 'Basic Plan',   shift: 'Evening', seat: 'B-10', validUpto: '15 Nov 2024' },
];;
