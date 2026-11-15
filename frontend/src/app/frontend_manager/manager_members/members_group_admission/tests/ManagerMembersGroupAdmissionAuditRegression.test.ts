import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ManagerMembersGroupAdmissionAdmissionSchema } from '../schemas/ManagerMembersGroupAdmissionAdmissionSchema';

describe('Manager Members Group Admission Audit Regression Tests', () => {
  it('C6 & C7: accepts form values without forced locker or paymentMode when host contract is pending', () => {
    const validData = {
      fullName: 'Vikram Singh',
      phone: '9876543210',
      shift: 'Morning',
      seat: 'S-01',
      plan: 'Pro Monthly',
      manualDiscount: '0',
      amountPaid: '1500',
    };
    const result = ManagerMembersGroupAdmissionAdmissionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('C4: ensures TableView gender select includes "Other" option', () => {
    const tableViewPath = join(
      __dirname,
      '../components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionTableView.tsx'
    );
    const content = readFileSync(tableViewPath, 'utf8');
    expect(content).toContain('<option value="Other">Other</option>');
  });

  it('C3: ensures CardView blood group select has an unselected optional placeholder', () => {
    const cardViewPath = join(
      __dirname,
      '../components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionCardView.tsx'
    );
    const content = readFileSync(cardViewPath, 'utf8');
    expect(content).toContain('-- Select Blood Group (Optional) --');
    expect(content).not.toContain("value={row.bloodGroup || 'B+'}");
  });

  it('C9: ensures BulkModal does not hardcode fake phone 9876500000 or fake email', () => {
    const bulkModalPath = join(
      __dirname,
      '../components/manager_members_group_admission_dialogs/ManagerMembersGroupAdmissionBulkModal.tsx'
    );
    const content = readFileSync(bulkModalPath, 'utf8');
    expect(content).not.toContain("'9876500000'");
    expect(content).not.toContain("'student@example.com'");
  });

  it('C10: ensures confirmation dialog includes focus restoration ref and aria-describedby', () => {
    const confirmHookPath = join(__dirname, '../hooks/useManagerMembersGroupAdmissionConfirm.tsx');
    const content = readFileSync(confirmHookPath, 'utf8');
    expect(content).toContain('previousFocusRef');
    expect(content).toContain('aria-describedby={titleId}');
  });

  it('C18: ensures no sensitive PII is exposed in GroupPage DOM data attributes', () => {
    const groupPagePath = join(
      __dirname,
      '../components/manager_members_group_admission_views/ManagerMembersGroupAdmissionGroupPage.tsx'
    );
    const content = readFileSync(groupPagePath, 'utf8');
    expect(content).not.toContain('data-route-phone');
    expect(content).not.toContain('data-route-name');
    expect(content).not.toContain('data-route-smart-id');
  });

  it('C13: ensures unused finance fee collection route is removed from url_config.ts', () => {
    const urlConfigPath = join(__dirname, '../config/manager_members_group_admission.url_config.ts');
    const content = readFileSync(urlConfigPath, 'utf8');
    expect(content).not.toContain('COLLECT_FEE_FOR_STUDENT');
  });

  it('validates negative scenarios: rejects invalid phone, negative discount, negative amount, and invalid names', () => {
    // Phone with letters
    expect(
      ManagerMembersGroupAdmissionAdmissionSchema.safeParse({
        fullName: 'Rahul Sharma',
        phone: '98765abcd0',
        shift: 'Morning',
        seat: 'S-01',
        plan: 'Pro Monthly',
        manualDiscount: '0',
        amountPaid: '1500',
      }).success
    ).toBe(false);

    // Phone with 9 digits (too short)
    expect(
      ManagerMembersGroupAdmissionAdmissionSchema.safeParse({
        fullName: 'Rahul Sharma',
        phone: '987654321',
        shift: 'Morning',
        seat: 'S-01',
        plan: 'Pro Monthly',
        manualDiscount: '0',
        amountPaid: '1500',
      }).success
    ).toBe(false);

    // Phone starting with 5 (invalid Indian mobile)
    expect(
      ManagerMembersGroupAdmissionAdmissionSchema.safeParse({
        fullName: 'Rahul Sharma',
        phone: '5876543210',
        shift: 'Morning',
        seat: 'S-01',
        plan: 'Pro Monthly',
        manualDiscount: '0',
        amountPaid: '1500',
      }).success
    ).toBe(false);

    // Negative manual discount
    expect(
      ManagerMembersGroupAdmissionAdmissionSchema.safeParse({
        fullName: 'Rahul Sharma',
        phone: '9876543210',
        shift: 'Morning',
        seat: 'S-01',
        plan: 'Pro Monthly',
        manualDiscount: '-100',
        amountPaid: '1500',
      }).success
    ).toBe(false);

    // Negative / zero amount paid
    expect(
      ManagerMembersGroupAdmissionAdmissionSchema.safeParse({
        fullName: 'Rahul Sharma',
        phone: '9876543210',
        shift: 'Morning',
        seat: 'S-01',
        plan: 'Pro Monthly',
        manualDiscount: '0',
        amountPaid: '-500',
      }).success
    ).toBe(false);

    // Invalid full name with numbers
    expect(
      ManagerMembersGroupAdmissionAdmissionSchema.safeParse({
        fullName: 'Rahul123',
        phone: '9876543210',
        shift: 'Morning',
        seat: 'S-01',
        plan: 'Pro Monthly',
        manualDiscount: '0',
        amountPaid: '1500',
      }).success
    ).toBe(false);
  });

  it('ensures mobile input fields restrict input to digits only with maxLength 10 and numeric keypad', () => {
    const cardViewContent = readFileSync(
      join(__dirname, '../components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionCardView.tsx'),
      'utf8'
    );
    expect(cardViewContent).toContain('inputMode="numeric"');
    expect(cardViewContent).toContain('maxLength={10}');
    expect(cardViewContent).toContain('.replace(/\\D/g, \'\').slice(0, 10)');

    const tableViewContent = readFileSync(
      join(__dirname, '../components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionTableView.tsx'),
      'utf8'
    );
    expect(tableViewContent).toContain('inputMode="numeric"');
    expect(tableViewContent).toContain('maxLength={10}');
    expect(tableViewContent).toContain('.replace(/\\D/g, \'\').slice(0, 10)');
  });

  it('ensures responsive classes exist for mobile, tablet, and laptop views', () => {
    const groupPageContent = readFileSync(
      join(__dirname, '../components/manager_members_group_admission_views/ManagerMembersGroupAdmissionGroupPage.tsx'),
      'utf8'
    );
    expect(groupPageContent).toContain('grid-cols-1 md:grid-cols-2');

    const manualModalContent = readFileSync(
      join(__dirname, '../components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionManualModal.tsx'),
      'utf8'
    );
    expect(manualModalContent).toContain('grid-cols-1 sm:grid-cols-3');

    const tableViewContent = readFileSync(
      join(__dirname, '../components/manager_members_group_admission_forms/ManagerMembersGroupAdmissionTableView.tsx'),
      'utf8'
    );
    expect(tableViewContent).toContain('overflow-x-auto');
    expect(tableViewContent).toContain('min-w-[720px]');
  });
});

