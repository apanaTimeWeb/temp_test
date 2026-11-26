'use client';

// RESPONSIBILITY: Renders the top header for the admin module.
// DATA FLOW: AdminShellRoute -> AdminShellHeader

import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { AdminShellLogoutModal } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellLogoutModal';
import {
AdminShellNotificationsMenu,
type AdminShellHeaderNotificationItem,
} from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellNotificationsMenu';
import { AdminShellProfileMenu } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellProfileMenu';
import { AdminShellThemeToggle } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellThemeToggle';
import type { AdminShellHeaderProps } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/types/AdminApplicationInfrastructureApplicationInfrastructureComponentsComponentTypes';
import Button from '@/components/ui/button/Button';
import Select from '@/components/ui/select/Select';
import SelectContent from '@/components/ui/select/SelectContent';
import { SelectItem } from '@/components/ui/select/SelectItem';
import SelectTrigger from '@/components/ui/select/SelectTrigger';
import SelectValue from '@/components/ui/select/SelectValue';
import { readBrowserStorageItem } from '@/lib/browserStorage';
import { Building2, Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const DEFAULT_HEADER_NOTIFICATIONS: AdminShellHeaderNotificationItem[] = [
  {
    id: 'notif-1',
    title: '3 Desk Subscriptions Expiring',
    description: 'Renewals due within 48 hours for Downtown Central desks.',
    time: '10m ago',
    category: 'Finance',
    priority: 'high',
    read: false,
    branch: 'Downtown Central',
  },
  {
    id: 'notif-2',
    title: 'New Student Walk-in Inquiries',
    description: '2 walk-in visitor leads registered at Westside reception.',
    time: '45m ago',
    category: 'CRM',
    priority: 'medium',
    read: false,
    branch: 'Westside Branch',
  },
  {
    id: 'notif-3',
    title: 'Daily Cash Settlement Pending',
    description: 'Morning shift cash counter closing handover awaits approval.',
    time: '2h ago',
    category: 'Accounts',
    priority: 'high',
    read: false,
    branch: 'North Hub',
  },
  {
    id: 'notif-4',
    title: 'Digital Notice Broadcasted',
    description: 'Library holiday schedule notice successfully delivered.',
    time: '1d ago',
    category: 'Notice',
    priority: 'info',
    read: true,
    branch: 'All Branches',
  },
];

function clearAdminClientSession(): void {
  if (typeof window === 'undefined') return;
  try {
    for (const key of ['auth_token', 'user', 'token', 'admin_user']) {
      window.localStorage.removeItem(key);
    }
    window.sessionStorage.clear();
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  } catch {
    // Storage access resilience
  }
}

export function AdminShellHeader({ onMobileOpen, collapsed }: AdminShellHeaderProps) {
  const t = useTranslations('ADMIN_SHELL');
  const router = useRouter();
  const { branches, selectedBranchId, setSelectedBranchId } = useAdminBranch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminShellHeaderNotificationItem[]>(DEFAULT_HEADER_NOTIFICATIONS);
  const [hour, setHour] = useState<number>(-1);
  const [userName, setUserName] = useState<string>('John');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHour(new Date().getHours());
    try {
      const storedResult = readBrowserStorageItem('user');
      if (storedResult.available && storedResult.value) {
        const parsed = JSON.parse(storedResult.value) as { name?: unknown };
        if (
          typeof parsed?.name === 'string' &&
          parsed.name.trim() &&
          !['superadmin', 'super admin', 'admin', 'administrator'].includes(parsed.name.trim().toLowerCase())
        ) {
          setUserName(parsed.name);
        } else {
          setUserName('John');
        }
      }
    } catch {
      // fallback to default
    }
  }, []);

  const greeting =
    hour < 0
      ? (t('WELCOME') || 'Welcome')
      : hour < 12
        ? t('GOOD_MORNING')
        : hour < 17
          ? t('GOOD_AFTERNOON')
          : hour < 21
            ? t('GOOD_EVENING')
            : (t('GOOD_NIGHT') || 'Good Night');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read', { id: 'admin-shell-mark-all-read' });
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleSignOut = useCallback(() => {
    clearAdminClientSession();
    toast.success('Signed out successfully', { id: 'admin-shell-sign-out' });
    setShowLogoutModal(false);
    router.replace('/public_auth/auth_sign_in');
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      if (notificationsMenuRef.current && !notificationsMenuRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLogoutModal(false);
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className={`admin-header ${collapsed ? 'admin-header-collapsed' : 'admin-header-expanded'}`} data-testid="admin-header">
      <div className="admin-header-left flex items-center gap-3">
        <Button
          data-testid="admin_header-AdminShellHeader-control-001"
          variant="ghost"
          size="icon"
          className="admin-mobile-menu-btn"
          onClick={() => onMobileOpen?.()}
          aria-label={t('OPEN_MENU')}
        >
          <Menu size={18} strokeWidth={2} aria-hidden="true" />
        </Button>

        <div className="admin-header-branch-pill">
          <Building2 size={16} className="admin-header-branch-icon" aria-hidden="true" />
          <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
            <SelectTrigger
              className="admin-header-branch-select w-36 sm:w-48 h-8 text-xs sm:text-sm font-semibold border-0 bg-transparent text-text-primary focus:ring-0 focus:outline-none shadow-none"
              aria-label={t('SELECT_BRANCH')}
            >
              <SelectValue placeholder={t('SELECT_BRANCH')} />
            </SelectTrigger>
            <SelectContent className="border border-border bg-overlay text-text-primary shadow-dialog">
              <SelectItem value="all">{t('ALL_BRANCHES')}</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="admin-header-right flex items-center gap-2.5 sm:gap-3">
        <AdminShellThemeToggle />

        <AdminShellNotificationsMenu
          menuRef={notificationsMenuRef}
          isOpen={isNotificationsOpen}
          notifications={notifications}
          unreadCount={unreadCount}
          onToggleOpen={() => {
            setIsNotificationsOpen((prev) => !prev);
            setIsProfileOpen(false);
          }}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllRead={handleMarkAllAsRead}
          onMarkAsRead={handleMarkAsRead}
        />

        <AdminShellProfileMenu
          menuRef={profileMenuRef}
          isOpen={isProfileOpen}
          userName={userName}
          greeting={greeting}
          profileTooltip={t('DEMO_PROFILE_TOOLTIP')}
          administratorLabel={t('ADMINISTRATOR')}
          myProfileLabel={t('MY_PROFILE') ?? 'My Profile'}
          logOutLabel={t('LOG_OUT')}
          onMouseEnter={() => setIsProfileOpen(true)}
          onMouseLeave={() => setIsProfileOpen(false)}
          onToggleOpen={() => setIsProfileOpen((prev) => !prev)}
          onClose={() => setIsProfileOpen(false)}
          onLogoutClick={() => {
            setIsProfileOpen(false);
            setShowLogoutModal(true);
          }}
        />
      </div>

      <AdminShellLogoutModal
        open={showLogoutModal}
        userName={userName}
        title={t('LOG_OUT_TITLE')}
        description={t('LOG_OUT_DESCRIPTION')}
        cancelLabel={t('CANCEL')}
        confirmLabel={t('LOG_OUT')}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleSignOut}
      />
    </header>
  );
}

export type { AdminShellHeaderProps };
