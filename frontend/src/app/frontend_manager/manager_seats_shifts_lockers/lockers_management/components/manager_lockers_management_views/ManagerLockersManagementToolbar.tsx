'use client';

import React from 'react';
import { Search, ChevronDown, X, RotateCcw } from 'lucide-react';
import type { ManagerLockersManagementSampleLocker as Locker } from '../../mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';

interface ManagerLockersManagementToolbarProps {
  lockers: Locker[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  mainTableSearch: string;
  setMainTableSearch: (val: string) => void;
  tManagerUi: (key: string, values?: any) => string;
}

export function ManagerLockersManagementToolbar({
  lockers,
  statusFilter,
  setStatusFilter,
  mainTableSearch,
  setMainTableSearch,
  tManagerUi,
}: ManagerLockersManagementToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-0.5">
      {/* Interactive Status KPI Counter Pills with Semantic Color Active States */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {([
          {
            id: 'all',
            label: tManagerUi('all_statuses'),
            count: lockers.length,
            activeClass: 'bg-primary text-on-primary ring-1 ring-primary shadow-xs',
            activeBadge: 'bg-white/25 text-on-primary',
            inactiveClass: 'bg-surface border border-border text-secondary hover:text-primary hover:bg-surface-hover',
            inactiveBadge: 'bg-surface-highlight text-secondary',
            dotColor: null,
          },
          {
            id: 'Free',
            label: tManagerUi('free'),
            count: lockers.filter((l) => l.status === 'Free').length,
            activeClass: 'bg-emerald-600 text-white ring-1 ring-emerald-600 shadow-xs hover:bg-emerald-700',
            activeBadge: 'bg-white/25 text-white',
            inactiveClass: 'bg-surface border border-border text-secondary hover:text-emerald-600 hover:border-emerald-500/40 hover:bg-emerald-500/5',
            inactiveBadge: 'bg-emerald-500/10 text-emerald-600',
            dotColor: 'bg-emerald-500',
          },
          {
            id: 'Occupied',
            label: tManagerUi('occupied'),
            count: lockers.filter((l) => l.status === 'Occupied').length,
            activeClass: 'bg-rose-600 text-white ring-1 ring-rose-600 shadow-xs hover:bg-rose-700',
            activeBadge: 'bg-white/25 text-white',
            inactiveClass: 'bg-surface border border-border text-secondary hover:text-rose-600 hover:border-rose-500/40 hover:bg-rose-500/5',
            inactiveBadge: 'bg-rose-500/10 text-rose-600',
            dotColor: 'bg-rose-500',
          },
          {
            id: 'Expired',
            label: 'Expired Plan',
            count: lockers.filter(
              (l) =>
                l.status === 'Expired' ||
                ((l.status === 'Occupied' || l.status === 'Expired') &&
                  Boolean(l.expiryDate && new Date(l.expiryDate) < new Date()))
            ).length,
            activeClass: 'bg-amber-600 text-white ring-1 ring-amber-600 shadow-xs hover:bg-amber-700',
            activeBadge: 'bg-white/25 text-white',
            inactiveClass: 'bg-surface border border-border text-secondary hover:text-amber-500 hover:border-amber-500/40 hover:bg-amber-500/5',
            inactiveBadge: 'bg-amber-500/10 text-amber-500',
            dotColor: 'bg-amber-500',
          },
          {
            id: 'Maintenance',
            label: tManagerUi('maintenance'),
            count: lockers.filter((l) => l.status === 'Maintenance').length,
            activeClass: 'bg-amber-600 text-white ring-1 ring-amber-600 shadow-xs hover:bg-amber-700',
            activeBadge: 'bg-white/25 text-white',
            inactiveClass: 'bg-surface border border-border text-secondary hover:text-amber-600 hover:border-amber-500/40 hover:bg-amber-500/5',
            inactiveBadge: 'bg-amber-500/10 text-amber-600',
            dotColor: 'bg-amber-500',
          },
        ] as const).map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${isActive ? tab.activeClass : tab.inactiveClass
                }`}
            >
              {tab.dotColor && !isActive && (
                <span className={`w-2 h-2 rounded-full ${tab.dotColor} shrink-0`} />
              )}
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? tab.activeBadge : tab.inactiveBadge
                  }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 sm:w-72 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          <input
            type="search"
            placeholder="Search locker ID, student name, or Smart ID..."
            className="mgr-input !pl-10 !pr-9 text-xs w-full h-9 rounded-xl border border-border bg-surface text-primary placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
            value={mainTableSearch}
            onChange={(e) => setMainTableSearch(e.target.value)}
          />
          {mainTableSearch.trim() !== '' && (
            <button
              type="button"
              onClick={() => setMainTableSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="relative w-36">
          <select
            aria-label={tManagerUi('filter_by_status')}
            className="mgr-input text-xs w-full h-9 pr-8 appearance-none cursor-pointer rounded-xl bg-surface"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{tManagerUi('all_statuses')}</option>
            <option value="Free">{tManagerUi('free')}</option>
            <option value="Occupied">{tManagerUi('occupied')}</option>
            <option value="Maintenance">{tManagerUi('maintenance')}</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
        </div>

        {(statusFilter !== 'all' || mainTableSearch.trim() !== '') && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setMainTableSearch('');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer h-9"
            title="Reset filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}

