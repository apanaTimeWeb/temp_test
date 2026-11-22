import { existsSync,readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe,expect,it } from 'vitest';
import { ManagerMembersNewAdmissionAdmissionSchema } from '../schemas/ManagerMembersNewAdmissionAdmissionSchema';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_new_admission'),
  join(process.cwd(), 'frontend/src/app/frontend_manager/manager_members/members_new_admission'),
].find(existsSync);

const readSource = (relativePath: string) => {
  if (!moduleRoot) throw new Error('Could not locate module root');
  return readFileSync(join(moduleRoot, relativePath), 'utf8');
};

describe('Manager Members New Admission - Security Deposit & Partial Payment (Token Money) Flow', () => {
  it('validates admission schema with partial payment, promise due date, and security deposit', () => {
    const validPartialAdmission = {
      fullName: 'Aarav Singhal',
      phone: '9876543210',
      gender: 'Male',
      shift: 'Morning',
      seat: 'S-12',
      plan: '1 Month (Monthly)',
      registrationFee: '200',
      securityDeposit: '500',
      paymentType: 'partial' as const,
      amountPaid: '500', // Token advance paid today out of total
      paymentMode: 'UPI',
      promiseDueDate: '2026-11-25',
      promiseRemarks: 'Remaining balance promised by next Monday',
    };

    const result = ManagerMembersNewAdmissionAdmissionSchema.safeParse(validPartialAdmission);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.securityDeposit).toBe('500');
      expect(result.data.paymentType).toBe('partial');
      expect(result.data.amountPaid).toBe('500');
      expect(result.data.promiseDueDate).toBe('2026-11-25');
    }
  });

  it('renders dedicated Refundable Security Deposit box with quick preset options', () => {
    const paymentSource = readSource('components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionPaymentSection.tsx');
    expect(paymentSource).toContain('admission-security-deposit');
    expect(paymentSource).toContain('Refundable Security Deposit');
    expect(paymentSource).toContain('100% Refundable on Exit');
    expect(paymentSource).toContain('₹500 Standard Desk');
    expect(paymentSource).toContain('₹1,000 Desk + Locker');
    expect(paymentSource).toContain('₹0 None');
  });

  it('provides Partial Payment (Token Advance) toggle and auto payment promise schedule inputs', () => {
    const paymentSource = readSource('components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionPaymentSection.tsx');
    expect(paymentSource).toContain('Payment Structure');
    expect(paymentSource).toContain('Full Payment (Pay in Full)');
    expect(paymentSource).toContain('Partial Payment (Token Advance)');
    expect(paymentSource).toContain('admission-promise-date');
    expect(paymentSource).toContain('admission-promise-remarks');
    expect(paymentSource).toContain('Auto-Creates Payment Promise');
    expect(paymentSource).toContain('+7 Days');
    expect(paymentSource).toContain('+14 Days');
    expect(paymentSource).toContain('Month End');
  });

  it('automatically registers Payment Promise and Security Deposit on admission submission', () => {
    const formSource = readSource('components/manager_members_new_admission_forms/ManagerMembersNewAdmissionAdmissionForm.tsx');
    // Checks that localStorage and dispatch events are wired for auto-creation
    expect(formSource).toContain('manager_finance_payment_promises_records');
    expect(formSource).toContain('manager_payment_promise_created');
    expect(formSource).toContain('manager_finance_security_deposits_records');
    expect(formSource).toContain('manager_security_deposit_collected');
    expect(formSource).toContain('isPartialPayment: isPartial');
    expect(formSource).toContain('promiseDueDate: isPartial ? expectedDueDate : undefined');
    expect(formSource).toContain('securityDeposit: secDepositNum > 0 ? String(secDepositNum) : undefined');
  });

  it('includes comprehensive fee breakdown, balance due, and security deposit in WhatsApp receipt', () => {
    const bannerSource = readSource('components/manager_members_new_admission_sections/ManagerMembersNewAdmissionSuccessBanner.tsx');
    expect(bannerSource).toContain('• Refundable Security Deposit:');
    expect(bannerSource).toContain('• Amount Paid Today (Token):');
    expect(bannerSource).toContain('• Remaining Balance Due:');
    expect(bannerSource).toContain('Promised Due Date:');
    expect(bannerSource).toContain('View in Payment Promises');
  });

  it('displays auto-promise badge in admission summary when balance is due', () => {
    const summarySource = readSource('components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionSummary.tsx');
    expect(summarySource).toContain('balance_due');
    expect(summarySource).toContain('Auto Promise');
  });
});
