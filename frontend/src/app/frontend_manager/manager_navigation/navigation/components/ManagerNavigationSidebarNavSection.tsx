'use client';

import type { MANAGER_NAVIGATION_ITEMS } from '@/app/frontend_manager/manager_navigation/navigation/constants/ManagerNavigationNavigationConstants';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

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

const NAV_ICON_BADGE_CLASS: Record<string, string> = {
  nav_dashboard: 'mgr-nav-badge--sky',
  nav_reports: 'mgr-nav-badge--violet',
  nav_enquiries: 'mgr-nav-badge--orange',
  nav_member_directory: 'mgr-nav-badge--emerald',
  nav_new_admission: 'mgr-nav-badge--green',
  nav_group_admission: 'mgr-nav-badge--teal',
  nav_alumni: 'mgr-nav-badge--blue',
  nav_referral_bonus: 'mgr-nav-badge--yellow',
  nav_id_card_generator: 'mgr-nav-badge--indigo',
  nav_seat_matrix: 'mgr-nav-badge--cyan',
  nav_seat_history: 'mgr-nav-badge--purple',
  nav_lockers: 'mgr-nav-badge--pink',
  nav_collect_fee: 'mgr-nav-badge--emerald-deep',
  nav_subscriptions: 'mgr-nav-badge--indigo',
  nav_renewals: 'mgr-nav-badge--cyan-deep',
  nav_payment_promises: 'mgr-nav-badge--amber',
  nav_trust_scores: 'mgr-nav-badge--violet-deep',
  nav_security_deposits: 'mgr-nav-badge--fuchsia',
  nav_fines_payments: 'mgr-nav-badge--rose',
  nav_auto_suspend: 'mgr-nav-badge--red',
  nav_attendance: 'mgr-nav-badge--green',
  nav_absentee_report: 'mgr-nav-badge--amber',
  nav_qr_scanner: 'mgr-nav-badge--sky',
  nav_expenses: 'mgr-nav-badge--red',
  nav_daily_settlement: 'mgr-nav-badge--emerald',
  nav_seat_gap_report: 'mgr-nav-badge--purple',
  nav_assets: 'mgr-nav-badge--blue',
  nav_asset_maintenance: 'mgr-nav-badge--orange',
  nav_complaints: 'mgr-nav-badge--rose-deep',
  nav_notification_center: 'mgr-nav-badge--yellow',
  nav_whatsapp_logs: 'mgr-nav-badge--whatsapp',
  nav_whatsapp_templates: 'mgr-nav-badge--green-deep',
  nav_help_support: 'mgr-nav-badge--sky',
  nav_branch_info: 'mgr-nav-badge--indigo',
  nav_security_settings: 'mgr-nav-badge--emerald-deep',
};

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
  const renderLink = (item: NavigationLinkItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    const badgeClass = NAV_ICON_BADGE_CLASS[item.labelKey] ?? 'mgr-nav-badge--indigo';
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
        <span className={`mgr-nav-icon-badge ${badgeClass}`}>
          <Icon size={16} strokeWidth={2.2} className="mgr-nav-item-icon" aria-hidden="true" />
        </span>
        {(!collapsed || mobileOpen) && <span className="mgr-nav-label">{getNavLabel(item.labelKey)}</span>}
      </Link>
    );
  };

  if (section.key === 'primary') {
    return <div className="mgr-nav-section">{section.items.map(renderLink)}</div>;
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
        {section.items.map(renderLink)}
      </div>
    </section>
  );
}
