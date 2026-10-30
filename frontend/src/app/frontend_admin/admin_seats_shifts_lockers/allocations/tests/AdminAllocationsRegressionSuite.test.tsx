/** Consolidated module regression suites. Each original suite remains isolated under its named describe block. */
import { describe, expect, it } from 'vitest';
import { ADMIN_ALLOCATIONS_DEMO_ALLOCATIONS } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/mocks/AdminAllocationsDemoFixtures';
import { parseAdminAllocationsCsv, serializeAdminAllocationsCsv } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/utils/AdminAllocationsCsvUtils';
import { toIsoAdminAllocationsDisplayDate, isValidAdminAllocationsIsoDate, matchesAdminAllocationsFilter } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/utils/AdminAllocationsFilterUtils';
import { ADMIN_ALLOCATIONS_ROUTES } from '@/app/frontend_admin/admin_seats_shifts_lockers/allocations/config/admin_allocations.url_config';

describe('Original suite: AdminAllocationsCsvUtils.test.ts', () => {
  const fixture = ADMIN_ALLOCATIONS_DEMO_ALLOCATIONS[0];
  if (!fixture) throw new Error('Allocation fixture must include at least one record for contract tests.');

  describe('admin allocations CSV contract', () => {
    it('round-trips exported allocation records including commas and quotes', () => {
      const source = serializeAdminAllocationsCsv([
        { ...fixture, studentName: 'Rivera, "Alex"', customSlots: '8AM–10AM, 5PM–8PM' },
      ]);
      const [parsed] = parseAdminAllocationsCsv(source);
      expect(parsed).toMatchObject({ studentName: 'Rivera, "Alex"', customSlots: '8AM–10AM, 5PM–8PM', validFrom: toIsoAdminAllocationsDisplayDate(fixture.validFrom), validTill: toIsoAdminAllocationsDisplayDate(fixture.validTill), status: 'Active' });
      expect(parsed?.daysLeft).toBeGreaterThan(0);
    });

    it('rejects illegal quote placement and text after a closing quote', () => {
      const headers = 'studentName,smartId,phone,seatNo,shift,customSlots,lockerNo,feeStatus,validFrom,validTill,daysLeft,status';
      expect(() => parseAdminAllocationsCsv(`${headers}\nAl"ex,LIB-1,,S-1,Morning,,A01,Paid,2024-10-01,2024-10-31,3,Active`)).toThrow(/malformed-quotes/);
      expect(() => parseAdminAllocationsCsv(`${headers}\n"Alex"tail,LIB-1,,S-1,Morning,,A01,Paid,2024-10-01,2024-10-31,3,Active`)).toThrow(/malformed-quotes/);
    });

    it('rejects impossible and reversed date ranges and accepts valid ISO dates', () => {
      const headers = 'studentName,smartId,phone,seatNo,shift,customSlots,lockerNo,feeStatus,validFrom,validTill,daysLeft,status';
      expect(() => parseAdminAllocationsCsv(`${headers}\nAlex,LIB-1,,S-1,Morning,,A01,Paid,2024-02-30,2024-03-01,3,Active`)).toThrow(/invalid-row/);
      expect(() => parseAdminAllocationsCsv(`${headers}\nAlex,LIB-1,,S-1,Morning,,A01,Paid,2024-10-02,2024-10-01,3,Active`)).toThrow(/invalid-row/);
      const [pastRange] = parseAdminAllocationsCsv(`${headers}\nAlex,LIB-1,,S-1,Morning,,A01,Paid,2024-10-01,2024-10-31,999,Active`);
      expect(pastRange?.validFrom).toBe('2024-10-01');
      expect(pastRange?.status).toBe('Expired');
      expect(pastRange?.daysLeft).toBeLessThan(0);
    });

    it('neutralizes spreadsheet formula prefixes in imported text before export', () => {
      const source = serializeAdminAllocationsCsv([{ ...fixture, studentName: '=HYPERLINK(\"https://example.invalid\")' }]);
      expect(source).toContain("'=HYPERLINK");
    });

    it('rejects missing headers and invalid row contracts', () => {
      expect(() => parseAdminAllocationsCsv('studentName,smartId\nAlex,LIB-1')).toThrow(/missing-headers/);
      const source = serializeAdminAllocationsCsv(ADMIN_ALLOCATIONS_DEMO_ALLOCATIONS.slice(0, 1)).replace('Active', 'Unknown');
      expect(() => parseAdminAllocationsCsv(source)).toThrow(/invalid-row/);
    });
  });
});

describe('Original suite: AdminAllocationsFilterUtils.test.ts', () => {
  describe('admin allocations filter helpers', () => {
    it('matches the all option and exact domain values', () => {
      expect(matchesAdminAllocationsFilter('Morning', 'all')).toBe(true);
      expect(matchesAdminAllocationsFilter('Morning', 'Evening')).toBe(false);
    });

    it('normalizes only valid calendar dates', () => {
      expect(toIsoAdminAllocationsDisplayDate('1 Oct 2024')).toBe('2024-10-01');
      expect(toIsoAdminAllocationsDisplayDate('31 Feb 2024')).toBe('');
      expect(toIsoAdminAllocationsDisplayDate('2024-10-01')).toBe('2024-10-01');
      expect(toIsoAdminAllocationsDisplayDate('2024-02-30')).toBe('');
      expect(isValidAdminAllocationsIsoDate('2024-02-29')).toBe(true);
      expect(isValidAdminAllocationsIsoDate('2025-02-29')).toBe(false);
      expect(isValidAdminAllocationsIsoDate('2025-13-01')).toBe(false);
    });
  });
});

describe('Original suite: AdminAllocationsMainAllocationsUrlContract.test.ts', () => {
  describe('admin_allocations canonical URL contract', () => {
    it('exports a stable route owned by this module', () => {
      expect(ADMIN_ALLOCATIONS_ROUTES.ROOT).toBe('/admin/admin_seats_shifts_lockers/allocations');
    });
  });
});
