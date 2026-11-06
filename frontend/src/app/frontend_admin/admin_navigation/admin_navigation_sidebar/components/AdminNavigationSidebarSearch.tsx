'use client';

import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';

interface AdminNavigationSidebarSearchProps {
  expanded: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onCollapsedToggle: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export function AdminNavigationSidebarSearch({
  expanded,
  searchQuery,
  setSearchQuery,
  onCollapsedToggle,
  searchInputRef,
}: AdminNavigationSidebarSearchProps) {
  const t = useTranslations('ADMIN_NAVIGATION');

  if (!expanded) {
    return (
      <div className="admin-sidebar-search-collapsed">
        <button
          type="button"
          onClick={onCollapsedToggle}
          className="admin-sidebar-search-collapsed-btn focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          title={t('SEARCH_NAVIGATION') ?? 'Search modules'}
          aria-label={t('SEARCH_NAVIGATION') ?? 'Search modules'}
          data-testid="admin-sidebar-search-collapsed-toggle"
        >
          <Search size={16} strokeWidth={2} />
        </button>
      </div>
    );
  }

  return (
    <div className="admin-sidebar-search">
      <div className="admin-sidebar-search-wrap">
        <Search size={14} className="admin-sidebar-search-icon" aria-hidden="true" />
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
          placeholder={t('SEARCH_NAVIGATION') ?? 'Search modules...'}
          aria-label={t('SEARCH_NAVIGATION') ?? 'Search modules'}
          data-testid="admin-sidebar-search-input"
          className="admin-sidebar-search-input"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              searchInputRef.current?.focus();
            }}
            className="admin-sidebar-search-clear"
            data-testid="admin-sidebar-search-clear"
            aria-label={t('CLEAR_SEARCH') ?? 'Clear search'}
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

export default AdminNavigationSidebarSearch;

