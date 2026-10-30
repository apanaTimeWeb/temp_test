import { describe, expect, it } from 'vitest';
import { AdminShiftsMigrationSchema } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/schemas/AdminShiftsManagementMigrationSchema';
const valid = { newShift: 'Evening', newSeat: 'C-01', showCustomSlot: false, customStart: '', customEnd: '', payMode: 'Cash' as const, txnId: '', isPaying: false };
describe('AdminShiftsMigrationSchema', () => {
  it('accepts a normal preview-only draft', () => { expect(AdminShiftsMigrationSchema.safeParse(valid).success).toBe(true); });
  it('requires an ordered custom time pair when custom slots are enabled', () => { expect(AdminShiftsMigrationSchema.safeParse({ ...valid, showCustomSlot: true, customStart: '18:00', customEnd: '17:00' }).success).toBe(false); });
  it('requires transaction reference for non-cash positive adjustments', () => { expect(AdminShiftsMigrationSchema.safeParse({ ...valid, payMode: 'UPI', isPaying: true }).success).toBe(false); });
});
