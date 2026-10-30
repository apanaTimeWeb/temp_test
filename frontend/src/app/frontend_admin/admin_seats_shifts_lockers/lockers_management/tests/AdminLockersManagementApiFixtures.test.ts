import { describe, expect, it } from 'vitest';
import { AdminLockersLockerListSchema, AdminLockersSeatListSchema } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/schemas/AdminLockersManagementApiSchema';
import { ADMIN_LOCKERS_API_LOCKERS_FIXTURE, ADMIN_LOCKERS_API_SEAT_MATRIX_FIXTURE } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/mocks/AdminLockersManagementMSWHandlers';
import { ADMIN_LOCKERS_MSW_HANDLERS } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_management/mocks/AdminLockersManagementMSWHandlers';

describe('admin lockers API/MSW contract', () => {
  it('keeps synthetic handler payloads aligned with the Zod response schemas', () => {
    expect(AdminLockersLockerListSchema.safeParse(ADMIN_LOCKERS_API_LOCKERS_FIXTURE).success).toBe(true);
    expect(AdminLockersSeatListSchema.safeParse(ADMIN_LOCKERS_API_SEAT_MATRIX_FIXTURE).success).toBe(true);
    expect(ADMIN_LOCKERS_MSW_HANDLERS).toHaveLength(2);
  });
});
