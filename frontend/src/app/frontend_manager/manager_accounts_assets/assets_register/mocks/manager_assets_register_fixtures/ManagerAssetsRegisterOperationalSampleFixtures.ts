import type { ManagerAssetsRegisterCategoryTone as CategoryTone } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterComponentTypes';
export type { CategoryTone };
/**
 * Module-owned illustrative fixtures. These records are preview-only and are not live business data.
 */



export type Category = { id: number; name: string; budget: number; spent: number; color: CategoryTone };

export const MANAGER_ACCOUNTING_SAMPLE_EXPENSE_CATEGORIES: Category[] = [
  { id: 1, name: 'Electricity',   budget: 500000,  spent: 420000,  color: 'warning' },
  { id: 2, name: 'Maintenance',   budget: 400000,  spent: 360000,  color: 'danger' },
  { id: 3, name: 'Internet',      budget: 250000,  spent: 220000,  color: 'info' },
  { id: 4, name: 'Salary',        budget: 1500000, spent: 1200000, color: 'primary' },
  { id: 5, name: 'Stationery',    budget: 100000,  spent: 65000,   color: 'success' },
  { id: 6, name: 'Cleaning',      budget: 120000,  spent: 90000,   color: 'purple' },
];

export type GapRow = {
  seatNo: string;
  shift: string;
  floor: string;
  lastOccupied: string;
  gapDays: number;
  revenueLoss: number;
  status: 'vacant' | 'maintenance';
};

export const MANAGER_ACCOUNTING_SAMPLE_SEAT_GAPS: GapRow[] = [
  { seatNo: 'A-04', shift: 'Morning',   floor: 'Ground', lastOccupied: '2026-03-28', gapDays: 14, revenueLoss: 70000,  status: 'vacant'      },
  { seatNo: 'B-11', shift: 'Afternoon', floor: 'First',  lastOccupied: '2026-03-20', gapDays: 22, revenueLoss: 110000, status: 'vacant'      },
  { seatNo: 'C-07', shift: 'Night',     floor: 'Ground', lastOccupied: '2026-04-01', gapDays: 10, revenueLoss: 50000,  status: 'maintenance' },
  { seatNo: 'A-09', shift: 'Morning',   floor: 'First',  lastOccupied: '2026-03-15', gapDays: 27, revenueLoss: 135000, status: 'vacant'      },
  { seatNo: 'D-02', shift: 'Afternoon', floor: 'Second', lastOccupied: '2026-04-05', gapDays: 6,  revenueLoss: 30000,  status: 'vacant'      },
  { seatNo: 'B-15', shift: 'Morning',   floor: 'Ground', lastOccupied: '2026-03-10', gapDays: 32, revenueLoss: 160000, status: 'vacant'      },
];

export type MaintenanceLog = {
  id: number;
  assetName: string;
  issue: string;
  reportedDate: string;
  scheduledDate: string;
  vendor: string;
  cost: number;
  status: 'pending' | 'in-progress' | 'completed';
};

export const MANAGER_ACCOUNTING_SAMPLE_MAINTENANCE_LOGS: MaintenanceLog[] = [
  { id: 1, assetName: 'AC Unit — Hall A',   issue: 'Gas refill & filter cleaning',  reportedDate: '2026-04-02', scheduledDate: '2026-04-08', vendor: 'CoolTech Services', cost: 180000, status: 'completed'   },
  { id: 2, assetName: 'Water Purifier',      issue: 'Filter replacement',            reportedDate: '2026-04-05', scheduledDate: '2026-04-10', vendor: 'AquaPure',          cost: 90000,  status: 'in-progress' },
  { id: 3, assetName: 'CCTV Camera — B2',    issue: 'Camera not recording',          reportedDate: '2026-04-08', scheduledDate: '2026-04-12', vendor: 'SecureVision',      cost: 120000, status: 'pending'     },
  { id: 4, assetName: 'Biometric Scanner',   issue: 'Fingerprint sensor malfunction',reportedDate: '2026-04-09', scheduledDate: '2026-04-14', vendor: 'TechFix',           cost: 250000, status: 'pending'     },
  { id: 5, assetName: 'Inverter Battery',    issue: 'Battery backup reduced',        reportedDate: '2026-03-28', scheduledDate: '2026-04-03', vendor: 'PowerCare',         cost: 350000, status: 'completed'   },
];

export type ShiftGap = {
  shift: string;
  totalSeats: number;
  occupied: number;
  vacant: number;
  occupancyPct: number;
  avgGapDays: number;
  revenueLoss: number;
};

export type DayGap = { date: string; shift: string; seatNo: string; gapDays: number; loss: number };

export const MANAGER_ACCOUNTING_SAMPLE_SHIFT_GAPS: ShiftGap[] = [
  { shift: 'Morning (6AM–2PM)',   totalSeats: 40, occupied: 34, vacant: 6,  occupancyPct: 85, avgGapDays: 12, revenueLoss: 360000  },
  { shift: 'Afternoon (2PM–9PM)', totalSeats: 40, occupied: 28, vacant: 12, occupancyPct: 70, avgGapDays: 18, revenueLoss: 720000  },
  { shift: 'Night (9PM–6AM)',     totalSeats: 30, occupied: 18, vacant: 12, occupancyPct: 60, avgGapDays: 24, revenueLoss: 864000  },
  { shift: '24-Hour',             totalSeats: 20, occupied: 19, vacant: 1,  occupancyPct: 95, avgGapDays: 5,  revenueLoss: 60000   },
];

export const MANAGER_ACCOUNTING_SAMPLE_SHIFT_GAP_DAYS: DayGap[] = [
  { date: '2026-04-10', shift: 'Afternoon', seatNo: 'B-11', gapDays: 22, loss: 110000 },
  { date: '2026-04-09', shift: 'Night',     seatNo: 'C-07', gapDays: 18, loss: 90000  },
  { date: '2026-04-08', shift: 'Morning',   seatNo: 'A-04', gapDays: 14, loss: 70000  },
  { date: '2026-04-07', shift: 'Night',     seatNo: 'C-12', gapDays: 30, loss: 150000 },
  { date: '2026-04-06', shift: 'Afternoon', seatNo: 'B-03', gapDays: 9,  loss: 45000  },
];

export type Entry = {
  id: number;
  shift: string;
  openingBalance: number;
  cashCollected: number;
  upiCollected: number;
  expenses: number;
  closingBalance: number;
  settledBy: string;
  status: 'pending' | 'settled';
};

export const MANAGER_ACCOUNTING_SAMPLE_DAILY_SETTLEMENTS: Entry[] = [
  { id: 1, shift: 'Morning (6AM–2PM)',   openingBalance: 200000, cashCollected: 450000, upiCollected: 320000, expenses: 80000,  closingBalance: 570000, settledBy: 'Ravi Kumar',  status: 'settled' },
  { id: 2, shift: 'Afternoon (2PM–9PM)', openingBalance: 570000, cashCollected: 310000, upiCollected: 280000, expenses: 40000,  closingBalance: 840000, settledBy: 'Priya Singh', status: 'pending' },
  { id: 3, shift: 'Night (9PM–6AM)',     openingBalance: 840000, cashCollected: 120000, upiCollected: 90000,  expenses: 20000,  closingBalance: 940000, settledBy: '—',           status: 'pending' },
];

export const MANAGER_ACCOUNTING_SAMPLE_MONTHLY_FINANCIALS: Array<{ month: string; income: number; expense: number }> = [
  { month: 'Oct', income: 4200000, expense: 1800000 },
  { month: 'Nov', income: 3800000, expense: 1500000 },
  { month: 'Dec', income: 5100000, expense: 2200000 },
  { month: 'Jan', income: 4700000, expense: 1900000 },
  { month: 'Feb', income: 4400000, expense: 1700000 },
  { month: 'Mar', income: 5600000, expense: 2100000 },
  { month: 'Apr', income: 6100000, expense: 2400000 },
];

export const MANAGER_ACCOUNTING_SAMPLE_CATEGORY_BREAKDOWN: Array<{ category: string; amount: number; pct: number }> = [
  { category: 'Electricity',   amount: 420000,  pct: 17 },
  { category: 'Maintenance',   amount: 360000,  pct: 15 },
  { category: 'Internet',      amount: 220000,  pct: 9  },
  { category: 'Salary',        amount: 1200000, pct: 50 },
  { category: 'Miscellaneous', amount: 220000,  pct: 9  },
];
