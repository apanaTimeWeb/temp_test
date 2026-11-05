'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ManagerNavigationSidebarSearchProps {
  collapsed: boolean;
  mobileOpen: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  onToggle: () => void;
}

export function ManagerNavigationSidebarSearch({
  collapsed,
  mobileOpen,
  searchQuery,
  setSearchQuery,
  searchInputRef,
  onToggle,
}: ManagerNavigationSidebarSearchProps) {
  const tManagerUi = useTranslations('manager.manager_navigation.ui');

  if (!collapsed || mobileOpen) {
    return (
      <div className="mgr-sidebar-search">
        <div className="mgr-sidebar-search-wrap">
          <Search size={14} className="mgr-sidebar-search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                setSearchQuery('');
              }
            }}
            placeholder={tManagerUi('search_navigation') ?? 'Search modules...'}
            aria-label={tManagerUi('search_navigation') ?? 'Search modules'}
            data-testid="manager-sidebar-search-input"
            className="mgr-sidebar-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              className="mgr-sidebar-search-clear"
              data-testid="manager-sidebar-search-clear"
              aria-label={tManagerUi('clear_search') ?? 'Clear search'}
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mgr-sidebar-search-collapsed">
      <button
        type="button"
        onClick={() => {
          onToggle();
          setTimeout(() => searchInputRef.current?.focus(), 150);
        }}
        className="mgr-sidebar-search-collapsed-btn"
        title={tManagerUi('search_navigation') ?? 'Search modules'}
        aria-label={tManagerUi('search_navigation') ?? 'Search modules'}
        data-testid="manager-sidebar-search-collapsed-toggle"
      >
        <Search size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

