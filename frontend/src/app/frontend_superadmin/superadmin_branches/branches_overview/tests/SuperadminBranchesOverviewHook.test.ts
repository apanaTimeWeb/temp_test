import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSuperadminBranchesOverview } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/hooks/useSuperadminBranchesOverview';

describe('useSuperadminBranchesOverview Hook', () => {
  it('initializes with branches and audit logs', () => {
    const { result } = renderHook(() => useSuperadminBranchesOverview());
    expect(result.current.branches.length).toBeGreaterThan(0);
    expect(result.current.auditLogs.length).toBeGreaterThan(0);
    expect(result.current.availableLibraries.length).toBeGreaterThan(0);
  });

  it('enforces unique branch code check when creating a branch', () => {
    const { result } = renderHook(() => useSuperadminBranchesOverview());
    const existingCode = result.current.branches[0].code;

    act(() => {
      const res = result.current.createBranch({
        code: existingCode,
        name: 'Duplicate Branch',
        libraryId: 'lib-1',
        libraryName: 'Apex Study Library Group',
        city: 'Delhi',
        state: 'Delhi',
        address: 'Test Address',
        pinCode: '110001',
        phone: '+91 9999999999',
        email: 'dup@branch.com',
        managerName: 'Test Manager',
        managerEmail: 'tm@test.com',
        managerPhone: '+91 9999999999',
        openingDate: '2026-03-01',
        workingHours: '08:00 AM - 10:00 PM',
        weeklyHolidays: 'Sunday',
        capacity: 100,
        activeMembers: 0,
        adminName: 'Rajesh Sharma',
        adminEmail: 'rajesh@apex.com',
        plan: 'Standard Plan',
        outstandingBooks: 0,
        memberDues: 0,
        cashBalance: 0,
        isArchived: false,
        allowedModules: { bookCatalog: true },
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain('already exists');
    });
  });

  it('allows creating a branch with a unique code and scopes it to library', () => {
    const { result } = renderHook(() => useSuperadminBranchesOverview());
    const uniqueCode = 'BR-TEST-UNIQUE-99';

    act(() => {
      const res = result.current.createBranch({
        code: uniqueCode,
        name: 'Unique Test Branch',
        libraryId: 'lib-1',
        libraryName: 'Apex Study Library Group',
        city: 'Jaipur',
        state: 'Rajasthan',
        address: 'Plot 4, MI Road',
        pinCode: '302001',
        phone: '+91 9888877777',
        email: 'jaipur@apexlib.in',
        managerName: 'Vikas Meena',
        managerEmail: 'vikas@apexlib.in',
        managerPhone: '+91 9888877777',
        openingDate: '2026-04-01',
        workingHours: '08:00 AM - 10:00 PM',
        weeklyHolidays: 'Sunday',
        capacity: 120,
        activeMembers: 0,
        adminName: 'Rajesh Sharma',
        adminEmail: 'rajesh.sharma@apexlib.in',
        plan: 'Standard Plan',
        outstandingBooks: 0,
        memberDues: 0,
        cashBalance: 0,
        isArchived: false,
        allowedModules: { bookCatalog: true, seatBooking: true },
      });
      expect(res.success).toBe(true);
    });

    const created = result.current.branches.find((b) => b.code === uniqueCode);
    expect(created).toBeDefined();
    expect(created?.name).toBe('Unique Test Branch');
    expect(created?.libraryId).toBe('lib-1');
  });

  it('blocks branch creation when library has reached maximum allowed branches in plan (e.g. Nalanda 3 of 3)', () => {
    const { result } = renderHook(() => useSuperadminBranchesOverview());
    // lib-3 has maxBranchesAllowed: 3 and currentBranchCount: 3
    act(() => {
      const res = result.current.createBranch({
        code: 'BR-NAL-4TH-BRANCH',
        name: 'Nalanda 4th Branch Attempt',
        libraryId: 'lib-3',
        libraryName: 'Nalanda Digital Study Center',
        city: 'Kota',
        state: 'Rajasthan',
        address: 'Talwandi Circle, Kota',
        pinCode: '324005',
        phone: '+91 9988776655',
        email: 'branch4@nalandastudy.invalid',
        managerName: 'New Manager',
        managerEmail: 'nm@nalandastudy.invalid',
        managerPhone: '+91 9988776655',
        openingDate: '2026-05-01',
        workingHours: '06:00 AM - 11:00 PM',
        weeklyHolidays: 'None',
        capacity: 150,
        activeMembers: 0,
        adminName: 'Rajesh Meena',
        adminEmail: 'rajesh@nalandastudy.invalid',
        plan: 'Enterprise (Tier 1)',
        outstandingBooks: 0,
        memberDues: 0,
        cashBalance: 0,
        isArchived: false,
        allowedModules: { books: true, members: true },
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain('Branch limit reached');
      expect(res.error).toContain('3 of 3 allowed branches');
    });
  });

  it('blocks branch closure if outstanding books or member dues exist', () => {
    const { result } = renderHook(() => useSuperadminBranchesOverview());
    // Branch with outstanding books and dues
    const branchWithLiabilities = result.current.branches.find((b) => b.outstandingBooks > 0 || b.memberDues > 0);
    expect(branchWithLiabilities).toBeDefined();

    act(() => {
      const res = result.current.closeBranch(branchWithLiabilities!.id, 'Closure request');
      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });
  });

  it('allows closing a branch when all books and dues are clear', () => {
    const { result } = renderHook(() => useSuperadminBranchesOverview());
    // Find branch with 0 liabilities or create one
    let cleanBranch = result.current.branches.find((b) => b.outstandingBooks === 0 && b.memberDues === 0 && b.status === 'active');
    
    if (!cleanBranch) {
      act(() => {
        result.current.createBranch({
          code: 'BR-CLEAN-01',
          name: 'Clean Branch',
          libraryId: 'lib-1',
          libraryName: 'Apex',
          city: 'Noida',
          state: 'UP',
          address: 'Sec 18',
          pinCode: '201301',
          phone: '+91 9876543210',
          email: 'clean@apex.in',
          managerName: 'Manager Clean',
          managerEmail: 'm@clean.in',
          managerPhone: '+91 9876543210',
          openingDate: '2026-01-01',
          workingHours: '09:00 - 18:00',
          weeklyHolidays: 'None',
          capacity: 50,
          activeMembers: 0,
          adminName: 'Admin',
          adminEmail: 'a@clean.in',
          plan: 'Standard Plan',
          outstandingBooks: 0,
          memberDues: 0,
          cashBalance: 0,
          isArchived: false,
          allowedModules: {},
        });
      });
      cleanBranch = result.current.branches.find((b) => b.code === 'BR-CLEAN-01');
    }

    act(() => {
      const res = result.current.closeBranch(cleanBranch!.id, 'Clean closure per policy');
      expect(res.success).toBe(true);
    });

    const updated = result.current.branches.find((b) => b.id === cleanBranch!.id);
    expect(updated?.status).toBe('closed');
    expect(updated?.isArchived).toBe(true);
  });

  it('suspends one branch without affecting sibling branches', () => {
    const { result } = renderHook(() => useSuperadminBranchesOverview());
    const lib1Branches = result.current.branches.filter((b) => b.libraryId === 'lib-1');
    expect(lib1Branches.length).toBeGreaterThanOrEqual(2);

    const targetBranch = lib1Branches[0];
    const siblingBranch = lib1Branches[1];

    act(() => {
      result.current.suspendBranch(targetBranch.id, 'Routine audit check');
    });

    const targetUpdated = result.current.branches.find((b) => b.id === targetBranch.id);
    const siblingUpdated = result.current.branches.find((b) => b.id === siblingBranch.id);

    expect(targetUpdated?.status).toBe('suspended');
    expect(siblingUpdated?.status).toBe('active'); // Sibling is NOT suspended
  });

  it('transfers manager and records audit log', () => {
    const { result } = renderHook(() => useSuperadminBranchesOverview());
    const targetBranch = result.current.branches[0];

    act(() => {
      result.current.transferManager(
        targetBranch.id,
        { name: 'Dr. Anita Roy', email: 'anita.roy@library.in', phone: '+91 9123456789' },
        'SuperAdmin quarterly re-assignment',
      );
    });

    const updated = result.current.branches.find((b) => b.id === targetBranch.id);
    expect(updated?.managerName).toBe('Dr. Anita Roy');
    expect(updated?.managerEmail).toBe('anita.roy@library.in');

    const auditLog = result.current.auditLogs.find((l) => l.branchId === targetBranch.id && l.action === 'TRANSFER_MANAGER');
    expect(auditLog).toBeDefined();
    expect(auditLog?.reason).toBe('SuperAdmin quarterly re-assignment');
  });
});
