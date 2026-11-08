import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';

export interface ManagerReferralMemberCandidate {
  name: string;
  id: string;
  phone: string;
  seat: string;
  status: 'Active' | 'Suspended' | 'Expired';
}

export const MANAGER_REFERRAL_MEMBER_CANDIDATES: ManagerReferralMemberCandidate[] = [
  { name: 'Amit Sharma', id: 'LIB-1042', phone: '9876543210', seat: 'Seat #12A', status: 'Active' },
  { name: 'Priya Patel', id: 'LIB-1088', phone: '9822334455', seat: 'Seat #05B', status: 'Active' },
  { name: 'Vikram Singh', id: 'LIB-1120', phone: '9733445566', seat: 'Seat #22', status: 'Active' },
  { name: 'Ananya Roy', id: 'LIB-1155', phone: '9644556677', seat: 'Seat #18', status: 'Active' },
  { name: 'Rahul Gupta', id: 'LIB-1190', phone: '9555667788', seat: 'Seat #09', status: 'Active' },
  { name: 'Neha Verma', id: 'LIB-1204', phone: '9466778899', seat: 'Seat #31', status: 'Active' },
  { name: 'Rohan Verma', id: 'LIB-1215', phone: '9377889900', seat: 'General', status: 'Active' },
  { name: 'Sneha Rao', id: 'LIB-1222', phone: '9288990011', seat: 'General', status: 'Active' },
  { name: 'Karan Malhotra', id: 'LIB-1230', phone: '9199001122', seat: 'General', status: 'Active' },
  { name: 'Pooja Iyer', id: 'LIB-1245', phone: '9100112233', seat: 'General', status: 'Active' },
];

export function getInitialReferrals(): ReferralRow[] {
  const today = new Date();
  const d = (daysAgo: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().slice(0, 10);
  };
  return [
    { id: 'REF-101', referrer: 'Amit Sharma (LIB-1042)', referred: 'Rohan Verma', date: d(1), status: 'Credited', bonus: '₹500', method: 'Fee Discount' },
    { id: 'REF-102', referrer: 'Priya Patel (LIB-1088)', referred: 'Sneha Rao', date: d(2), status: 'Credited', bonus: '₹500', method: 'UPI Cash' },
    { id: 'REF-103', referrer: 'Vikram Singh (LIB-1120)', referred: 'Karan Malhotra', date: d(0), status: 'Pending', bonus: '₹500', method: 'Fee Discount' },
    { id: 'REF-104', referrer: 'Ananya Roy (LIB-1155)', referred: 'Pooja Iyer', date: d(15), status: 'Credited', bonus: '₹500', method: 'Fee Discount' },
    { id: 'REF-105', referrer: 'Rahul Gupta (LIB-1190)', referred: 'Aditya Mehra', date: d(5), status: 'Pending', bonus: '₹500', method: 'UPI Cash' },
    { id: 'REF-106', referrer: 'Neha Verma (LIB-1204)', referred: 'Siddharth Jain', date: d(8), status: 'Credited', bonus: '₹500', method: 'Fee Discount' },
  ];
}

