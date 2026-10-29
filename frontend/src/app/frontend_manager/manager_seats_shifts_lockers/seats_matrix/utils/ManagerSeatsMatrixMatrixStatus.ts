import type { LockerCellStatus, SeatStatus } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_matrix/types/ManagerSeatsMatrixTypes';

function normalizedStatus(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function normalizeManagerSeatMatrixStatus(
  value: unknown,
  flags: { isOccupied?: unknown; isExpiring?: unknown; isActive?: unknown; isMaintenance?: unknown } = {},
): SeatStatus {
  const status = normalizedStatus(value);
  if (flags.isOccupied === true || status === 'occupied') return 'occupied';
  if (flags.isExpiring === true || status === 'expiring') return 'expiring';
  if (flags.isActive === true || status === 'free' || status === 'available') return 'free';
  if (flags.isMaintenance === true || status === 'maintenance' || status === 'under_maintenance') return 'maintenance';
  return 'unknown';
}

export function normalizeManagerLockerMatrixStatus(
  value: unknown,
  flags: { isOccupied?: unknown; isActive?: unknown; isMaintenance?: unknown } = {},
): LockerCellStatus {
  const status = normalizedStatus(value);
  if (flags.isOccupied === true || status === 'occupied') return 'occupied';
  if (flags.isActive === true || status === 'free' || status === 'available') return 'free';
  if (flags.isMaintenance === true || status === 'maintenance' || status === 'under_maintenance') return 'maintenance';
  return 'unknown';
}
