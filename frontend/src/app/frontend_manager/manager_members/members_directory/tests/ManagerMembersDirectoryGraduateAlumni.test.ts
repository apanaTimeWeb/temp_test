import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { graduateMemberToAlumni } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryGraduateAlumni';
import { beforeEach,describe,expect,it,vi } from 'vitest';

describe('ManagerMembersDirectoryGraduateAlumni', () => {
  const sampleMember: ManagerMembersDirectoryRecord = {
    id: 'LIB-001',
    name: 'Aman Verma',
    phone: '9876543210',
    email: 'aman@example.com',
    type: 'Pro',
    status: 'Active',
    joinDate: '2025-01-01',
    expiryDate: '2025-12-31',
    seat: 'Seat 14',
    locker: 'L-02',
    preparationFor: 'UPSC Civil Services',
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('vacates seat and locker and saves alumni record to localStorage when releaseSeat is true', () => {
    const onUpdateMock = vi.fn();
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    const updated = graduateMemberToAlumni(
      sampleMember,
      {
        exam: 'UPSC Civil Services',
        designation: 'AIR 142 (IAS)',
        currentStatus: 'Cleared Exam',
        duration: '14 Months',
        testimonial: 'Great environment for study.',
        leftDate: '2026-05-15',
        releaseSeat: true,
        depositSettlementStatus: 'Refunded',
        depositAmount: 500,
      },
      onUpdateMock
    );

    expect(updated.seat).toBeUndefined();
    expect(updated.locker).toBeUndefined();
    expect(updated.remarks).toContain('Graduated to Alumni: UPSC Civil Services (AIR 142 (IAS))');
    expect(updated.remarks).toContain('Deposit: Refunded (₹500)');
    expect(onUpdateMock).toHaveBeenCalledWith(updated);

    const storedRaw = localStorage.getItem('manager_alumni_records');
    expect(storedRaw).not.toBeNull();
    const stored = JSON.parse(storedRaw!);
    expect(stored.length).toBe(1);
    expect(stored[0].name).toBe('Aman Verma');
    expect(stored[0].exam).toBe('UPSC Civil Services');
    expect(stored[0].designation).toBe('AIR 142 (IAS)');
    expect(stored[0].currentStatus).toBe('Cleared Exam');
    expect(stored[0].depositSettlementStatus).toBe('Refunded');
    expect(stored[0].depositAmount).toBe(500);

    // Verify finance ledger updated with refunded status
    const financeRaw = localStorage.getItem('manager_finance_security_deposits_records');
    expect(financeRaw).not.toBeNull();
    const financeDeposits = JSON.parse(financeRaw!);
    expect(financeDeposits.length).toBeGreaterThan(0);
    expect(financeDeposits[0].studentName).toBe('Aman Verma');
    expect(financeDeposits[0].status).toBe('refunded');

    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('preserves seat when releaseSeat is false', () => {
    const onUpdateMock = vi.fn();

    const updated = graduateMemberToAlumni(
      sampleMember,
      {
        exam: 'GATE CS',
        designation: 'AIR 50',
        currentStatus: 'Higher Studies',
        duration: '6 Months',
        testimonial: '',
        leftDate: '2026-06-01',
        releaseSeat: false,
        depositSettlementStatus: 'Held',
        depositAmount: 500,
      },
      onUpdateMock
    );

    expect(updated.seat).toBe('Seat 14');
    expect(updated.locker).toBe('L-02');
    expect(updated.remarks).toContain('Deposit: Held (₹500)');
  });

  it('clears active deposit in finance deposits ledger when transitioning held deposit to refunded', () => {
    // Pre-populate finance deposits with held deposit
    localStorage.setItem(
      'manager_finance_security_deposits_records',
      JSON.stringify([
        {
          id: 'DEP-101',
          studentName: 'Aman Verma',
          smartId: 'LIB-001',
          phone: '9876543210',
          depositAmount: 50000,
          status: 'held',
          collectedDate: '2025-01-01',
        },
      ])
    );

    graduateMemberToAlumni(
      sampleMember,
      {
        exam: 'SSC CGL',
        designation: 'Auditor',
        currentStatus: 'Employed',
        duration: '10 Months',
        testimonial: '',
        leftDate: '2026-07-01',
        releaseSeat: true,
        depositSettlementStatus: 'Refunded',
        depositAmount: 500,
      }
    );

    const deposits = JSON.parse(localStorage.getItem('manager_finance_security_deposits_records')!);
    const matching = deposits.find((d: any) => d.smartId === 'LIB-001');
    expect(matching).toBeDefined();
    expect(matching.status).toBe('refunded');
    expect(matching.refundedDate).toBe('2026-07-01');
  });
});

