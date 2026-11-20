// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/constants/superadmin_data_export_management.constants.ts
/**
 * @file superadmin_data_export_management.constants.ts
 * @description Constants for Tenant Export, Branch Export, format specifications, and lifecycle states.
 */

export const EXPORT_SCOPES = {
  TENANT: 'TENANT',
  BRANCH: 'BRANCH',
} as const;

export const EXPORT_FORMATS = {
  ENCRYPTED_ZIP: 'ENCRYPTED_ZIP',
  JSON: 'JSON',
  CSV_ARCHIVE: 'CSV_ARCHIVE',
  SQL_DUMP: 'SQL_DUMP',
} as const;

export const EXPORT_STATUS = {
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  READY: 'READY',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
} as const;

export const EXPORT_DATA_ENTITIES = [
  { id: 'catalogs', label: 'Book & Resource Catalogs', defaultChecked: true },
  { id: 'patrons', label: 'Patron Profiles & Memberships', defaultChecked: true },
  { id: 'circulations', label: 'Circulation & Loan History', defaultChecked: true },
  { id: 'financials', label: 'Fines, Invoices & Fee Ledger', defaultChecked: true },
  { id: 'configurations', label: 'Library & Branch Configurations', defaultChecked: false },
  { id: 'audit_logs', label: 'Security & Access Audit Logs', defaultChecked: false },
] as const;

export const EXPORT_TTL_DAYS = 7;
