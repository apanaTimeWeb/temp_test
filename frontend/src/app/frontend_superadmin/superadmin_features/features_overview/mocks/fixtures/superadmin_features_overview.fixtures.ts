// RESPONSIBILITY: Comprehensive mock fixtures for SuperAdmin Feature & Module Control.
import type { PlatformModuleState, TenantModuleOverride, PlanTier } from '@/app/frontend_superadmin/superadmin_features/features_overview/types/superadmin_features_overview.types';

export interface MockTenantOption {
  id: string;
  name: string;
  code: string;
  planTier: PlanTier;
  branches: Array<{ id: string; name: string; code: string }>;
}

export const MOCK_TENANTS_LIST: MockTenantOption[] = [
  {
    id: 'tenant_apex',
    name: 'Apex Study Library Group',
    code: 'APEX-DL',
    planTier: 'Professional',
    branches: [
      { id: 'br_apex_01', name: 'Laxmi Nagar Central Hub', code: 'APEX-LX-01' },
      { id: 'br_apex_02', name: 'Rohini Sector 14 Express', code: 'APEX-RH-02' },
    ],
  },
  {
    id: 'tenant_patna',
    name: 'Patna Central Reading Rooms',
    code: 'PAT-BH',
    planTier: 'Starter',
    branches: [
      { id: 'br_patna_01', name: 'Kankarbagh Main Hall', code: 'PAT-KB-01' },
      { id: 'br_patna_02', name: 'Boring Road Study Hub', code: 'PAT-BR-02' },
    ],
  },
  {
    id: 'tenant_awadh',
    name: 'Awadh Digital Study Center',
    code: 'AWD-UP',
    planTier: 'Enterprise',
    branches: [
      { id: 'br_awadh_01', name: 'Hazratganj Flagship Campus', code: 'AWD-HZ-01' },
      { id: 'br_awadh_02', name: 'Gomti Nagar Cyber Branch', code: 'AWD-GN-02' },
      { id: 'br_awadh_03', name: 'Alambagh Quick Read Hub', code: 'AWD-AL-03' },
    ],
  },
  {
    id: 'tenant_nalanda',
    name: 'Nalanda e-Granthalaya',
    code: 'NAL-BH',
    planTier: 'Starter',
    branches: [
      { id: 'br_nalanda_01', name: 'Rajgir Heritage Branch', code: 'NAL-RJ-01' },
    ],
  },
];

export const INITIAL_PLATFORM_MODULE_STATES: PlatformModuleState[] = [
  { moduleId: 'mod_dashboard', platformDefault: true, starterPlanAllowed: true, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_books', platformDefault: true, starterPlanAllowed: true, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_members', platformDefault: true, starterPlanAllowed: true, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_seats', platformDefault: true, starterPlanAllowed: true, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_circulation', platformDefault: true, starterPlanAllowed: true, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_finance', platformDefault: true, starterPlanAllowed: true, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_accounts', platformDefault: true, starterPlanAllowed: false, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_communication', platformDefault: true, starterPlanAllowed: true, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_staff', platformDefault: true, starterPlanAllowed: false, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_reports', platformDefault: true, starterPlanAllowed: true, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_export_import', platformDefault: true, starterPlanAllowed: true, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_analytics', platformDefault: true, starterPlanAllowed: false, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_whatsapp', platformDefault: true, starterPlanAllowed: false, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_sms', platformDefault: true, starterPlanAllowed: true, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_barcode_qr', platformDefault: true, starterPlanAllowed: true, professionalPlanAllowed: true, enterprisePlanAllowed: true },
  { moduleId: 'mod_api_access', platformDefault: true, starterPlanAllowed: false, professionalPlanAllowed: false, enterprisePlanAllowed: true },
];

export const INITIAL_TENANT_OVERRIDES: TenantModuleOverride[] = [
  {
    id: 'ovr_001',
    tenantId: 'tenant_patna',
    tenantName: 'Patna Central Reading Rooms',
    moduleId: 'mod_whatsapp',
    moduleName: 'WhatsApp Integration',
    overrideStatus: 'Force_Enabled',
    reason: 'Special Diwali promotional trial granted by SuperAdmin for 30 days',
    updatedAt: '2026-11-15T10:30:00Z',
    updatedBy: 'superadmin@edulibra.com',
    expiresAt: '2026-12-15T23:59:59Z',
  },
  {
    id: 'ovr_002',
    tenantId: 'tenant_apex',
    tenantName: 'Apex Study Library Group',
    branchId: 'br_apex_02',
    branchName: 'Rohini Sector 14 Express',
    moduleId: 'mod_api_access',
    moduleName: 'Public API & Webhooks',
    overrideStatus: 'Force_Disabled',
    reason: 'Security compliance review pending for biometric gate turnstiles',
    updatedAt: '2026-11-18T14:15:00Z',
    updatedBy: 'superadmin@edulibra.com',
  },
];
