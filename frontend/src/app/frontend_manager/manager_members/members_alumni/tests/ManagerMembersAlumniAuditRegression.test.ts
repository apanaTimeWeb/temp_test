import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MembersAlumniRowSchema } from '../schemas/ManagerMembersAlumniSchema';
import { MANAGER_MEMBERS_ALUMNI_ROUTES } from '../config/manager_members_alumni.url_config';

describe('Manager Members Alumni Audit Regression Tests', () => {
  it('D3: validates alumni rows with dedicated MembersAlumniRowSchema', () => {
    const validAlumni = {
      id: 'ALM-101',
      name: 'Aditi Sharma',
      phone: '9876543210',
      leftDate: '2026-05-15',
      duration: '12 Months',
      exam: 'UPSC Civil Services',
      currentStatus: 'Cleared Exam',
      designation: 'IAS Officer',
      testimonial: 'Excellent library environment with quiet zones.',
    };
    const result = MembersAlumniRowSchema.safeParse(validAlumni);
    expect(result.success).toBe(true);
  });

  it('D2: ensures ALUMNI_ROUTES.LIST points to alumni root and not members_directory', () => {
    expect(MANAGER_MEMBERS_ALUMNI_ROUTES.LIST).toBe('/frontend_manager/manager_members/members_alumni');
    expect(MANAGER_MEMBERS_ALUMNI_ROUTES.MEMBERS_DIRECTORY).toBe('/frontend_manager/manager_members/members_directory');
  });

  it('D5: ensures AddModal generates collision-resistant alumni IDs', () => {
    const addModalPath = join(
      __dirname,
      '../components/manager_members_alumni_dialogs/ManagerMembersAlumniAddModal.tsx'
    );
    const content = readFileSync(addModalPath, 'utf8');
    expect(content).not.toContain("slice(-3)");
    expect(content).toContain("ALM-${Date.now()");
  });

  it('D8: ensures AlumniTable includes data-testid attributes for automated testability', () => {
    const tablePath = join(
      __dirname,
      '../components/manager_members_alumni_views/ManagerMembersAlumniTable.tsx'
    );
    const content = readFileSync(tablePath, 'utf8');
    expect(content).toContain('data-testid="manager-alumni-search-input"');
    expect(content).toContain('data-testid="manager-alumni-year-filter"');
    expect(content).toContain('data-testid="manager-alumni-exam-filter"');
    expect(content).toContain('data-testid="manager-alumni-status-filter"');
    expect(content).toContain('data-testid="manager-alumni-reset-filters"');
    expect(content).toContain('data-testid="manager-alumni-table"');
    expect(content).toContain('data-testid="manager-alumni-pagination-prev"');
    expect(content).toContain('data-testid="manager-alumni-pagination-next"');
  });

  it('D6: ensures AlumniClient computes KPI metrics dynamically from records', () => {
    const clientPath = join(
      __dirname,
      '../components/manager_members_alumni_views/ManagerMembersAlumniClient.tsx'
    );
    const content = readFileSync(clientPath, 'utf8');
    expect(content).toContain('kpis.successRate');
    expect(content).toContain('kpis.officersPercent');
    expect(content).toContain('kpis.avgTenure');
    expect(content).not.toContain('>87.5%<');
  });

  it('D1 & D4: ensures alumni additions are persisted to localStorage', () => {
    const clientPath = join(
      __dirname,
      '../components/manager_members_alumni_views/ManagerMembersAlumniClient.tsx'
    );
    const content = readFileSync(clientPath, 'utf8');
    expect(content).toContain('manager_alumni_records');
    expect(content).toContain('manager_alumni_created');
  });
});

