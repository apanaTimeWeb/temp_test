'use client';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';

// RESPONSIBILITY: Renders the top header for the admin module.
// DATA FLOW: AdminRoute -> AdminHeader

import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Building2, Bell, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { AdminShellThemeToggle } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminShellThemeToggle';
import { useAdminBranch } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import Select from '@/components/ui/select/Select';
import SelectContent from '@/components/ui/select/SelectContent';
import { SelectItem } from '@/components/ui/select/SelectItem';
import SelectTrigger from '@/components/ui/select/SelectTrigger';
import SelectValue from '@/components/ui/select/SelectValue';
import Button from '@/components/ui/button/Button';
import type { AdminShellHeaderProps } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/types/AdminApplicationInfrastructureApplicationInfrastructureComponentsComponentTypes';

export function AdminShellHeader({ onMobileOpen, collapsed }: AdminShellHeaderProps) {
  const t = useTranslations('ADMIN_SHELL');
  const { branches, selectedBranchId, setSelectedBranchId } = useAdminBranch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  // Close profile menu when clicking outside
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  // Close logout modal when pressing Escape
  useEffect(() => {
    if (!showLogoutModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLogoutModal(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutModal]);

  return (
    <header className={`admin-header ${collapsed ? 'admin-header-collapsed' : 'admin-header-expanded'}`} data-testid="admin-header">
      {/* Left Section: Mobile Menu + Branch Selector Pill */}
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
              className="admin-header-branch-select w-36 sm:w-48 h-8 text-xs sm:text-sm font-semibold border-0 bg-transparent text-white focus:ring-0 focus:outline-none shadow-none"
              aria-label={t('SELECT_BRANCH')}
            >
              <SelectValue placeholder={t('SELECT_BRANCH')} />
            </SelectTrigger>
            <SelectContent className="bg-[#0b0c20] border border-indigo-500/30 text-white shadow-2xl">
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

      {/* Right Section: ThemeToggle, Notifications Bell, Avatar Profile Dropdown */}
      <div className="admin-header-right flex items-center gap-2.5 sm:gap-3">
        <AdminShellThemeToggle />

        <button
          type="button"
          data-testid="admin_header-AdminShellHeader-control-002"
          className="admin-bell-btn"
          aria-label={t('NOTIFICATIONS_UNAVAILABLE')}
          title={t('NOTIFICATIONS_BLOCKED')}
        >
          <Bell size={18} strokeWidth={2} aria-hidden="true" />
          <span className="admin-bell-dot" aria-hidden="true" />
        </button>

        <div
          ref={profileMenuRef}
          className="admin-avatar-container"
          onMouseEnter={() => setIsProfileOpen(true)}
          onMouseLeave={() => setIsProfileOpen(false)}
        >
          <button
            type="button"
            data-testid="admin_header-AdminShellHeader-control-003"
            className="admin-avatar-wrapper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
            aria-label={t('DEMO_PROFILE_TOOLTIP')}
            title={t('DEMO_PROFILE_TOOLTIP')}
          >
            <div className="admin-avatar admin-avatar-header" aria-hidden="true">
              <User size={17} strokeWidth={2.2} />
            </div>
            <div className="admin-avatar-details hidden sm:flex">
              <strong>{t('ADMIN_GREETING')}</strong>
            </div>
            <ChevronDown
              size={13}
              className={`admin-avatar-chevron ${isProfileOpen ? 'admin-avatar-chevron--open' : ''}`}
              aria-hidden="true"
            />
          </button>

          {isProfileOpen && (
            <div className="admin-profile-dropdown" role="menu">
              <div className="admin-profile-dropdown-header">
                <div className="admin-avatar admin-avatar-header" aria-hidden="true">
                  <User size={20} strokeWidth={2.2} />
                </div>
                <div className="admin-profile-dropdown-meta">
                  <p className="admin-profile-dropdown-name">{t('ADMIN_GREETING')}</p>
                  <p className="admin-profile-dropdown-email">admin@libraryos.com</p>
                </div>
              </div>

              <div className="admin-profile-dropdown-divider" />

              <div className="flex flex-col gap-1.5 py-1 text-xs">
                <div className="admin-profile-info-row">
                  <span className="text-slate-400">Role:</span>
                  <span className="font-semibold text-white">{t('ADMINISTRATOR')}</span>
                </div>
                <div className="admin-profile-info-row">
                  <span className="text-slate-400">Status:</span>
                  <span className="admin-profile-status-pill">
                    <span className="admin-status-pulse-dot" aria-hidden="true" />
                    Online
                  </span>
                </div>
              </div>

              <div className="admin-profile-dropdown-divider" />

              <Link
                href={ADMIN_ROUTES.SETTINGS_PROFILE}
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <User size={14} strokeWidth={2} />
                <span>{t('MY_PROFILE') ?? 'My Profile'}</span>
              </Link>

              <div className="admin-profile-dropdown-divider" />

              <button
                type="button"
                data-testid="admin_header-AdminShellHeader-control-logout"
                onClick={() => {
                  setIsProfileOpen(false);
                  setShowLogoutModal(true);
                }}
                className="admin-profile-logout-btn"
              >
                <LogOut size={14} strokeWidth={2} />
                <span>{t('LOG_OUT')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {showLogoutModal && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-logout-title"
          aria-describedby="admin-logout-desc"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          data-testid="admin-logout-overlay"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            onClick={() => setShowLogoutModal(false)}
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-sm rounded-2xl border border-indigo-500/30 bg-[#0b0c20] p-6 text-white shadow-2xl animate-in zoom-in-95 fade-in duration-200 focus:outline-none"
            data-testid="admin-logout-modal"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-3">
                <LogOut size={24} strokeWidth={2.2} />
              </div>
              <h2 id="admin-logout-title" className="text-white text-lg font-bold text-center">
                {t('LOG_OUT_TITLE')}
              </h2>
              <p id="admin-logout-desc" className="text-slate-400 text-sm mt-1 text-center">
                {t('LOG_OUT_DESCRIPTION')}
              </p>
            </div>

            <div className="my-4 rounded-xl bg-white/[0.03] border border-white/5 p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center">
                <User size={20} strokeWidth={2.2} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">Administrator</p>
                <p className="text-[11px] text-slate-400 truncate">admin@libraryos.com</p>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded px-1.5 py-0.5">
                ADMIN
              </span>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                data-testid="admin-logout-cancel"
                onClick={() => setShowLogoutModal(false)}
                className="border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors cursor-pointer"
              >
                {t('CANCEL')}
              </button>
              <button
                type="button"
                data-testid="admin-logout-confirm"
                onClick={handleSignOut}
                className="bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <LogOut size={14} strokeWidth={2} />
                <span>{t('LOG_OUT')}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

export type { AdminShellHeaderProps };
