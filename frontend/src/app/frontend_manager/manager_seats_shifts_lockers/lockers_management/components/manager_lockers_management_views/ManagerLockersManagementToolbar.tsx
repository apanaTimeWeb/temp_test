'use client';

import React from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
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
    <>
      {/* Interactive Status KPI Counter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none">
        {([
          { id: 'all', label: tManagerUi('all_statuses'), count: lockers.length, color: 'text-primary' },
          { id: 'Free', label: tManagerUi('free'), count: lockers.filter((l) => l.status === 'Free').length, color: 'text-success' },
          { id: 'Occupied', label: tManagerUi('occupied'), count: lockers.filter((l) => l.status === 'Occupied').length, color: 'text-danger' },
          { id: 'Maintenance', label: tManagerUi('maintenance'), count: lockers.filter((l) => l.status === 'Maintenance').length, color: 'text-warning' },
        ] as const).map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary'
                  : 'bg-card border border-border text-secondary hover:text-primary hover:bg-surface-hover'
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

      <div className="ss-filter-bar flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search locker number, student name, or ID..."
            className="mgr-input pl-8 text-xs w-full"
            value={mainTableSearch}
            onChange={(e) => setMainTableSearch(e.target.value)}
          />
        </div>
        <div className="ss-filter-bar__select-wrap">
          <select
            aria-label={tManagerUi('filter_by_status')}
            className="ss-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{tManagerUi('all_statuses')}</option>
            <option value="Free">{tManagerUi('free')}</option>
            <option value="Occupied">{tManagerUi('occupied')}</option>
            <option value="Maintenance">{tManagerUi('maintenance')}</option>
          </select>
          <ChevronDown size={14} className="ss-select-icon" />
        </div>

        {(statusFilter !== 'all' || mainTableSearch.trim() !== '') && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setMainTableSearch('');
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
            title="Reset filters"
          >
            <X size={13} /> Reset
          </button>
        )}
      </div>
    </>
  );
}

