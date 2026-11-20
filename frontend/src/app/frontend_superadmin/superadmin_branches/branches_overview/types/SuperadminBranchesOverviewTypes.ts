// RESPONSIBILITY: Define TypeScript contracts for Superadmin Branch Management (Module 03).
export type BranchOperatingStatus = 'active' | 'suspended' | 'deactivated' | 'closed';

export interface SuperadminBranchRecord {
  id: string;
  code: string; // Unique branch code across platform (e.g. BR-DEL-01)
  name: string;
  libraryId: string; // Tenant isolation key
  libraryName: string;
  city: string;
  state: string;
  address: string;
  pinCode: string;
  phone: string;
  email: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  adminName: string;
  adminEmail: string;
  openingDate: string;
  workingHours: string;
  weeklyHolidays: string;
  capacity: number; // Max seat capacity
  activeMembers: number;
  physicalBooks: number; // Branch-specific physical copies
  outstandingBooks: number; // For pre-flight close check
  memberDues: number; // For pre-flight close check (INR)
  cashBalance: number; // Branch cash/financial register (INR)
  plan: string;
  status: BranchOperatingStatus;
  allowedModules: Record<string, boolean>;
  createdAt: string;
  lastAuditAction?: string;
  isArchived?: boolean;
}

export interface BranchAuditLog {
  id: string;
  branchId: string;
  branchCode: string;
  branchName: string;
  action: 'CREATE' | 'EDIT' | 'ACTIVATE' | 'SUSPEND' | 'DEACTIVATE' | 'CLOSE' | 'RESTORE' | 'TRANSFER_MANAGER' | 'CHANGE_ADMIN' | 'CHANGE_PLAN';
  performedBy: string;
  timestamp: string;
  details: string;
  reason?: string;
}

export interface BranchReportStats {
  monthlyRevenue: number;
  occupancyRate: number; // percentage
  activeAdmissions: number;
  booksIssuedThisMonth: number;
  seatsUtilized: number;
}

export interface SuperadminLibraryOption {
  id: string;
  name: string;
  maxBranchesAllowed: number;
  currentBranchCount: number;
}
