import {
  Armchair,
  Users,
  WalletCards,
} from 'lucide-react';
import { ADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_admin/admin_dashboard/dashboard_overview/config/admin_dashboard_overview.url_config';

export const ADMIN_DASHBOARD_DESTINATIONS = [
  {
    key: 'MEMBERS',
    Icon: Users,
    href: ADMIN_DASHBOARD_OVERVIEW_ROUTES.MEMBERS_DIRECTORY,
  },
  {
    key: 'SEATS',
    Icon: Armchair,
    href: ADMIN_DASHBOARD_OVERVIEW_ROUTES.SEATS_MATRIX,
  },
  {
    key: 'FINANCE',
    Icon: WalletCards,
    href: ADMIN_DASHBOARD_OVERVIEW_ROUTES.FINANCE_DASHBOARD,
  },
] as const;

export const ADMIN_DASHBOARD_BRANCH_METRICS: Record<
  string,
  {
    branches: string;
    branchesSub: string;
    members: string;
    membersSub: string;
    occupancy: string;
    occupancySub: string;
    revenue: string;
    revenueNum: number;
    revenueSub: string;
  }
> = {
  all: {
    branches: '3',
    branchesSub: 'All network branches active',
    members: '1,248',
    membersSub: 'Across all 3 branches',
    occupancy: '84.2%',
    occupancySub: 'Peak shift utilization',
    revenue: '₹4,82,500',
    revenueNum: 482500,
    revenueSub: 'Realized this month (Network)',
  },
  'BR-001': {
    branches: '1',
    branchesSub: 'Downtown Central (Main Campus)',
    members: '520',
    membersSub: 'Downtown active members',
    occupancy: '89.4%',
    occupancySub: 'Near full capacity',
    revenue: '₹2,10,000',
    revenueNum: 210000,
    revenueSub: 'Downtown branch collections',
  },
  'BR-002': {
    branches: '1',
    branchesSub: 'Westside Branch (Suspended)',
    members: '280',
    membersSub: 'Westside registered members',
    occupancy: '64.0%',
    occupancySub: 'Reduced occupancy window',
    revenue: '₹92,500',
    revenueNum: 92500,
    revenueSub: 'Westside branch collections',
  },
  'BR-003': {
    branches: '1',
    branchesSub: 'North Hub (Active)',
    members: '448',
    membersSub: 'North Hub active members',
    occupancy: '86.1%',
    occupancySub: 'Optimal shift distribution',
    revenue: '₹1,80,000',
    revenueNum: 180000,
    revenueSub: 'North Hub collections',
  },
};

