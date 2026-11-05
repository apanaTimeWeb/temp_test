'use client';

import React from 'react';
import { Search, X, Download } from 'lucide-react';
import { MANAGER_COMMUNICATION_COMPLAINT_TABS } from '../../constants/ManagerCommunicationComplaintsComplaintConstants';
import type {
  ManagerCommunicationComplaintsComplaint,
  ManagerCommunicationComplaintsComplaintStatus,
} from '../../types/ManagerCommunicationComplaintsTypes';

interface ManagerCommunicationComplaintsToolbarProps {
  tab: ManagerCommunicationComplaintsComplaintStatus | 'All';
  setTab: (tab: ManagerCommunicationComplaintsComplaintStatus | 'All') => void;
  allComplaints: ManagerCommunicationComplaintsComplaint[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCsv: () => void;
  onResetPage: () => void;
}

export function ManagerCommunicationComplaintsToolbar({
  tab,
  setTab,
  allComplaints,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  hasActiveFilters,
  onResetFilters,
  onExportCsv,
  onResetPage,
}: ManagerCommunicationComplaintsToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {MANAGER_COMMUNICATION_COMPLAINT_TABS.map((item) => {
          const count =
            item === 'All' ? allComplaints.length : allComplaints.filter((c) => c.status === item).length;
          const isActive = tab === item;
          return (
            <button
              type="button"
              key={item}
              onClick={() => {
                setTab(item);
                onResetPage();
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap motion-safe:transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary'
                  : 'bg-card border border-border text-secondary hover:text-primary hover:bg-surface-hover'
              }`}
              aria-pressed={isActive}
            >
              <span>{item}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-primary-subtle text-on-primary' : 'bg-surface-highlight text-secondary'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Multi-Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-56">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="search"
            placeholder="Search complaint, student, or title..."
            className="mgr-input pl-8 text-xs w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onResetPage();
            }}
          />
        </div>

        <select
          aria-label="Filter by Category"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            onResetPage();
          }}
          className="mgr-select text-xs py-1.5 px-3 min-w-[130px]"
        >
          <option value="all">All Categories</option>
          <option value="Facility">Facility</option>
          <option value="AC">AC / Climate</option>
          <option value="WiFi">WiFi / Internet</option>
          <option value="Noise">Noise / Disturbance</option>
          <option value="Cleanliness">Cleanliness</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
            title="Reset all filters"
          >
            <X size={13} /> Reset
          </button>
        )}

        <button
          type="button"
          onClick={onExportCsv}
          className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
          title="Export Complaints CSV"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>
    </div>
  );
}

