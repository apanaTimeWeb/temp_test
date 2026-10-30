'use client';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

// RESPONSIBILITY: Renders the top header for the admin module.
// DATA FLOW: AdminRoute -> AdminHeader

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Building2, Bell, Menu } from 'lucide-react';
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
              className="w-36 sm:w-48 h-9 text-sm font-medium border border-border/50 rounded-lg shadow-2xs focus:ring-1 focus:ring-primary admin-application-infrastructure-style-05c66736e4"
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
      <div className="flex items-center gap-4">
        <AdminShellThemeToggle />
        <button type="button" data-testid="admin_header-AdminShellHeader-control-002" className="admin-bell-btn" aria-label={t('NOTIFICATIONS_UNAVAILABLE')} disabled title={t('NOTIFICATIONS_BLOCKED')}>
          <Bell size={18} strokeWidth={2} aria-hidden="true" />
        </button>
        <Link data-testid="admin_header-AdminShellHeader-control-003" href={ADMIN_ROUTES.SETTINGS_PROFILE} className="admin-avatar admin-application-infrastructure-style-80d654f9c8" title={t('DEMO_PROFILE_TOOLTIP')} >
          LA
        </Link>
      </div>
    </header>
  );
}


export type { AdminShellHeaderProps };
