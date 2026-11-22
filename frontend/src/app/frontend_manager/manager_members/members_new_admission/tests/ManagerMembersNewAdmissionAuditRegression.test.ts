import { calculateAdmissionFee,getLibraryPricingConfig } from '@/lib/pricing/libraryPricingEngine';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe,expect,it } from 'vitest';
import { ManagerMembersNewAdmissionAdmissionSchema } from '../schemas/ManagerMembersNewAdmissionAdmissionSchema';

describe('Manager Members New Admission Audit Regression Tests', () => {
  it('BUG-04 & BUG-06: validates that gender is mandatory and rejects empty value', () => {
    const invalidData = {
      fullName: 'Rahul Sharma',
      phone: '9876543210',
      gender: '', // Empty should fail
      shift: 'Morning',
      seat: 'S-01',
      plan: '1 Month',
      amountPaid: '1000',
      paymentMode: 'Cash',
    };
    const result = ManagerMembersNewAdmissionAdmissionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const genderErr = result.error.errors.find((e) => e.path.includes('gender'));
      expect(genderErr).toBeDefined();
      expect(genderErr?.message).toMatch(/select a gender/i);
    }
  });

  it('accepts valid member admission form values with documents and photoUrl', () => {
    const validData = {
      fullName: 'Priya Verma',
      phone: '9876543210',
      gender: 'Female',
      shift: 'Evening',
      seat: 'S-05',
      plan: '1 Month (Monthly)',
      amountPaid: '800',
      paymentMode: 'UPI',
      photoUrl: 'blob:http://localhost/photo.jpg',
      documents: [
        {
          id: 'doc-1',
          type: 'Aadhaar Card',
          number: '1234 5678 9012',
          fileName: 'aadhaar.pdf',
          status: 'Verified' as const,
          uploadDate: '2026-11-08',
        },
      ],
    };
    const result = ManagerMembersNewAdmissionAdmissionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('BUG-11: library pricing engine includes Afternoon shift', () => {
    const config = getLibraryPricingConfig();
    const afternoonShift = config.shifts.find((s) => s.id === 'Afternoon');
    expect(afternoonShift).toBeDefined();
    expect(afternoonShift?.name).toBe('Afternoon Shift');
    expect(afternoonShift?.startTime).toBe('11:00 AM');
    expect(afternoonShift?.endTime).toBe('04:00 PM');
  });

  it('calculates admission fee accurately for single and multi-shift configurations', () => {
    const singleShiftFee = calculateAdmissionFee({
      selectedShifts: ['Afternoon'],
      planDurationKey: '1_month',
    });
    expect(singleShiftFee.finalPayable).toBe(600);

    const multiShiftFee = calculateAdmissionFee({
      selectedShifts: ['Morning', 'Evening'],
      planDurationKey: '1_month',
    });
    // Base 700 + 700 = 1400, with 10% multi-shift discount = 1260
    expect(multiShiftFee.finalPayable).toBe(1260);
  });

  it('calculates multi-head composite billing including registration fee and security deposit', () => {
    const compositeFee = calculateAdmissionFee({
      selectedShifts: ['Morning'],
      planDurationKey: '1_month',
      hasLocker: true,
      registrationFee: 200,
      securityDeposit: 500,
    });
    // Shift: 700 + Locker: 200 = 900 grossTenureFee
    // Gross: 900 + Reg Fee: 200 + Sec Deposit: 500 = 1600 finalPayable
    expect(compositeFee.grossTenureFee).toBe(900); // 700 shift + 200 locker
    expect(compositeFee.registrationFeeAmount).toBe(200);
    expect(compositeFee.securityDepositAmount).toBe(500);
    expect(compositeFee.finalPayable).toBe(1600);

    const regBreakdown = compositeFee.breakdown.find((b) => b.label.includes('Registration Fee'));
    const secBreakdown = compositeFee.breakdown.find((b) => b.label.includes('Security Deposit'));
    expect(regBreakdown).toBeDefined();
    expect(regBreakdown?.amount).toBe(200);
    expect(secBreakdown).toBeDefined();
    expect(secBreakdown?.amount).toBe(500);
  });

  it('accepts admission form values with registration fee and security deposit', () => {
    const validCompositeData = {
      fullName: 'Vikram Malhotra',
      phone: '9876543210',
      gender: 'Male',
      shift: 'Morning',
      seat: 'S-02',
      plan: '1 Month',
      registrationFee: '200',
      securityDeposit: '500',
      amountPaid: '1700',
      paymentMode: 'Cash',
    };
    const result = ManagerMembersNewAdmissionAdmissionSchema.safeParse(validCompositeData);
    expect(result.success).toBe(true);
  });

  it('BUG-01: ensures no PII is exposed in DOM data attributes in ManagerMembersNewAdmissionMain.tsx', () => {
    const mainPath = join(__dirname, '../components/ManagerMembersNewAdmissionMain.tsx');
    const content = readFileSync(mainPath, 'utf8');
    expect(content).not.toContain('data-route-phone');
    expect(content).not.toContain('data-route-name');
    expect(content).not.toContain('data-route-smart-id');
  });

  it('BUG-13: ensures locker localization string is properly capitalized in English locale', () => {
    const localePath = join(__dirname, '../locales/manager_members_new_admission_domain_en.json');
    const content = JSON.parse(readFileSync(localePath, 'utf8'));
    expect(content.manager.manager_new_admission.ui.locker).toBe('Locker');
  });

  it('BUG-23: ensures shift selection buttons include WCAG visible focus indicators', () => {
    const enrollmentPath = join(
      __dirname,
      '../components/manager_members_new_admission_sections/ManagerMembersNewAdmissionAdmissionEnrollmentSection.tsx'
    );
    const content = readFileSync(enrollmentPath, 'utf8');
    expect(content).toContain('focus-visible:ring-2');
    expect(content).toContain('focus-visible:ring-primary');
  });

  it('BUG-05: ensures confirmation modal handles focus restoration on dismissal', () => {
    const confirmHookPath = join(__dirname, '../hooks/useManagerMembersNewAdmissionConfirm.tsx');
    const content = readFileSync(confirmHookPath, 'utf8');
    expect(content).toContain('previousFocusRef');
    expect(content).toContain('previousFocusRef.current.focus()');
  });
});
