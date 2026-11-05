'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
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
              <Icon size={18} strokeWidth={2} className="mgr-nav-item-icon" aria-hidden="true" />
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
              <Icon size={18} strokeWidth={2} className="mgr-nav-item-icon" aria-hidden="true" />
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

