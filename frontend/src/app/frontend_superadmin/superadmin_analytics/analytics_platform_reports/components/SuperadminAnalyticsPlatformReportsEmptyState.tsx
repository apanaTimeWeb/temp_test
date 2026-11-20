'use client';
// RESPONSIBILITY: Display empty state presentation when no platform reports records are found.

import React from 'react';
import { Building2, RotateCcw } from 'lucide-react';

interface Props {
  onReset?: () => void;
  message?: string;
}

export function SuperadminAnalyticsPlatformReportsEmptyState({ onReset, message }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border bg-card/50"
      role="status"
      aria-label="No platform reports records found"
    >
      <div className="w-14 h-14 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
        <Building2 size={26} aria-hidden="true" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-foreground">
        No Matching Platform Records
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md">
        {message ?? 'Try adjusting your search criteria, date range, or active filters to view library analytics.'}
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
}
