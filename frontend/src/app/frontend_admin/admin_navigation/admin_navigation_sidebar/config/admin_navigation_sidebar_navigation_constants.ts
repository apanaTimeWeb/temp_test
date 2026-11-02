import {
  LayoutDashboard,
  Users,
  Armchair,
  WalletCards,
  Building2,
  UserCog,
  Settings,
  BarChart,
  BarChart2,
  UserCheck,
  Phone,
  CreditCard,
  Award,
  Ban,
  LayoutGrid,
  Clock,
  ArrowLeftRight,
  ClipboardCheck,
  History,
  Lock,
  AlertCircle,
  TrendingUp,
  CalendarCheck,
  RefreshCw,
  DollarSign,
  Handshake,
  Shield,
  Wallet,
  FileText,
  Receipt,
  Users2,
  RotateCcw,
  Building,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';
import type { AdminNavItem } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/types/AdminNavigationSidebarTypes';
import { ADMIN_NAVIGATION_URLS } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar.url_config';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

/** One primary sidebar destination per approved business domain; child features navigate in domain secondary navigation. */
export const ADMIN_SIDEBAR_NAV: AdminNavItem[] = [
  { href: ADMIN_NAVIGATION_URLS.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard', labelKey: 'DASHBOARD' },
  { href: ADMIN_NAVIGATION_URLS.MEMBERS, icon: Users, label: 'Members', labelKey: 'MEMBERS' },
  { href: ADMIN_NAVIGATION_URLS.SEATS_SHIFTS_LOCKERS, icon: Armchair, label: 'Seats, Shifts & Lockers', labelKey: 'SEATS_SHIFTS_LOCKERS' },
  { href: ADMIN_NAVIGATION_URLS.FINANCE, icon: WalletCards, label: 'Finance', labelKey: 'FINANCE' },
  { href: ADMIN_NAVIGATION_URLS.ACCOUNTS_ASSETS, icon: Building2, label: 'Accounts & Assets', labelKey: 'ACCOUNTS_ASSETS' },
  { href: ADMIN_NAVIGATION_URLS.STAFF, icon: UserCog, label: 'Staff', labelKey: 'STAFF' },
  { href: ADMIN_NAVIGATION_URLS.SETTINGS, icon: Settings, label: 'Settings', labelKey: 'SETTINGS' },
];

export interface AdminNavigationSubItem {
  href: string;
  icon: LucideIcon;
  label: string;
  labelKey: string;
}

export interface AdminNavigationGroup {
  id: string;
  primaryHref: string;
  labelKey: string;
  label: string;
  icon: LucideIcon;
  submodules: AdminNavigationSubItem[];
}

export const ADMIN_NAVIGATION_GROUPS: AdminNavigationGroup[] = [
  {
    id: 'dashboard',
    primaryHref: ADMIN_ROUTES.DASHBOARD,
    labelKey: 'DASHBOARD',
    label: 'Dashboard',
    icon: LayoutDashboard,
    submodules: [
      { href: ADMIN_ROUTES.DASHBOARD_OVERVIEW, icon: LayoutDashboard, label: 'Dashboard Overview', labelKey: 'SUBMODULE_DASHBOARD_OVERVIEW' },
      { href: ADMIN_ROUTES.DASHBOARD_REPORTS, icon: BarChart2, label: 'Dashboard Reports', labelKey: 'SUBMODULE_DASHBOARD_REPORTS' },
    ],
  },
  {
    id: 'members',
    primaryHref: ADMIN_ROUTES.MEMBERS,
    labelKey: 'MEMBERS',
    label: 'Members',
    icon: Users,
    submodules: [
      { href: ADMIN_ROUTES.MEMBERS_DIRECTORY, icon: Users, label: 'Members Directory', labelKey: 'SUBMODULE_MEMBERS_DIRECTORY' },
      { href: ADMIN_ROUTES.MEMBERS_ENQUIRIES, icon: Phone, label: 'Enquiries', labelKey: 'SUBMODULE_MEMBERS_ENQUIRIES' },
      { href: ADMIN_ROUTES.MEMBERS_PLANS, icon: CreditCard, label: 'Plans & Packages', labelKey: 'SUBMODULE_MEMBERS_PLANS' },
      { href: ADMIN_ROUTES.MEMBERS_COUPONS, icon: Award, label: 'Coupons & Discounts', labelKey: 'SUBMODULE_MEMBERS_COUPONS' },
      { href: ADMIN_ROUTES.MEMBERS_BLACKLIST, icon: Ban, label: 'Blacklist', labelKey: 'SUBMODULE_MEMBERS_BLACKLIST' },
    ],
  },
  {
    id: 'seats_shifts_lockers',
    primaryHref: ADMIN_ROUTES.SEATS_SHIFTS_LOCKERS,
    labelKey: 'SEATS_SHIFTS_LOCKERS',
    label: 'Seats, Shifts & Lockers',
    icon: Armchair,
    submodules: [
      { href: ADMIN_ROUTES.SEATS_MATRIX, icon: LayoutGrid, label: 'Seat Matrix', labelKey: 'SUBMODULE_SEATS_MATRIX' },
      { href: ADMIN_ROUTES.SEATS_MANAGEMENT, icon: Armchair, label: 'Seats Management', labelKey: 'SUBMODULE_SEATS_MANAGEMENT' },
      { href: ADMIN_ROUTES.SHIFTS_MANAGEMENT, icon: Clock, label: 'Shifts Management', labelKey: 'SUBMODULE_SHIFTS_MANAGEMENT' },
      { href: ADMIN_ROUTES.SHIFTS_GAP, icon: TrendingUp, label: 'Shift Overstay & Gaps', labelKey: 'SUBMODULE_SHIFTS_GAP' },
      { href: ADMIN_ROUTES.LOCKERS_MATRIX, icon: LayoutGrid, label: 'Locker Matrix', labelKey: 'SUBMODULE_LOCKERS_MATRIX' },
    ],
  },
  {
    id: 'finance',
    primaryHref: ADMIN_ROUTES.FINANCE,
    labelKey: 'FINANCE',
    label: 'Finance',
    icon: WalletCards,
    submodules: [
      { href: ADMIN_ROUTES.FINANCE_DASHBOARD, icon: LayoutDashboard, label: 'Finance Dashboard', labelKey: 'SUBMODULE_FINANCE_DASHBOARD' },
      { href: ADMIN_ROUTES.FINANCE_PAYMENTS, icon: DollarSign, label: 'Payments', labelKey: 'SUBMODULE_FINANCE_PAYMENTS' },
      { href: ADMIN_ROUTES.FINANCE_REFUNDS, icon: RotateCcw, label: 'Refunds Approval', labelKey: 'SUBMODULE_FINANCE_REFUNDS' },
      { href: ADMIN_ROUTES.FINANCE_REFERRALS, icon: Users2, label: 'Referrals', labelKey: 'SUBMODULE_FINANCE_REFERRALS' },
    ],
  },
  {
    id: 'accounts_assets',
    primaryHref: ADMIN_ROUTES.ACCOUNTS_ASSETS,
    labelKey: 'ACCOUNTS_ASSETS',
    label: 'Accounts & Assets',
    icon: Building2,
    submodules: [
      { href: ADMIN_ROUTES.ACCOUNTS_DAILY_SETTLEMENT, icon: Receipt, label: 'Daily Settlement', labelKey: 'SUBMODULE_ACCOUNTS_DAILY_SETTLEMENT' },
      { href: ADMIN_ROUTES.ACCOUNTS_EXPENSES, icon: CreditCard, label: 'Expenses', labelKey: 'SUBMODULE_ACCOUNTS_EXPENSES' },
      { href: ADMIN_ROUTES.ACCOUNTS_FINANCIAL_REPORTS, icon: BarChart, label: 'Financial Reports', labelKey: 'SUBMODULE_ACCOUNTS_FINANCIAL_REPORTS' },
      { href: ADMIN_ROUTES.ACCOUNTS_SEAT_GAP_REPORT, icon: TrendingUp, label: 'Seat Gap Report', labelKey: 'SUBMODULE_ACCOUNTS_SEAT_GAP_REPORT' },
      { href: ADMIN_ROUTES.ASSETS_REGISTER, icon: Building, label: 'Assets Register', labelKey: 'SUBMODULE_ASSETS_REGISTER' },
    ],
  },
  {
    id: 'staff',
    primaryHref: ADMIN_ROUTES.STAFF,
    labelKey: 'STAFF',
    label: 'Staff',
    icon: UserCog,
    submodules: [
      { href: ADMIN_ROUTES.STAFF_DIRECTORY, icon: Users, label: 'Staff Directory', labelKey: 'SUBMODULE_STAFF_DIRECTORY' },
      { href: ADMIN_ROUTES.STAFF_ROLES_PERMISSIONS, icon: Shield, label: 'Roles & Permissions', labelKey: 'SUBMODULE_STAFF_ROLES_PERMISSIONS' },
    ],
  },
  {
    id: 'settings',
    primaryHref: ADMIN_ROUTES.SETTINGS,
    labelKey: 'SETTINGS',
    label: 'Settings',
    icon: Settings,
    submodules: [
      { href: ADMIN_ROUTES.SETTINGS_BRANCHES, icon: Building, label: 'Branches', labelKey: 'SUBMODULE_SETTINGS_BRANCHES' },
      { href: ADMIN_ROUTES.SETTINGS_PROFILE, icon: UserCheck, label: 'Profile', labelKey: 'SUBMODULE_SETTINGS_PROFILE' },
      { href: ADMIN_ROUTES.SETTINGS_SECURITY, icon: Shield, label: 'Security', labelKey: 'SUBMODULE_SETTINGS_SECURITY' },
      { href: ADMIN_ROUTES.SETTINGS_SUPPORT, icon: LifeBuoy, label: 'Support', labelKey: 'SUBMODULE_SETTINGS_SUPPORT' },
    ],
  },
];
