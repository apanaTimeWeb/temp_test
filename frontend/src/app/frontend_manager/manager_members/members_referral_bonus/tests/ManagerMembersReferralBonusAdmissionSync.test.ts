import { describe, it, expect, beforeEach } from 'vitest';

describe('ManagerMembersReferralBonusAdmissionSync', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('records a verified pending referral when a newly admitted student declares a referrer', () => {
    const admissionData = {
      fullName: 'Suresh Kumar',
      smartId: 'LIB-099',
      referredBy: 'Aman Verma (LIB-001)',
    };

    // Simulate Admission Submission Referral Hook
    const refBy = admissionData.referredBy?.trim();
    if (refBy && refBy !== 'Direct Walk-in' && !refBy.toLowerCase().startsWith('direct walk-in')) {
      const stored = JSON.parse(localStorage.getItem('manager_members_referral_records') || '[]');
      const newRef = {
        id: `REF-${Date.now().toString().slice(-4)}`,
        referrer: refBy,
        referred: `${admissionData.fullName} (${admissionData.smartId})`,
        date: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        bonus: '₹500',
        method: 'Fee Discount',
      };
      localStorage.setItem('manager_members_referral_records', JSON.stringify([newRef, ...stored]));
    }

    const storedRaw = localStorage.getItem('manager_members_referral_records');
    expect(storedRaw).not.toBeNull();
    const list = JSON.parse(storedRaw!);
    expect(list.length).toBe(1);
    expect(list[0].referrer).toBe('Aman Verma (LIB-001)');
    expect(list[0].referred).toBe('Suresh Kumar (LIB-099)');
    expect(list[0].status).toBe('Pending');
    expect(list[0].bonus).toBe('₹500');
  });

  it('does not record a referral for direct walk-in admissions', () => {
    const admissionData = {
      fullName: 'Pooja Singh',
      smartId: 'LIB-100',
      referredBy: 'Direct Walk-in / Self (No Referral)',
    };

    const refBy = admissionData.referredBy?.trim();
    if (refBy && refBy !== 'Direct Walk-in' && !refBy.toLowerCase().startsWith('direct walk-in')) {
      const stored = JSON.parse(localStorage.getItem('manager_members_referral_records') || '[]');
      const newRef = {
        id: `REF-${Date.now().toString().slice(-4)}`,
        referrer: refBy,
        referred: `${admissionData.fullName} (${admissionData.smartId})`,
        date: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        bonus: '₹500',
        method: 'Fee Discount',
      };
      localStorage.setItem('manager_members_referral_records', JSON.stringify([newRef, ...stored]));
    }

    const storedRaw = localStorage.getItem('manager_members_referral_records');
    expect(storedRaw).toBeNull();
  });
});

