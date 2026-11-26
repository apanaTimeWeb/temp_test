'use client';

// RESPONSIBILITY: AdminShellProfileMenu component owned by application_infrastructure_components.

import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { ChevronDown, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import type { RefObject } from 'react';

interface AdminShellProfileMenuProps {
  menuRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  userName: string;
  greeting: string;
  profileTooltip: string;
  administratorLabel: string;
  myProfileLabel: string;
  logOutLabel: string;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggleOpen: () => void;
  onClose: () => void;
  onLogoutClick: () => void;
}

export function AdminShellProfileMenu({
  menuRef,
  isOpen,
  userName,
  greeting,
  profileTooltip,
  administratorLabel,
  myProfileLabel,
  logOutLabel,
  onMouseEnter,
  onMouseLeave,
  onToggleOpen,
  onClose,
  onLogoutClick,
}: AdminShellProfileMenuProps) {
  return (
    <div
      ref={menuRef}
      className="admin-avatar-container"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        type="button"
        data-testid="admin_header-AdminShellHeader-control-003"
        className="admin-avatar-wrapper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={onToggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={profileTooltip}
        title={profileTooltip}
      >
        <div className="admin-avatar admin-avatar-header" aria-hidden="true">
          <User size={17} strokeWidth={2.2} />
        </div>
        <div className="admin-avatar-details hidden sm:flex">
          <span>{greeting}</span>
          <strong>{userName}</strong>
        </div>
        <ChevronDown
          size={13}
          className={`admin-avatar-chevron ${isOpen ? 'admin-avatar-chevron--open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="admin-profile-dropdown" role="menu">
          <div className="admin-profile-dropdown-header">
            <div className="admin-avatar admin-avatar-header" aria-hidden="true">
              <User size={20} strokeWidth={2.2} />
            </div>
            <div className="admin-profile-dropdown-meta">
              <p className="admin-profile-dropdown-name">{userName}</p>
              <p className="admin-profile-dropdown-email">john@libraryos.com</p>
            </div>
          </div>

          <div className="admin-profile-dropdown-divider" />

          <div className="flex flex-col gap-1.5 py-1 text-xs">
            <div className="admin-profile-info-row">
              <span className="text-text-secondary">Role:</span>
              <span className="font-semibold text-text-primary">{administratorLabel}</span>
            </div>
            <div className="admin-profile-info-row">
              <span className="text-text-secondary">Status:</span>
              <span className="admin-profile-status-pill">
                <span className="admin-status-pulse-dot" aria-hidden="true" />
                Online
              </span>
            </div>
          </div>

          <div className="admin-profile-dropdown-divider" />

          <Link
            href={ADMIN_ROUTES.SETTINGS_PROFILE}
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
          >
            <User size={14} strokeWidth={2} aria-hidden="true" />
            <span>{myProfileLabel}</span>
          </Link>

          <div className="admin-profile-dropdown-divider" />

          <button
            type="button"
            data-testid="admin_header-AdminShellHeader-control-logout"
            onClick={onLogoutClick}
            className="admin-profile-logout-btn"
          >
            <LogOut size={14} strokeWidth={2} aria-hidden="true" />
            <span>{logOutLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}
