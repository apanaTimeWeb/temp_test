import {
  LayoutDashboard,
  Users,
  Armchair,
  WalletCards,
  Building2,
  UserCog,
  SlidersHorizontal,
  MessageSquare,
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
  ClipboardList,
  Building,
  DownloadCloud,
  FolderOpen,
  Zap,
  Bell,
  BellRing,
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
  { href: ADMIN_NAVIGATION_URLS.SYSTEM, icon: SlidersHorizontal, label: 'System', labelKey: 'SYSTEM' },
  { href: ADMIN_NAVIGATION_URLS.COMMUNICATION, icon: MessageSquare, label: 'Communication', labelKey: 'COMMUNICATION' },
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
      { href: ADMIN_ROUTES.MEMBERS_STUDENTS, icon: UserCheck, label: 'Students', labelKey: 'SUBMODULE_MEMBERS_STUDENTS' },
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
      { href: ADMIN_ROUTES.SHIFTS_MIGRATION, icon: ArrowLeftRight, label: 'Shift Migration', labelKey: 'SUBMODULE_SHIFTS_MIGRATION' },
      { href: ADMIN_ROUTES.ALLOCATIONS, icon: ClipboardCheck, label: 'Allocations', labelKey: 'SUBMODULE_ALLOCATIONS' },
      { href: ADMIN_ROUTES.SEATS_HISTORY, icon: History, label: 'Seat History', labelKey: 'SUBMODULE_SEATS_HISTORY' },
      { href: ADMIN_ROUTES.LOCKERS_MANAGEMENT, icon: Lock, label: 'Lockers Management', labelKey: 'SUBMODULE_LOCKERS_MANAGEMENT' },
      { href: ADMIN_ROUTES.LOCKERS_MATRIX, icon: LayoutGrid, label: 'Locker Matrix', labelKey: 'SUBMODULE_LOCKERS_MATRIX' },
      { href: ADMIN_ROUTES.SEATS_MAINTENANCE, icon: AlertCircle, label: 'Seats Maintenance', labelKey: 'SUBMODULE_SEATS_MAINTENANCE' },
      { href: ADMIN_ROUTES.SHIFTS_GAP, icon: TrendingUp, label: 'Shifts Gap', labelKey: 'SUBMODULE_SHIFTS_GAP' },
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
      { href: ADMIN_ROUTES.FINANCE_COLLECT_FEE, icon: CreditCard, label: 'Collect Fee', labelKey: 'SUBMODULE_FINANCE_COLLECT_FEE' },
      { href: ADMIN_ROUTES.FINANCE_SUBSCRIPTIONS, icon: CalendarCheck, label: 'Subscriptions', labelKey: 'SUBMODULE_FINANCE_SUBSCRIPTIONS' },
      { href: ADMIN_ROUTES.FINANCE_RENEWALS, icon: RefreshCw, label: 'Renewals', labelKey: 'SUBMODULE_FINANCE_RENEWALS' },
      { href: ADMIN_ROUTES.FINANCE_PAYMENTS, icon: DollarSign, label: 'Payments', labelKey: 'SUBMODULE_FINANCE_PAYMENTS' },
      { href: ADMIN_ROUTES.FINANCE_PAYMENT_PROMISES, icon: Handshake, label: 'Payment Promises', labelKey: 'SUBMODULE_FINANCE_PAYMENT_PROMISES' },
      { href: ADMIN_ROUTES.FINANCE_TRUST_SCORE, icon: Shield, label: 'Trust Scores', labelKey: 'SUBMODULE_FINANCE_TRUST_SCORE' },
      { href: ADMIN_ROUTES.FINANCE_SECURITY_DEPOSITS, icon: Wallet, label: 'Security Deposits', labelKey: 'SUBMODULE_FINANCE_SECURITY_DEPOSITS' },
      { href: ADMIN_ROUTES.FINANCE_LATE_FEES, icon: Clock, label: 'Late Fees', labelKey: 'SUBMODULE_FINANCE_LATE_FEES' },
      { href: ADMIN_ROUTES.FINANCE_AUTO_SUSPEND, icon: Ban, label: 'Auto Suspend', labelKey: 'SUBMODULE_FINANCE_AUTO_SUSPEND' },
      { href: ADMIN_ROUTES.FINANCE_INVOICES, icon: FileText, label: 'Invoices', labelKey: 'SUBMODULE_FINANCE_INVOICES' },
      { href: ADMIN_ROUTES.FINANCE_RECEIPTS, icon: Receipt, label: 'Receipts', labelKey: 'SUBMODULE_FINANCE_RECEIPTS' },
      { href: ADMIN_ROUTES.FINANCE_REFERRALS, icon: Users2, label: 'Referrals', labelKey: 'SUBMODULE_FINANCE_REFERRALS' },
      { href: ADMIN_ROUTES.FINANCE_REFUNDS, icon: RotateCcw, label: 'Refunds', labelKey: 'SUBMODULE_FINANCE_REFUNDS' },
    ],
  },
  {
    id: 'accounts_assets',
    primaryHref: ADMIN_ROUTES.ACCOUNTS_ASSETS,
    labelKey: 'ACCOUNTS_ASSETS',
    label: 'Accounts & Assets',
    icon: Building2,
    submodules: [
      { href: ADMIN_ROUTES.ACCOUNTS_EXPENSES, icon: CreditCard, label: 'Expenses', labelKey: 'SUBMODULE_ACCOUNTS_EXPENSES' },
      { href: ADMIN_ROUTES.ACCOUNTS_EXPENSE_CATEGORIES, icon: ClipboardList, label: 'Expense Categories', labelKey: 'SUBMODULE_ACCOUNTS_EXPENSE_CATEGORIES' },
      { href: ADMIN_ROUTES.ACCOUNTS_DAILY_SETTLEMENT, icon: Receipt, label: 'Daily Settlement', labelKey: 'SUBMODULE_ACCOUNTS_DAILY_SETTLEMENT' },
      { href: ADMIN_ROUTES.ACCOUNTS_FINANCIAL_REPORTS, icon: BarChart, label: 'Financial Reports', labelKey: 'SUBMODULE_ACCOUNTS_FINANCIAL_REPORTS' },
      { href: ADMIN_ROUTES.ACCOUNTS_SEAT_GAP_REPORT, icon: TrendingUp, label: 'Seat Gap Report', labelKey: 'SUBMODULE_ACCOUNTS_SEAT_GAP_REPORT' },
      { href: ADMIN_ROUTES.ACCOUNTS_SHIFT_GAP_ANALYZER, icon: BarChart2, label: 'Shift Gap Analyzer', labelKey: 'SUBMODULE_ACCOUNTS_SHIFT_GAP_ANALYZER' },
      { href: ADMIN_ROUTES.ASSETS_REGISTER, icon: Building2, label: 'Asset Register', labelKey: 'SUBMODULE_ASSETS_REGISTER' },
      { href: ADMIN_ROUTES.ASSETS_MAINTENANCE, icon: AlertCircle, label: 'Asset Maintenance', labelKey: 'SUBMODULE_ASSETS_MAINTENANCE' },
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
    id: 'system',
    primaryHref: ADMIN_ROUTES.SYSTEM,
    labelKey: 'SYSTEM',
    label: 'System',
    icon: SlidersHorizontal,
    submodules: [
      { href: ADMIN_ROUTES.SYSTEM_SETTINGS, icon: Settings, label: 'System Settings', labelKey: 'SUBMODULE_SYSTEM_SETTINGS' },
      { href: ADMIN_ROUTES.SYSTEM_AUDIT_LOGS, icon: History, label: 'Audit Logs', labelKey: 'SUBMODULE_SYSTEM_AUDIT_LOGS' },
      { href: ADMIN_ROUTES.SYSTEM_SMART_ID, icon: CreditCard, label: 'Smart ID', labelKey: 'SUBMODULE_SYSTEM_SMART_ID' },
      { href: ADMIN_ROUTES.SYSTEM_BRANDING, icon: Award, label: 'Branding', labelKey: 'SUBMODULE_SYSTEM_BRANDING' },
      { href: ADMIN_ROUTES.SYSTEM_BULK_IMPORT, icon: DownloadCloud, label: 'Bulk Import', labelKey: 'SUBMODULE_SYSTEM_BULK_IMPORT' },
      { href: ADMIN_ROUTES.SYSTEM_DATA_EXPORT, icon: DownloadCloud, label: 'Data Export', labelKey: 'SUBMODULE_SYSTEM_DATA_EXPORT' },
      { href: ADMIN_ROUTES.SYSTEM_MAINTENANCE, icon: AlertCircle, label: 'System Maintenance', labelKey: 'SUBMODULE_SYSTEM_MAINTENANCE' },
      { href: ADMIN_ROUTES.SYSTEM_BACKUPS, icon: FolderOpen, label: 'Backups', labelKey: 'SUBMODULE_SYSTEM_BACKUPS' },
      { href: ADMIN_ROUTES.SYSTEM_OFFLINE, icon: Clock, label: 'Offline Mode', labelKey: 'SUBMODULE_SYSTEM_OFFLINE' },
      { href: ADMIN_ROUTES.SYSTEM_POWER_SAVING, icon: Zap, label: 'Power Saving', labelKey: 'SUBMODULE_SYSTEM_POWER_SAVING' },
      { href: ADMIN_ROUTES.SYSTEM_WAITLIST_AUTOMATION, icon: Clock, label: 'Waitlist Automation', labelKey: 'SUBMODULE_SYSTEM_WAITLIST_AUTOMATION' },
      { href: ADMIN_ROUTES.SYSTEM_GAP_FILLING, icon: TrendingUp, label: 'Gap Filling', labelKey: 'SUBMODULE_SYSTEM_GAP_FILLING' },
      { href: ADMIN_ROUTES.SYSTEM_AUTO_SCALE, icon: SlidersHorizontal, label: 'Auto Scale', labelKey: 'SUBMODULE_SYSTEM_AUTO_SCALE' },
      { href: ADMIN_ROUTES.SYSTEM_WHATSAPP_INTEGRATION, icon: MessageSquare, label: 'WhatsApp Integration', labelKey: 'SUBMODULE_SYSTEM_WHATSAPP_INTEGRATION' },
      { href: ADMIN_ROUTES.SYSTEM_PROFILE, icon: UserCheck, label: 'System Profile', labelKey: 'SUBMODULE_SYSTEM_PROFILE' },
    ],
  },
  {
    id: 'communication',
    primaryHref: ADMIN_ROUTES.COMMUNICATION,
    labelKey: 'COMMUNICATION',
    label: 'Communication',
    icon: MessageSquare,
    submodules: [
      { href: ADMIN_ROUTES.COMMUNICATION_NOTICES, icon: Bell, label: 'Notices', labelKey: 'SUBMODULE_COMMUNICATION_NOTICES' },
      { href: ADMIN_ROUTES.COMMUNICATION_COMPLAINTS, icon: AlertCircle, label: 'Complaints', labelKey: 'SUBMODULE_COMMUNICATION_COMPLAINTS' },
      { href: ADMIN_ROUTES.COMMUNICATION_NOTIFICATION_CENTER, icon: BellRing, label: 'Notification Center', labelKey: 'SUBMODULE_COMMUNICATION_NOTIFICATION_CENTER' },
      { href: ADMIN_ROUTES.COMMUNICATION_WHATSAPP_TEMPLATES, icon: MessageSquare, label: 'WhatsApp Templates', labelKey: 'SUBMODULE_COMMUNICATION_WHATSAPP_TEMPLATES' },
      { href: ADMIN_ROUTES.COMMUNICATION_WHATSAPP_LOGS, icon: History, label: 'WhatsApp Logs', labelKey: 'SUBMODULE_COMMUNICATION_WHATSAPP_LOGS' },
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
