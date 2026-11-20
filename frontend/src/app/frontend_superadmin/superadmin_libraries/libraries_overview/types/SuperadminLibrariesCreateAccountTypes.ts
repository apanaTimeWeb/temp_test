// FLOW: Feature source -> superadmin_libraries/libraries_overview/types/SuperadminLibrariesCreateAccountTypes.ts -> typed creation contract -> component consumers.
/** Responsibility: Superadmin Library Creation Types; defines data contracts for organization, admin account, branches, and provisioning. */

export interface LibraryOrganizationDetails {
  libraryName: string;
  libraryCode: string;
  legalBusinessName: string;
  ownerName: string;
  contactNumber: string;
  emailAddress: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  logoUrl?: string;
  website?: string;
  timeZone: string;
  status: 'Active' | 'Trial' | 'Suspended';
}

export interface LibraryMainAdminAccount {
  adminName: string;
  adminEmail: string;
  mobileNumber: string;
  loginId: string;
  role: 'Library Admin';
  passwordSetupMethod: 'secure_invitation_link';
  mfaEnforced: boolean;
  status: 'Invited' | 'Active' | 'Suspended';
}

export interface LibraryBranchCreationItem {
  id: string;
  branchName: string;
  branchCode: string;
  branchAddress: string;
  contactNumber: string;
  branchEmail: string;
  branchManager: string;
  openingDate: string;
  workingHours: string;
  weeklyHolidays: string;
  logoUrl?: string;
  status: 'Active' | 'Setup' | 'Maintenance';
  allowedModules: {
    books: boolean;
    members: boolean;
    seats: boolean;
    finance: boolean;
    accounts: boolean;
    communication: boolean;
  };
  capacitySeats: number;
  hasAirConditioning: boolean;
  hasLockers: boolean;
}

export interface LibraryProvisioningPlan {
  planId: string;
  planName: string;
  maxBranches: number;
  monthlyFee: number;
}

export interface LibraryProvisioningResult {
  tenantId: string;
  libraryCode: string;
  adminEmail: string;
  invitationUrl: string;
  invitationToken: string;
  provisionedAt: string;
  branchesCreatedCount: number;
  status: 'provisioned' | 'activation_pending';
}
