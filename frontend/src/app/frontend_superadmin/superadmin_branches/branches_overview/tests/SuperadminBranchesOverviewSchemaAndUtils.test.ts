import { describe, it, expect } from 'vitest';
import {
  SuperadminBranchCreateSchema,
  SuperadminBranchTransferManagerSchema,
  SuperadminBranchCloseSafetySchema,
} from '../schemas/superadmin_branches_overview.schema';
import {
  formatBranchStatusLabel,
  formatCurrencyInr,
  filterBranchesByTerm,
} from '../utils/superadmin_branches_overview_utils';
import {
  fetchSuperadminBranchesApi,
  createSuperadminBranchApi,
  updateSuperadminBranchStatusApi,
  transferSuperadminBranchManagerApi,
} from '../api/superadmin_branches_overview.api';
import type { SuperadminBranchRecord } from '../types/SuperadminBranchesOverviewTypes';

describe('Superadmin Branches Overview Schemas, Utils & API Contract', () => {
  describe('Zod Schemas', () => {
    it('validates valid branch creation form values', () => {
      const valid = {
        name: 'Civil Lines Campus',
        code: 'CL-01',
        libraryId: 'lib-001',
        city: 'Prayagraj',
        address: '12 MG Marg',
        capacity: 120,
        shifts: 3,
        managerName: 'Anil Pandey',
        managerPhone: '9876543210',
        managerEmail: 'anil@gyanganga.com',
        openingDate: '2023-01-01',
        workingHours: '06:00 AM - 10:00 PM',
        allowedModules: ['catalog', 'seats'],
      };
      const res = SuperadminBranchCreateSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it('rejects branch creation if name is too short or capacity is invalid', () => {
      const invalid = {
        name: 'C',
        code: 'CL-01',
        libraryId: 'lib-001',
        city: 'P',
        address: '12',
        capacity: 0,
        shifts: 0,
        managerName: '',
        managerPhone: '123',
        managerEmail: 'not-an-email',
        openingDate: '',
        workingHours: '',
      };
      const res = SuperadminBranchCreateSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it('validates manager transfer with justification requirement', () => {
      const validTransfer = {
        branchId: 'br-01',
        newManagerName: 'Sunita Mehra',
        newManagerEmail: 'sunita@apexlib.in',
        newManagerPhone: '9876543210',
        reason: 'Relocation of previous manager to corporate office',
      };
      expect(SuperadminBranchTransferManagerSchema.safeParse(validTransfer).success).toBe(true);

      const invalidTransfer = {
        branchId: 'br-01',
        newManagerName: 'S',
        newManagerEmail: 'bad-email',
        newManagerPhone: '12',
        reason: 'Hi',
      };
      expect(SuperadminBranchTransferManagerSchema.safeParse(invalidTransfer).success).toBe(false);
    });

    it('enforces pre-flight safety check in branch closure schema (0 dues)', () => {
      const safeClose = {
        branchId: 'br-01',
        memberDues: 0,
        closureNotes: 'Lease expired and assets transferred to central branch',
      };
      expect(SuperadminBranchCloseSafetySchema.safeParse(safeClose).success).toBe(true);

      const unsafeClose = {
        branchId: 'br-01',
        memberDues: 500,
        closureNotes: 'Closing anyway',
      };
      expect(SuperadminBranchCloseSafetySchema.safeParse(unsafeClose).success).toBe(false);
    });
  });

  describe('Utils & Formatters', () => {
    it('formats status labels correctly', () => {
      expect(formatBranchStatusLabel('active')).toBe('Operational');
      expect(formatBranchStatusLabel('suspended')).toBe('Temporarily Suspended');
      expect(formatBranchStatusLabel('closed')).toBe('Archived / Closed');
    });

    it('formats currency in INR', () => {
      const formatted = formatCurrencyInr(15000);
      expect(formatted).toContain('15,000');
    });

    it('filters branches by keyword, library, and status', () => {
      const mockBranches: SuperadminBranchRecord[] = [
        {
          id: 'br-1',
          name: 'Noida Hub',
          code: 'ND-01',
          libraryId: 'lib-1',
          libraryName: 'Apex',
          city: 'Noida',
          state: 'Uttar Pradesh',
          address: 'Sec 62',
          pinCode: '201301',
          phone: '9876543210',
          email: 'vikram@apex.in',
          adminName: 'Admin',
          adminEmail: 'admin@apex.in',
          capacity: 100,
          activeMembers: 90,
          managerName: 'Vikram',
          managerPhone: '9876543210',
          managerEmail: 'vikram@apex.in',
          status: 'active',
          plan: 'Standard',
          openingDate: '2023-01-01',
          workingHours: '9am-9pm',
          weeklyHolidays: 'None',
          outstandingBooks: 0,
          memberDues: 0,
          cashBalance: 500,
          physicalBooks: 500,
          allowedModules: {},
          createdAt: '2023-01-01',
        },
      ];
      expect(filterBranchesByTerm(mockBranches, 'Noida', 'all', 'all')).toHaveLength(1);
      expect(filterBranchesByTerm(mockBranches, 'Jaipur', 'all', 'all')).toHaveLength(0);
    });
  });

  describe('API Envelope Contract', () => {
    it('returns standardized ApiResponse envelopes', async () => {
      const res = await fetchSuperadminBranchesApi();
      expect(res.success).toBe(true);
      expect(res.requestId).toBeDefined();

      const statusRes = await updateSuperadminBranchStatusApi('br-1', 'suspended', 'Audit check');
      expect(statusRes.success).toBe(true);
      if (statusRes.success && statusRes.data) {
        expect(statusRes.data.status).toBe('suspended');
      }

      const transferRes = await transferSuperadminBranchManagerApi(
        'br-1',
        { name: 'Kavita', email: 'kavita@lib.in', phone: '9876543210' },
        'Promotion',
      );
      expect(transferRes.success).toBe(true);
      if (transferRes.success && transferRes.data) {
        expect(transferRes.data.manager.name).toBe('Kavita');
      }
    });
  });
});
