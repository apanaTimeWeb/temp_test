export interface AdminSystemPowerSavingZoneFixture {
  name: string;
  occupancy: number;
  capacity: number;
  current: number;
}

export interface AdminSystemPowerSavingAlertFixture {
  date: string;
  shift: string;
  zone: string;
  threshold: string;
  action: string;
}

/** Synthetic zone metrics shown only by the power-saving demo preview. */
export const ADMIN_SYSTEM_POWER_SAVING_ZONE_FIXTURES: readonly AdminSystemPowerSavingZoneFixture[] = [
  { name: 'Zone A (Ground Floor)', occupancy: 78, capacity: 40, current: 31 },
  { name: 'Zone B (First Floor)', occupancy: 22, capacity: 35, current: 8 },
  { name: 'Zone C (Reading Hall)', occupancy: 91, capacity: 60, current: 55 },
  { name: 'Zone D (Silent Room)', occupancy: 15, capacity: 20, current: 3 },
];

/** Synthetic alert history for the explicitly demo-only preview; no alerts were sent. */
export const ADMIN_SYSTEM_POWER_SAVING_ALERT_FIXTURES: readonly AdminSystemPowerSavingAlertFixture[] = [
  { date: '2026-04-10', shift: 'Evening', zone: 'Zone B', threshold: '30%', action: 'Advisory sent to manager' },
  { date: '2026-04-09', shift: 'Afternoon', zone: 'Zone D', threshold: '30%', action: 'AC shutdown suggested' },
  { date: '2026-04-07', shift: 'Morning', zone: 'Zone B', threshold: '30%', action: 'Advisory sent to manager' },
];
