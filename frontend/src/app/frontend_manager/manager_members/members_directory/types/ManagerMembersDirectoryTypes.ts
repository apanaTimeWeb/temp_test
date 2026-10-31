export interface ManagerMembersDirectoryRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: string;
  status: 'Active' | 'Expired' | 'Suspended';
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
  documents?: {
    id: string;
    type: string;
    number?: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    fileName: string;
    uploadDate: string;
  }[];
}

export type ManagerMembersDirectoryStatusLabelKey = 'member_status_active' | 'member_status_expired' | 'member_status_suspended';

export interface ManagerMembersDirectoryKpiSectionProps {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  suspendedMembers: number;
}

export type ManagerMembersDirectoryTab = 'All Members' | 'Active Members' | 'Expired Members' | 'Suspended Members' | 'Add Member' | 'Member Profile' | 'Membership Renewal';
