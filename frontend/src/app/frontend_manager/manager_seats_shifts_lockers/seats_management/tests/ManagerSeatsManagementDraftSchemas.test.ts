import { describe, expect, it } from 'vitest';
import { managerSeatsShiftDraftSchema, managerSeatsSeatDraftSchema, managerSeatsMaintenanceDraftSchema, managerSeatsLockerDraftSchema, managerSeatsShiftMigrationDraftSchema } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/schemas/ManagerSeatsManagementDraftSchemas';

describe('seat/shift/locker editable preview schemas', () => {
  it('validates shift names, time ordering, and time format', () => {
    expect(managerSeatsShiftDraftSchema.safeParse({ name: 'Morning', startTime: '08:00', endTime: '12:00', active: true }).success).toBe(true);
    expect(managerSeatsShiftDraftSchema.safeParse({ name: 'M', startTime: '08:00', endTime: '12:00', active: true }).success).toBe(false);
    expect(managerSeatsShiftDraftSchema.safeParse({ name: 'Morning', startTime: '12:00', endTime: '08:00', active: true }).success).toBe(false);
  });
  it('validates seat identity and branch fields', () => {
    expect(managerSeatsSeatDraftSchema.safeParse({ seatNo: 'A-01', branch: 'North Wing', status: 'Working' }).success).toBe(true);
    expect(managerSeatsSeatDraftSchema.safeParse({ seatNo: ' ', branch: '', status: 'Working' }).success).toBe(false);
  });
  it('validates maintenance date, remark, and money precision', () => {
    const draft = { date: '2026-10-20', remark: 'Chair repaired', doneBy: 'Technician', newStatus: 'Working' as const, cost: '350.00' };
    expect(managerSeatsMaintenanceDraftSchema.safeParse(draft).success).toBe(true);
    expect(managerSeatsMaintenanceDraftSchema.safeParse({ ...draft, date: '2026-02-30' }).success).toBe(false);
    expect(managerSeatsMaintenanceDraftSchema.safeParse({ ...draft, cost: '1.234' }).success).toBe(false);
  });
  it('validates locker IDs and migration slot consistency', () => {
    expect(managerSeatsLockerDraftSchema.safeParse({ lockerId: 'D-01' }).success).toBe(true);
    expect(managerSeatsLockerDraftSchema.safeParse({ lockerId: 'D 01' }).success).toBe(false);
    const migration = { selectedStudentId: 's1', newShift: 'Morning', newSeat: 'B-01', customStart: '', customEnd: '', payMode: 'Cash' as const, txnId: '', remark: '' };
    expect(managerSeatsShiftMigrationDraftSchema.safeParse(migration).success).toBe(true);
    expect(managerSeatsShiftMigrationDraftSchema.safeParse({ ...migration, customStart: '10:00' }).success).toBe(false);
  });
});
