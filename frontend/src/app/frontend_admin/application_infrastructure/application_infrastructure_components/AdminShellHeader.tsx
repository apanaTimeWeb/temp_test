'use client';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

// RESPONSIBILITY: Renders the top header for the admin module.
// DATA FLOW: AdminRoute -> AdminHeader

import { useEffect, useState, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Building2, Bell, Menu, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogDescription from '@/app/frontend_admin/components/ui/dialog/DialogDescription';
import DialogHeader from '@/app/frontend_admin/components/ui/dialog/DialogHeader';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import DialogFooter from '@/app/frontend_admin/components/ui/dialog/DialogFooter';
import { AdminShellThemeToggle } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellThemeToggle';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import Select from '@/components/ui/select/Select';
import SelectContent from '@/components/ui/select/SelectContent';
import { SelectItem } from '@/components/ui/select/SelectItem';
import SelectTrigger from '@/components/ui/select/SelectTrigger';
import SelectValue from '@/components/ui/select/SelectValue';
import Button from '@/components/ui/button/Button';
import type { AdminShellHeaderProps } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/types/AdminApplicationInfrastructureApplicationInfrastructureComponentsComponentTypes';


export function AdminShellHeader({ onMobileOpen }: AdminShellHeaderProps) {
  const t = useTranslations('ADMIN_SHELL');
  const locale = useLocale();
  const { branches, selectedBranchId, setSelectedBranchId } = useAdminBranch();
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSignOut = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('admin_user');
        sessionStorage.clear();
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      }
    } catch {
      // Storage access resilience
    }
    toast.success('Signed out successfully');
    setShowLogoutModal(false);
    window.location.href = '/public_auth/auth_sign_in';
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('GOOD_MORNING'));
    else if (hour < 18) setGreeting(t('GOOD_AFTERNOON'));
    else setGreeting(t('GOOD_EVENING'));

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    setDateStr(new Date().toLocaleDateString(locale, options));
  }, [locale, t]);

  return (
    <header className="admin-header">

      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Button data-testid="admin_header-AdminShellHeader-control-001"
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => onMobileOpen?.()}
          aria-label={t('OPEN_MENU')}
        >
          <Menu size={18} strokeWidth={2} aria-hidden="true" />
        </Button>

        <div className="flex items-center gap-2">
          <Building2 size={18} strokeWidth={2} className="text-text-secondary hidden sm:block" />
          <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
            <SelectTrigger 
              className="w-36 sm:w-48 h-9 text-sm font-medium border border-border rounded-lg shadow-2xs focus:ring-1 focus:ring-primary admin-application-infrastructure-style-05c66736e4"
              aria-label={t('SELECT_BRANCH')}
            >
              <SelectValue placeholder={t('SELECT_BRANCH')} />
            </SelectTrigger>
            <SelectContent>
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

      {/* Center Section: Greeting & Date */}
      <div className="hidden lg:flex flex-col items-center justify-center">
        <span className="admin-application-infrastructure-style-497290f5f9" >
          {greeting}, {t('ADMIN_GREETING')}! 👋
        </span>
        <span className="admin-application-infrastructure-style-0352cf7c2c" >
          {dateStr}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <AdminShellThemeToggle />
        <button type="button" data-testid="admin_header-AdminShellHeader-control-002" className="admin-bell-btn" aria-label={t('NOTIFICATIONS_UNAVAILABLE')} disabled title={t('NOTIFICATIONS_BLOCKED')}>
          <Bell size={18} strokeWidth={2} aria-hidden="true" />
        </button>
        <Link data-testid="admin_header-AdminShellHeader-control-003" href={ADMIN_ROUTES.SETTINGS_PROFILE} className="admin-avatar admin-application-infrastructure-style-80d654f9c8" title={t('DEMO_PROFILE_TOOLTIP')} >
          LA
        </Link>
        <button
          type="button"
          data-testid="admin_header-AdminShellHeader-control-logout"
          onClick={() => setShowLogoutModal(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-danger-text hover:bg-danger-bg hover:border-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          title={t('LOG_OUT')}
          aria-label={t('LOG_OUT')}
        >
          <LogOut size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="max-w-sm bg-overlay border-border">
          <DialogHeader>
            <DialogTitle>{t('LOG_OUT_TITLE')}</DialogTitle>
            <DialogDescription>{t('LOG_OUT_DESCRIPTION')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="border border-border rounded-md px-4 py-2 text-text-secondary hover:bg-surface-hover transition-colors"
            >
              {t('CANCEL')}
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="bg-danger text-on-danger rounded-md px-4 py-2 font-medium hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              {t('LOG_OUT')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}


export type { AdminShellHeaderProps };
