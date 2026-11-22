'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import type { MANAGER_NAVIGATION_ITEMS } from '../constants/ManagerNavigationNavigationConstants';

type NavigationLinkItem = Extract<(typeof MANAGER_NAVIGATION_ITEMS)[number], { kind: 'link' }>;

interface ManagerNavigationSidebarNavSectionProps {
  section: {
    key: string;
    labelKey?: string;
    items: NavigationLinkItem[];
  };
  expanded: boolean;
  collapsed: boolean;
  mobileOpen: boolean;
  isActive: (href: string) => boolean;
  getNavLabel: (key: string) => string;
  onToggleGroup: (groupKey: string) => void;
  onLinkClick: () => void;
}

const NAV_ICON_COLORS: Record<string, { iconColor: string; bg: string }> = {
  // Main
  nav_dashboard: { iconColor: '#38bdf8', bg: 'rgba(56, 189, 248, 0.14)' },       // Sky Blue
  nav_reports: { iconColor: '#a78bfa', bg: 'rgba(167, 139, 250, 0.14)' },        // Soft Violet

  // CRM
  nav_enquiries: { iconColor: '#fb923c', bg: 'rgba(251, 146, 60, 0.14)' },       // Warm Orange

  // Members
  nav_member_directory: { iconColor: '#34d399', bg: 'rgba(52, 211, 153, 0.14)' },// Mint Emerald
  nav_new_admission: { iconColor: '#4ade80', bg: 'rgba(74, 222, 128, 0.14)' },   // Bright Green
  nav_group_admission: { iconColor: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.14)' }, // Teal
  nav_alumni: { iconColor: '#60a5fa', bg: 'rgba(96, 165, 250, 0.14)' },          // Blue
  nav_referral_bonus: { iconColor: '#facc15', bg: 'rgba(250, 204, 21, 0.14)' },  // Gold
  nav_id_card_generator: { iconColor: '#818cf8', bg: 'rgba(129, 140, 248, 0.14)' },// Indigo

  // Seats & Shifts
  nav_seat_matrix: { iconColor: '#22d3ee', bg: 'rgba(34, 211, 238, 0.14)' },     // Cyan
  nav_seat_history: { iconColor: '#c084fc', bg: 'rgba(192, 132, 252, 0.14)' },   // Purple
  nav_lockers: { iconColor: '#f472b6', bg: 'rgba(244, 114, 182, 0.14)' },         // Pink

  // Finance
  nav_collect_fee: { iconColor: '#10b981', bg: 'rgba(16, 185, 129, 0.14)' },     // Emerald Green
  nav_subscriptions: { iconColor: '#818cf8', bg: 'rgba(129, 140, 248, 0.14)' }, // Indigo
  nav_renewals: { iconColor: '#06b6d4', bg: 'rgba(6, 182, 212, 0.14)' },         // Cyan
  nav_payment_promises: { iconColor: '#fbbf24', bg: 'rgba(251, 191, 36, 0.14)' },// Amber
  nav_trust_scores: { iconColor: '#a855f7', bg: 'rgba(168, 85, 247, 0.14)' },    // Violet
  nav_security_deposits: { iconColor: '#e879f9', bg: 'rgba(232, 121, 249, 0.14)' },// Fuchsia
  nav_fines_payments: { iconColor: '#fb7185', bg: 'rgba(251, 113, 133, 0.14)' }, // Rose Coral
  nav_auto_suspend: { iconColor: '#f87171', bg: 'rgba(248, 113, 113, 0.14)' },   // Red

  // Operations
  nav_attendance: { iconColor: '#4ade80', bg: 'rgba(74, 222, 128, 0.14)' },      // Green
  nav_absentee_report: { iconColor: '#fbbf24', bg: 'rgba(251, 191, 36, 0.14)' }, // Amber
  nav_qr_scanner: { iconColor: '#38bdf8', bg: 'rgba(56, 189, 248, 0.14)' },      // Sky Blue

  // Accounts & Assets
  nav_expenses: { iconColor: '#f87171', bg: 'rgba(248, 113, 113, 0.14)' },        // Red
  nav_daily_settlement: { iconColor: '#34d399', bg: 'rgba(52, 211, 153, 0.14)' },// Emerald
  nav_seat_gap_report: { iconColor: '#c084fc', bg: 'rgba(192, 132, 252, 0.14)' },// Purple
  nav_assets: { iconColor: '#60a5fa', bg: 'rgba(96, 165, 250, 0.14)' },          // Blue
  nav_asset_maintenance: { iconColor: '#fb923c', bg: 'rgba(251, 146, 60, 0.14)' },// Orange

  // Communication
  nav_complaints: { iconColor: '#f43f5e', bg: 'rgba(244, 63, 94, 0.14)' },       // Rose
  nav_notification_center: { iconColor: '#facc15', bg: 'rgba(250, 204, 21, 0.14)' }, // Gold
  nav_whatsapp_logs: { iconColor: '#25d366', bg: 'rgba(37, 211, 102, 0.14)' },   // WhatsApp Green
  nav_whatsapp_templates: { iconColor: '#22c55e', bg: 'rgba(34, 197, 94, 0.14)' },// Green

  // Support & Settings
  nav_help_support: { iconColor: '#38bdf8', bg: 'rgba(56, 189, 248, 0.14)' },    // Sky
  nav_branch_info: { iconColor: '#818cf8', bg: 'rgba(129, 140, 248, 0.14)' },     // Indigo
  nav_security_settings: { iconColor: '#10b981', bg: 'rgba(16, 185, 129, 0.14)' },// Emerald Shield
};

const DEFAULT_ICON_COLOR = { iconColor: '#818cf8', bg: 'rgba(129, 140, 248, 0.14)' };

export function ManagerNavigationSidebarNavSection({
  section,
  expanded,
  collapsed,
  mobileOpen,
  isActive,
  getNavLabel,
  onToggleGroup,
  onLinkClick,
}: ManagerNavigationSidebarNavSectionProps) {
  if (section.key === 'primary') {
    return (
      <div className="mgr-nav-section">
        {section.items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          const colorMeta = NAV_ICON_COLORS[item.labelKey] ?? DEFAULT_ICON_COLOR;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mgr-nav-item${active ? ' active' : ''}`}
              data-testid={`manager-nav-link-${item.href.replace(/[^a-zA-Z0-9]+/g, '-')}`}
              aria-current={active ? 'page' : undefined}
              title={collapsed && !mobileOpen ? getNavLabel(item.labelKey) : undefined}
              onClick={onLinkClick}
            >
              <span
                className="mgr-nav-icon-badge"
                style={{
                  color: colorMeta.iconColor,
                  backgroundColor: active ? `${colorMeta.iconColor}33` : colorMeta.bg,
                  boxShadow: active ? `0 0 14px ${colorMeta.iconColor}50` : undefined,
                }}
              >
                <Icon size={16} strokeWidth={2.2} className="mgr-nav-item-icon" aria-hidden="true" />
              </span>
              {(!collapsed || mobileOpen) && (
                <span className="mgr-nav-label">{getNavLabel(item.labelKey)}</span>
              )}
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <section className="mgr-nav-section">
      {(!collapsed || mobileOpen) && (
        <button
          type="button"
          className="mgr-nav-group-label"
          aria-expanded={expanded}
          aria-controls={`manager-nav-group-${section.key}`}
          data-testid={`manager-nav-group-toggle-${section.key}`}
          onClick={() => onToggleGroup(section.key)}
        >
          <span>{getNavLabel(section.labelKey!)}</span>
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={`mgr-nav-group-chevron${expanded ? ' is-expanded' : ''}`}
          />
        </button>
      )}
      <div
        id={`manager-nav-group-${section.key}`}
        hidden={!expanded}
        className={`mgr-nav-group-items${!expanded ? ' mgr-nav-group-items-collapsed' : ''}`}
      >
        {section.items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          const colorMeta = NAV_ICON_COLORS[item.labelKey] ?? DEFAULT_ICON_COLOR;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mgr-nav-item${active ? ' active' : ''}`}
              data-testid={`manager-nav-link-${item.href.replace(/[^a-zA-Z0-9]+/g, '-')}`}
              aria-current={active ? 'page' : undefined}
              title={collapsed && !mobileOpen ? getNavLabel(item.labelKey) : undefined}
              onClick={onLinkClick}
            >
              <span
                className="mgr-nav-icon-badge"
                style={{
                  color: colorMeta.iconColor,
                  backgroundColor: active ? `${colorMeta.iconColor}33` : colorMeta.bg,
                  boxShadow: active ? `0 0 14px ${colorMeta.iconColor}50` : undefined,
                }}
              >
                <Icon size={16} strokeWidth={2.2} className="mgr-nav-item-icon" aria-hidden="true" />
              </span>
              {(!collapsed || mobileOpen) && (
                <span className="mgr-nav-label">{getNavLabel(item.labelKey)}</span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
