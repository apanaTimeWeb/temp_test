import { describe, expect, it, describe as __mergedDescribe } from 'vitest';
import { AdminShiftsMigrationSchema } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/schemas/AdminShiftsMigrationSchema';
import { ADMIN_SHIFTS_MIGRATION_DEMO_SEATS, ADMIN_SHIFTS_MIGRATION_DEMO_SHIFTS, ADMIN_SHIFTS_MIGRATION_DEMO_STUDENTS } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_migration/mocks/scenarios/admin_shifts_migration.scenarios';


const valid = { newShift: 'Evening', newSeat: 'C-01', showCustomSlot: false, customStart: '', customEnd: '', payMode: 'Cash' as const, txnId: '', isPaying: false };
describe('AdminShiftsMigrationSchema', () => {
  it('accepts a normal preview-only draft', () => { expect(AdminShiftsMigrationSchema.safeParse(valid).success).toBe(true); });
  it('requires an ordered custom time pair when custom slots are enabled', () => { expect(AdminShiftsMigrationSchema.safeParse({ ...valid, showCustomSlot: true, customStart: '18:00', customEnd: '17:00' }).success).toBe(false); });
  it('requires transaction reference for non-cash positive adjustments', () => { expect(AdminShiftsMigrationSchema.safeParse({ ...valid, payMode: 'UPI', isPaying: true }).success).toBe(false); });
});

__mergedDescribe("Original suite: AdminShiftsMigrationFixtures.test.ts", () => {
describe('shift migration preview fixtures', () => { it('keeps demo students, shifts and seats in the fixture boundary', () => { expect(ADMIN_SHIFTS_MIGRATION_DEMO_STUDENTS.length).toBeGreaterThan(0); expect(ADMIN_SHIFTS_MIGRATION_DEMO_SHIFTS.every((shift) => (ADMIN_SHIFTS_MIGRATION_DEMO_SEATS[shift.name]?.length ?? 0) > 0)).toBe(true); }); });
});
