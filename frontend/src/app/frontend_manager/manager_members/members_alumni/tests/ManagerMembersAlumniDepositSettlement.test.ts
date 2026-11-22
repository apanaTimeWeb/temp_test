import {
checkMemberDepositSettlement,
getDepositSettlementFinanceUrl,
settleAndRefundDepositInLedger,
} from '@/app/frontend_manager/manager_members/members_alumni/utils/ManagerMembersAlumniDepositSettlement';
import { beforeEach,describe,expect,it,vi } from 'vitest';

describe('ManagerMembersAlumniDepositSettlement', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('checkMemberDepositSettlement', () => {
    it('returns No Deposit when student is null or undefined', () => {
      expect(checkMemberDepositSettlement(null)).toEqual({
        hasHeldDeposit: false,
        amount: 0,
        status: 'No Deposit',
      });
    });

    it('identifies held deposit from manager_finance_security_deposits_records', () => {
      localStorage.setItem(
        'manager_finance_security_deposits_records',
        JSON.stringify([
          {
            id: 'DEP-101',
            studentName: 'Aarav Sharma',
            smartId: 'LIB-991',
            phone: '9876500022',
            depositAmount: 50000, // 500 rupees in paise minor units
            status: 'held',
            receiptNumber: 'DEP-REC-101',
          },
        ])
      );

      const result = checkMemberDepositSettlement({
        id: 'LIB-991',
        name: 'Aarav Sharma',
        phone: '9876500022',
      });

      expect(result.hasHeldDeposit).toBe(true);
      expect(result.amount).toBe(500);
      expect(result.status).toBe('Held');
      expect(result.receiptNumber).toBe('DEP-REC-101');
    });

    it('identifies already refunded deposit and reports clearance verified', () => {
      localStorage.setItem(
        'manager_finance_security_deposits_records',
        JSON.stringify([
          {
            id: 'DEP-102',
            studentName: 'Priya Verma',
            smartId: 'LIB-992',
            phone: '9876500023',
            depositAmount: 100000,
            status: 'refunded',
          },
        ])
      );

      const result = checkMemberDepositSettlement({
        id: 'LIB-992',
        name: 'Priya Verma',
        phone: '9876500023',
      });

      expect(result.hasHeldDeposit).toBe(false);
      expect(result.status).toBe('Refunded');
    });

    it('falls back to locker deposit when member has locker assigned without finance record', () => {
      const result = checkMemberDepositSettlement({
        id: 'LIB-993',
        name: 'Karan Mehra',
        phone: '9876500024',
        locker: 'L-12',
      });

      expect(result.hasHeldDeposit).toBe(true);
      expect(result.amount).toBe(500);
      expect(result.status).toBe('Held');
    });

    it('falls back to member securityDeposit property when present', () => {
      const result = checkMemberDepositSettlement({
        id: 'LIB-994',
        name: 'Sunita Rao',
        phone: '9876500025',
        securityDeposit: 1000,
      });

      expect(result.hasHeldDeposit).toBe(true);
      expect(result.amount).toBe(1000);
      expect(result.status).toBe('Held');
    });
  });

  describe('getDepositSettlementFinanceUrl', () => {
    it('creates URL with encoded student name and cleaned 10-digit phone number', () => {
      const url = getDepositSettlementFinanceUrl('Aarav Sharma & Brother', '+91 98765-00022');
      expect(url).toContain('/frontend_manager/manager_finance/finance_security_deposits?');
      expect(url).toContain('name=Aarav+Sharma+%26+Brother');
      expect(url).toContain('phone=9876500022');
    });

    it('handles student name only without phone', () => {
      const url = getDepositSettlementFinanceUrl('Pooja Tiwari');
      expect(url).toBe('/frontend_manager/manager_finance/finance_security_deposits?name=Pooja+Tiwari');
    });
  });

  describe('settleAndRefundDepositInLedger', () => {
    it('marks existing held deposit as refunded and dispatches custom event', () => {
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

      localStorage.setItem(
        'manager_finance_security_deposits_records',
        JSON.stringify([
          {
            id: 'DEP-201',
            studentName: 'Vikram Singh',
            smartId: 'LIB-777',
            phone: '9876599999',
            depositAmount: 50000,
            status: 'held',
          },
        ])
      );

      const success = settleAndRefundDepositInLedger(
        {
          id: 'LIB-777',
          name: 'Vikram Singh',
          phone: '9876599999',
        },
        500,
        'Refunded upon graduation to UPSC alumni'
      );

      expect(success).toBe(true);

      const deposits = JSON.parse(localStorage.getItem('manager_finance_security_deposits_records')!);
      const record = deposits.find((d: any) => d.smartId === 'LIB-777');
      expect(record.status).toBe('refunded');
      expect(record.refundedDate).toBe(new Date().toISOString().slice(0, 10));
      expect(record.notes).toBe('Refunded upon graduation to UPSC alumni');

      expect(dispatchSpy).toHaveBeenCalled();
    });

    it('creates a new refunded record if none existed in ledger', () => {
      const success = settleAndRefundDepositInLedger(
        {
          id: 'LIB-888',
          name: 'Ananya Roy',
          phone: '9876511111',
          joinDate: '2025-02-01',
        },
        1000
      );

      expect(success).toBe(true);
      const deposits = JSON.parse(localStorage.getItem('manager_finance_security_deposits_records')!);
      expect(deposits.length).toBe(1);
      expect(deposits[0].studentName).toBe('Ananya Roy');
      expect(deposits[0].smartId).toBe('LIB-888');
      expect(deposits[0].depositAmount).toBe(100000);
      expect(deposits[0].status).toBe('refunded');
      expect(deposits[0].collectedBy).toBe('Front Desk Clearance');
    });
  });
});
