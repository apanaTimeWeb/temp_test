// types/SuperadminUsageOverviewTypes.ts
// Comprehensive 12-Resource Usage & Limit Monitoring Type Definitions

export type QuotaSeverity = 'NORMAL' | 'WARNING_80' | 'CRITICAL_90' | 'EXCEEDED_100';

export interface ResourceMetric {
  current: number;
  limit: number;
  unit: string;
  status: QuotaSeverity;
  details?: string;
}

export interface FileUploadMetric extends ResourceMetric {
  fileCount: number;
  fileCountLimit: number;
}

export interface EmailUsageMetric extends ResourceMetric {
  sentCount: number;
  monthlyLimit: number;
  deliveryRatePercent: number;
  bounceRatePercent: number;
}

export interface ApiUsageMetric extends ResourceMetric {
  dailyCalls: number;
  monthlyCalls: number;
  monthlyLimit: number;
  rateLimitPerMinute: number;
}

export interface ExportUsageMetric extends ResourceMetric {
  monthlyExportsCount: number;
  monthlyExportsLimit: number;
  dataExportedMb: number;
  lastExportAt?: string;
}

export interface BackupUsageMetric extends ResourceMetric {
  backupSizeGb: number;
  backupSizeLimitGb: number;
  snapshotCount: number;
  lastBackupAt: string;
  backupStatus: 'HEALTHY' | 'WARNING' | 'FAILED';
}

export type OveragePolicy = 'HARD_STOP' | 'UPGRADE_REQUIRED' | 'ADDON_ACTIVE';

export interface LibraryUsageRecord {
  id: string;
  name: string;
  planName: string;
  planId: string;
  // 12 Mandatory Resources
  branchUsage: ResourceMetric;        // 1. Branch Usage (Allowed vs Current)
  adminUsage: ResourceMetric;         // 2. Admin Usage (Allowed vs Current)
  staffUsage: ResourceMetric;         // 3. Staff Usage (Allowed vs Current)
  memberUsage: ResourceMetric;        // 4. Member Usage (Allowed vs Current)
  storageUsage: ResourceMetric;       // 5. Storage Usage (Used vs Limit GB)
  fileUploadUsage: FileUploadMetric;  // 6. File Uploads (Number and Size)
  smsUsage: ResourceMetric;           // 7. SMS Usage (Credits Consumed vs Limit)
  whatsappUsage: ResourceMetric;      // 8. WhatsApp Usage (Credits Consumed vs Limit)
  emailUsage: EmailUsageMetric;       // 9. Email Usage (Sending Statistics)
  apiUsage: ApiUsageMetric;           // 10. API Requests (Daily/Monthly Usage vs Limit)
  exportUsage: ExportUsageMetric;     // 11. Export Usage (Export Activity)
  backupUsage: BackupUsageMetric;     // 12. Backup Usage (Backup Size & Status)
  
  overagePolicy: OveragePolicy;
  hasPendingRequest: boolean;
  pendingRequestNote?: string;
}

export interface SystemUsageAggregates {
  totalLibraries: number;
  totalBranchesUsed: number;
  totalBranchesLimit: number;
  totalAdminsUsed: number;
  totalAdminsLimit: number;
  totalStaffUsed: number;
  totalStaffLimit: number;
  totalMembersUsed: number;
  totalMembersLimit: number;
  totalStorageGbUsed: number;
  totalStorageGbLimit: number;
  totalFilesUploaded: number;
  totalSmsSent: number;
  totalSmsLimit: number;
  totalWhatsappSent: number;
  totalWhatsappLimit: number;
  totalEmailsSent: number;
  totalEmailsLimit: number;
  totalApiCallsMonthly: number;
  totalBackupsHealthyCount: number;
  exceededLibrariesCount: number;
  pendingRequestsCount: number;
}

export interface UsageOverviewFilterState {
  search: string;
  planTier: string;
  severity: 'ALL' | QuotaSeverity;
  categoryTab: 'all' | 'branches' | 'storage' | 'communication' | 'system';
}
