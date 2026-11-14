// FLOW: Feature source -> superadmin_libraries/libraries_facility_maintenance_work_orders/types/SuperadminLibrariesOverviewFacilityMaintenanceWorkOrdersTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin System Maintenance Types; defines module-owned type contracts for the named data boundary. */
export interface SuperadminSystemSeatMaintenanceSample {
  id: string;
  status: 'Needs Attention' | 'OK';
  lastMaint: string;
  daysSince: number;
}

/**
 * Defines the public SuperadminSystemAssetMaintenanceSample contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property name Display label for the owning feature. Declared type: string.
 * @property qty Value defined by the existing feature-local contract. Declared type: number.
 * @property status Status value as represented by the existing feature contract. Declared type: 'Overdue' | 'Due Soon' | 'OK'.
 * @property lastServiced Value defined by the existing feature-local contract. Declared type: string.
 * @property nextDue Value defined by the existing feature-local contract. Declared type: string.
 * @property daysOverdue Value defined by the existing feature-local contract. Declared type: number.
 */
export interface SuperadminSystemAssetMaintenanceSample {
  name: string;
  qty: number;
  status: 'Overdue' | 'Due Soon' | 'OK';
  lastServiced: string;
  nextDue: string;
  daysOverdue: number;
}

/**
 * Defines the public SuperadminSystemLockerMaintenanceSample contract for libraries overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property status Status value as represented by the existing feature contract. Declared type: 'Issue Reported' | 'OK'.
 * @property lastIssue Value defined by the existing feature-local contract. Declared type: string.
 */
export interface SuperadminSystemLockerMaintenanceSample {
  id: string;
  status: 'Issue Reported' | 'OK';
  lastIssue: string;
}
