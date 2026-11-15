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
      {/* Interactive Status KPI Counter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {([
          { id: 'all', label: tManagerUi('all_statuses'), count: lockers.length },
          { id: 'Free', label: tManagerUi('free'), count: lockers.filter((l) => l.status === 'Free').length },
          { id: 'Occupied', label: tManagerUi('occupied'), count: lockers.filter((l) => l.status === 'Occupied').length },
          { id: 'Maintenance', label: tManagerUi('maintenance'), count: lockers.filter((l) => l.status === 'Maintenance').length },
        ] as const).map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary'
                  : 'bg-surface border border-border text-secondary hover:text-primary hover:bg-surface-hover'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-primary-subtle text-on-primary' : 'bg-surface-highlight text-secondary'
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
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          <input
            type="search"
            placeholder="Search locker ID, student name, or Smart ID..."
            className="mgr-input pl-9 pr-8 text-xs w-full h-9 rounded-xl"
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

