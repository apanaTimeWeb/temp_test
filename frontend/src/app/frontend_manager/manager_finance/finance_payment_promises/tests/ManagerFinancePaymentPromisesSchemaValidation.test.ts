import { describe, it, expect } from 'vitest';
import {
  managerFinancePaymentPromiseAddSchema,
  managerFinancePaymentPromiseEditSchema,
} from '@/app/frontend_manager/manager_finance/finance_payment_promises/schemas/ManagerFinancePaymentPromisesSchema';

describe('ManagerFinancePaymentPromisesSchema validation', () => {
  describe('managerFinancePaymentPromiseAddSchema', () => {
    it('validates a correct promise add payload', () => {
      const valid = {
        studentName: 'Rahul Verma',
        smartId: 'LIB-402',
        amount: '1800',
        expectedDate: '2026-11-20',
        remarks: 'Exam fee pending',
      };
      const result = managerFinancePaymentPromiseAddSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.amount).toBe(1800);
        expect(result.data.studentName).toBe('Rahul Verma');
      }
    });

    it('rejects empty student name', () => {
      const invalid = {
        studentName: '   ',
        amount: '1800',
        expectedDate: '2026-11-20',
      };
      const result = managerFinancePaymentPromiseAddSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects zero or negative amount', () => {
      const invalid = {
        studentName: 'Rahul Verma',
        amount: '0',
        expectedDate: '2026-11-20',
      };
      const result = managerFinancePaymentPromiseAddSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('managerFinancePaymentPromiseEditSchema', () => {
    it('validates a correct promise edit payload', () => {
      const valid = {
        amount: 2500,
        expectedDate: '2026-11-30',
        remarks: 'Extension requested',
      };
      const result = managerFinancePaymentPromiseEditSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects missing expected date', () => {
      const invalid = {
        amount: 2500,
        expectedDate: '',
      };
      const result = managerFinancePaymentPromiseEditSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
