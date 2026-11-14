// RESPONSIBILITY: Protect idiomatic Hindi copy for visible maintenance labels cited by ISSUE-042.
import { describe, expect, it } from 'vitest';
import hindi from '@/app/frontend_superadmin/superadmin_libraries/libraries_facility_maintenance_work_orders/locales/superadmin_libraries_overview_facility_maintenance_work_orders_hi.json';

describe('facility maintenance work orders Hindi copy', () => {
  const copy = hindi.SUPERADMIN_SYSTEM.COPY;
  it('uses complete Hindi phrases for visible maintenance headings and metrics', () => {
    expect(copy.TRACK_AND_MANAGE_MAINTENANCE_FOR_SEATS_ASSETS_AND_LOCKERS).toBe('सीटों, संपत्तियों और लॉकरों के रखरखाव की निगरानी और प्रबंधन करें।');
    expect(copy.SEAT_MAINTENANCE_STATUS_AND_LAST_SERVICE_LOG).toBe('सीटों के रखरखाव की स्थिति और पिछली सेवा का विवरण।');
    expect(copy.DAYS_SINCE).toBe('बीते दिन');
    expect(copy.EQUIPMENT_AND_INVENTORY_MAINTENANCE_TRACKING).toBe('उपकरणों और भंडार के रखरखाव की निगरानी।');
    expect(copy.NEXT_DUE).toBe('अगली नियत तिथि');
    expect(copy.LOCKER_ISSUE_REPORTS_AND_STATUS_UPDATES).toBe('लॉकर संबंधी समस्याओं की रिपोर्ट और स्थिति के अपडेट।');
    expect(copy.LAST_REPORTED_ISSUE).toBe('पिछली दर्ज समस्या');
    expect(copy.SEATS_NEEDING_ATTENTION).toBe('ध्यान देने योग्य सीटें');
    expect(copy.ASSETS_OVERDUE).toBe('सेवा की नियत तिथि पार कर चुके उपकरण');
    expect(copy.LOCKER_ISSUES).toBe('लॉकर संबंधी समस्याएँ');
  });
});
