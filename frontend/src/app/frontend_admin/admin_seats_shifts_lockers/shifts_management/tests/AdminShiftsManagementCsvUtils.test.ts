import { describe, expect, it } from 'vitest';
import { ADMIN_SHIFTS_DEMO_SHIFTS } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/mocks/scenarios/admin_shifts_management.scenarios';
import { serializeAdminShiftsCsv } from '@/app/frontend_admin/admin_seats_shifts_lockers/shifts_management/utils/AdminShiftsManagementCsvUtils';

describe('admin shifts CSV export', () => {
  it('exports the complete shift row with stable column names', () => {
    const csv = serializeAdminShiftsCsv(ADMIN_SHIFTS_DEMO_SHIFTS);
    expect(csv.split('\r\n')[0]).toBe('id,name,start_time,end_time,occupancy,capacity,active');
    expect(csv).toContain('1,Morning,06:00,12:00,32,40,true');
    expect(serializeAdminShiftsCsv([{ ...ADMIN_SHIFTS_DEMO_SHIFTS[0]!, name: '=SUM(1,1)' }])).toContain("'=SUM(1,1)");
  });
});
