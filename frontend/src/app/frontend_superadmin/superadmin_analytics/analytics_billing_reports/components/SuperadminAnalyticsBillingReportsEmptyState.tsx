'use client';
// RESPONSIBILITY: Display empty state presentation when no billing reports records are found.

import React from 'react';
import { Receipt, RotateCcw } from 'lucide-react';

interface Props {
  onReset?: () => void;
  message?: string;
}

export function SuperadminAnalyticsBillingReportsEmptyState({ onReset, message }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-indigo-500/30 bg-[#0a0d24]/60 backdrop-blur-md shadow-xl"
      role="status"
      aria-label="No billing records found"
    >
      <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
        <Receipt size={26} aria-hidden="true" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
        No Matching Billing Invoices
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-md">
        {message ?? 'Try adjusting your date range, payment status, or plan filters to view financial transactions.'}
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 motion-safe:transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Reset Filter Controls</span>
        </button>
      )}
    </div>
  );
}
