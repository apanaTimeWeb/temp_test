// RESPONSIBILITY: Define local sample fixtures for libraries facility power management; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> local typed fixture keys -> translated preview rendering; no live telemetry is represented.

/** Synthetic local preview fixture; it does not represent persisted backend state. */
export const SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ZONES = [
  { nameKey: 'COPY.ZONE_A_GROUND_FLOOR', occupancy: 78, capacity: 40, current: 31 },
  { nameKey: 'COPY.ZONE_B_FIRST_FLOOR', occupancy: 22, capacity: 35, current: 8 },
  { nameKey: 'COPY.ZONE_C_READING_HALL', occupancy: 91, capacity: 60, current: 55 },
  { nameKey: 'COPY.ZONE_D_SILENT_ROOM', occupancy: 15, capacity: 20, current: 3 },
] as const;

/** Synthetic local preview fixture; it does not represent persisted backend state. */
export const SUPERADMIN_SYSTEM_POWER_SAVING_SAMPLE_ALERT_LOG = [
  { date: '2026-04-10', shiftKey: 'COPY.EVENING', zoneKey: 'COPY.ZONE_B', threshold: '30%', actionKey: 'COPY.ADVISORY_SENT_TO_MANAGER' },
  { date: '2026-04-09', shiftKey: 'COPY.AFTERNOON', zoneKey: 'COPY.ZONE_D', threshold: '30%', actionKey: 'COPY.AC_SHUTDOWN_SUGGESTED' },
  { date: '2026-04-07', shiftKey: 'COPY.MORNING', zoneKey: 'COPY.ZONE_B', threshold: '30%', actionKey: 'COPY.ADVISORY_SENT_TO_MANAGER' },
] as const;
