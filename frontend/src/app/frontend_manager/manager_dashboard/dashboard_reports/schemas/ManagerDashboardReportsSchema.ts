import { z } from 'zod';

const finiteNumber = z.number().finite();
const numericDisplay = z.union([
  finiteNumber,
  z.string().trim().regex(/^-?\d+(?:\.\d+)?%?$/, 'Expected a numeric display value'),
]).transform(String);
const kpi = z.object({
  title: z.string().trim().min(1),
  value: numericDisplay,
  icon: z.enum(['Users', 'CalendarCheck', 'UserPlus', 'Phone']),
  trend: z.string().optional(),
});
const nonNegativeNumber = finiteNumber.nonnegative();
const percentageNumber = finiteNumber.min(0).max(100);
const percentageDisplay = z.union([percentageNumber, z.string().trim().regex(/^(?:100(?:\.0+)?|(?:\d{1,2})(?:\.\d+)?)(?:%)?$/)]).transform(String);
const series = z.object({ name: z.string().optional(), date: z.string().optional(), day: z.string().optional(), value: percentageNumber });

/** Required response shape: missing collections and invalid numeric values surface as API errors. */
export const managerReportsSchema = z.object({
  kpiCards: z.array(kpi),
  occupancyData: z.array(series),
  growthData: z.array(z.object({ date: z.string().trim().min(1), joined: nonNegativeNumber, exited: nonNegativeNumber })),
  attendanceData: z.array(z.object({ day: z.string().trim().min(1), avg: percentageNumber })),
  absenteesChartData: z.array(z.object({ name: z.string().trim().min(1), absences: nonNegativeNumber })),
  complaintsData: z.array(z.object({ name: z.string().trim().min(1), value: nonNegativeNumber })),
  absenteeRows: z.array(z.object({ name: z.string().trim().min(1), smartId: z.string().trim().min(1), shift: z.string().trim().min(1), daysAbsent: nonNegativeNumber, lastPresent: z.string().trim().min(1) })),
  conversionRows: z.array(z.object({ month: z.string().trim().min(1), newEnq: nonNegativeNumber, converted: nonNegativeNumber, rate: percentageDisplay })),
  seatRows: z.array(z.object({ shift: z.string().trim().min(1), occupancy: percentageDisplay, avgDuration: z.string().trim().min(1) })),
  lockerRows: z.array(z.object({ type: z.string().trim().min(1), occupied: nonNegativeNumber, total: nonNegativeNumber, pct: percentageDisplay })),
  maintenanceRows: z.array(z.object({ item: z.string().trim().min(1), location: z.string().trim().min(1), reported: z.string().trim().min(1), priority: z.enum(['High', 'Medium', 'Low']) })),
}).superRefine((report, context) => {
  report.lockerRows.forEach((row, index) => { if (row.occupied > row.total) context.addIssue({ code: 'custom', path: ['lockerRows', index, 'occupied'], message: 'occupied_exceeds_total' }); });
});
