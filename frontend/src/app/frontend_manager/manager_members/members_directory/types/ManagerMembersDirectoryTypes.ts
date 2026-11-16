export interface ManagerMembersDirectoryLeaveDetails {
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  notes?: string;
  approvedAt?: string;
  extendExpiry?: boolean;
  releaseSeatBuffer?: boolean;
}

export interface ManagerMembersDirectoryRecord {
  id: string;
  smartId?: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Blocked' | 'On Leave';
  joinDate: string;
  expiryDate: string;
  seat?: string;
  shift?: string;
  floor?: string;
  locker?: string;
  address?: string;
  dob?: string;
  gender?: string;
  department?: string;
  college?: string;
  preparationFor?: string;
  paymentMode?: string;
  remarks?: string;
  guardian?: string;
  emergencyContact?: string;
  referralPoints?: number;
  referredBy?: string;
  isFrozen?: boolean;
  leaveDetails?: ManagerMembersDirectoryLeaveDetails;
  documents?: {
    id: string;
    type: string;
    number?: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    fileName: string;
    uploadDate: string;
  }[];
}

export type ManagerMembersDirectoryStatusLabelKey =
  | 'member_status_active'
  | 'member_status_expired'
  | 'member_status_suspended'
  | 'member_status_blocked'
  | 'member_status_on_leave';

export interface ManagerMembersDirectoryKpiSectionProps {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  suspendedMembers: number;
  activeTab?: string;
  onSelectTab?: (tab: ManagerMembersDirectoryTab) => void;
  timeHorizonLabel?: string;
}

export type ManagerMembersDirectoryTab = 'All Members' | 'Active Members' | 'Expired Members' | 'Suspended Members' | 'Add Member' | 'Member Profile' | 'Membership Renewal';
