// RESPONSIBILITY: Helper utilities and initial state generators for Library Provisioning wizard.
import type {
  LibraryOrganizationDetails,
  LibraryMainAdminAccount,
  LibraryBranchCreationItem,
  LibraryProvisioningPlan,
  LibraryProvisioningResult,
} from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesCreateAccountTypes';
import type { SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';

export const DEFAULT_PROVISIONING_PLAN: LibraryProvisioningPlan = {
  planId: 'plan-pro',
  planName: 'Pro Tier (Standard)',
  maxBranches: 3,
  monthlyFee: 14999,
};

export const INITIAL_ORG_STATE: LibraryOrganizationDetails = {
  libraryName: '',
  libraryCode: 'LIB-NEW-101',
  legalBusinessName: '',
  ownerName: '',
  contactNumber: '',
  emailAddress: '',
  address: '',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110001',
  country: 'India',
  timeZone: 'Asia/Kolkata (IST, UTC+05:30)',
  status: 'Active',
};

export const INITIAL_ADMIN_STATE: LibraryMainAdminAccount = {
  adminName: '',
  adminEmail: '',
  mobileNumber: '',
  loginId: 'admin_lead',
  role: 'Library Admin',
  passwordSetupMethod: 'secure_invitation_link',
  mfaEnforced: true,
  status: 'Invited',
};

export const INITIAL_BRANCHES_STATE: LibraryBranchCreationItem[] = [
  {
    id: 'br-init-1',
    branchName: 'Main Campus Branch',
    branchCode: 'LIB-BR01',
    branchAddress: 'Ground Floor, Commercial Complex',
    contactNumber: '+91 98765 00001',
    branchEmail: 'main@apexlibrary.in',
    branchManager: 'Ramesh Varma',
    openingDate: new Date().toISOString().split('T')[0],
    workingHours: '06:00 AM - 11:00 PM',
    weeklyHolidays: 'None (Open 7 Days)',
    status: 'Active',
    allowedModules: { lockers: true, members: true, seats: true, finance: true, accounts: true, communication: true },
    capacitySeats: 150,
    hasAirConditioning: true,
    hasLockers: true,
  },
];

export function generateProvisioningPayload(
  org: LibraryOrganizationDetails,
  admin: LibraryMainAdminAccount,
  branches: LibraryBranchCreationItem[]
): { result: LibraryProvisioningResult; newLib: SuperadminLibrariesLibrary } {
  const generatedTenantId = `TENANT-${org.libraryCode.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const generatedToken = `inv_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  const inviteUrl = `https://platform.smartlibrary.in/admin/invite?token=${generatedToken}&tenant=${generatedTenantId}`;

  const result: LibraryProvisioningResult = {
    tenantId: generatedTenantId,
    libraryCode: org.libraryCode,
    adminEmail: admin.adminEmail,
    invitationUrl: inviteUrl,
    invitationToken: generatedToken,
    provisionedAt: new Date().toLocaleString(),
    branchesCreatedCount: branches.length,
    status: 'activation_pending',
  };

  const newLib: SuperadminLibrariesLibrary = {
    id: generatedTenantId,
    name: org.libraryName,
    location: `${org.city}, ${org.state}`,
    owner: org.ownerName || admin.adminName,
    email: org.emailAddress || admin.adminEmail,
    phone: org.contactNumber || admin.mobileNumber,
    gstNumber: org.legalBusinessName ? '27AABCU9603R1ZM' : 'N/A',
    nextRenewal: '2027-11-20',
    branches: branches.length,
    students: branches.length * 100,
    revenue: 14999,
    status: org.status === 'Active' ? 'Active' : 'Maintenance',
    plan: 'Enterprise',
    joinedAt: 'Just now',
    adminPanelEnabled: true,
    branchList: branches.map((b) => ({
      id: b.id,
      name: b.branchName,
      code: b.branchCode || 'BR-01',
      city: org.city,
      address: b.branchAddress || `${org.city}, ${org.state}`,
      seats: 100,
      shifts: 3,
      managerName: b.branchManager || admin.adminName,
      managerPhone: b.contactNumber || admin.mobileNumber,
      managerEmail: b.branchEmail || admin.adminEmail,
      status: b.status === 'Active' ? 'Active' : 'Maintenance',
    })),
    managerModules: branches[0]?.allowedModules || {},
  };

  return { result, newLib };
}
