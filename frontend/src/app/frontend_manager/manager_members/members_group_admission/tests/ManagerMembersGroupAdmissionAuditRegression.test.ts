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
});

