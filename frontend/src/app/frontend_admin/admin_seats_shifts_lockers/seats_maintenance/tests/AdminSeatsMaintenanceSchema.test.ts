import { describe, expect, it } from 'vitest';
import { AdminSeatsMaintenanceFormSchema } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_maintenance/schemas/AdminSeatsMaintenanceSchema';
const valid = { date: '2026-10-20', remark: 'Repaired chair', doneBy: 'Technician', newStatus: 'Working' as const, cost: '12.50' };
describe('AdminSeatsMaintenanceFormSchema', () => {
  it('accepts a valid maintenance entry and optional empty cost', () => {
    expect(AdminSeatsMaintenanceFormSchema.safeParse(valid).success).toBe(true);
    expect(AdminSeatsMaintenanceFormSchema.safeParse({ ...valid, cost: '' }).success).toBe(true);
  });
  it('rejects blank remarks, malformed dates, and invalid money precision', () => {
    expect(AdminSeatsMaintenanceFormSchema.safeParse({ ...valid, remark: '  ' }).success).toBe(false);
    expect(AdminSeatsMaintenanceFormSchema.safeParse({ ...valid, date: '2026-02-30' }).success).toBe(false);
    expect(AdminSeatsMaintenanceFormSchema.safeParse({ ...valid, cost: '-1' }).success).toBe(false);
    expect(AdminSeatsMaintenanceFormSchema.safeParse({ ...valid, cost: '1.234' }).success).toBe(false);
  });
});
