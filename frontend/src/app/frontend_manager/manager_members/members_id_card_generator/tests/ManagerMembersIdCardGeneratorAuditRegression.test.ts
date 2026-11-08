import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ManagerStudentSchema } from '@/app/frontend_manager/manager_members/members_id_card_generator/schemas/ManagerMembersIdCardGeneratorSchema';
import {
  MANAGER_STUDENT_STATUSES,
  MANAGER_STUDENT_SHIFTS,
} from '@/app/frontend_manager/manager_members/members_id_card_generator/constants/ManagerMembersIdCardGeneratorConstants';

const moduleRoot = [
  join(process.cwd(), 'src/app/frontend_manager/manager_members/members_id_card_generator'),
  join(process.cwd(), 'app/frontend_manager/manager_members/members_id_card_generator'),
  join(process.cwd(), 'frontend_manager/manager_members/members_id_card_generator'),
  process.cwd(),
].find(
  (candidate) =>
    existsSync(join(candidate, 'schemas/ManagerMembersIdCardGeneratorSchema.ts')) &&
    existsSync(join(candidate, 'components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorIdCardClient.tsx'))
);

const readSource = (relativePath: string) => {
  if (!moduleRoot) throw new Error('Cannot find members_id_card_generator root');
  return readFileSync(join(moduleRoot, relativePath), 'utf8');
};

describe('Manager Members ID Card Generator - Audit Regression Suite (Section G)', () => {
  it('G-C1 & G-M3: sanitizes WhatsApp phone numbers to prevent double country code in URLs and toasts', () => {
    const clientSource = readSource('components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorIdCardClient.tsx');
    expect(clientSource).toContain('digits.length > 10 && digits.startsWith(\'91\') ? digits.slice(2) : digits');
    expect(clientSource).not.toContain('https://wa.me/91${selected.phone}');

    const modalSource = readSource('components/manager_members_id_card_generator_sections/ManagerMembersIdCardBulkDispatchModal.tsx');
    expect(modalSource).toContain('digits.length > 10 && digits.startsWith(\'91\') ? digits.slice(2) : digits');
    expect(modalSource).not.toContain('toast.success(`ID Card WhatsApp opened for ${student.name} (+91 ${cleanPhone})`)');
  });

  it('G-C2: dynamically renders verification badge based on student status in StudentIdCard', () => {
    const cardSource = readSource('components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCard.tsx');
    expect(cardSource).toContain("data.status === 'Suspended'");
    expect(cardSource).toContain("data.status === 'Expired'");
    expect(cardSource).toContain('Verified Active');
  });

  it('G-M1 & G-M6: supports optional locker and expiryDate fields in ManagerStudentSchema', () => {
    const validStudent = {
      id: 'student-99',
      smartId: 'LIB-999',
      name: 'Aditi Rao',
      phone: '9876543210',
      shift: 'Morning',
      seat: 'A-10',
      status: 'Active',
      plan: 'Monthly',
      dueMinor: 0,
      currency: 'INR',
      joined: '2026-09-01',
      locker: 'L-12',
      expiryDate: '30 Nov 2026',
    };
    const parsed = ManagerStudentSchema.safeParse(validStudent);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.locker).toBe('L-12');
      expect(parsed.data.expiryDate).toBe('30 Nov 2026');
    }
  });

  it('G-M4 & G-Med1: supports keyboard accessibility and aria-pressed on student list rows', () => {
    const clientSource = readSource('components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorIdCardClient.tsx');
    expect(clientSource).toContain('aria-pressed={student.smartId === selectedId}');
    expect(clientSource).toContain('if ((e.target as HTMLElement).tagName === \'INPUT\') return;');
  });

  it('G-M5: stabilizes useEffect dependency without self-referential selectedId mutation', () => {
    const clientSource = readSource('components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorIdCardClient.tsx');
    expect(clientSource).toContain('setSelectedId((current) => current || students[0].smartId);');
    expect(clientSource).not.toContain('useEffect(() => {\n    if (requestedId) setSelectedId(requestedId);\n    else if (students.length > 0 && !selectedId)');
  });

  it('G-M7, G-M8, G-L3: supplies testids and maps constants for shift and status filters', () => {
    const clientSource = readSource('components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorIdCardClient.tsx');
    expect(clientSource).toContain('data-testid="manager-id-card-shift-filter"');
    expect(clientSource).toContain('data-testid="manager-id-card-status-filter"');
    expect(clientSource).toContain('data-testid="manager-students-id-card-whatsapp-share"');
    expect(clientSource).toContain('MANAGER_STUDENT_SHIFTS.map');
    expect(clientSource).toContain('MANAGER_STUDENT_STATUSES.map');
  });

  it('G-L4: guards progress calculation against divide-by-zero', () => {
    const modalSource = readSource('components/manager_members_id_card_generator_sections/ManagerMembersIdCardBulkDispatchModal.tsx');
    expect(modalSource).toContain('totalCount > 0 ? Math.round((openedCount / totalCount) * 100) : 0');
  });
});

