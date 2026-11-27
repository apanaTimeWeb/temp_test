'use client';

import { BellRing, MessageSquare } from 'lucide-react';

interface ManagerFinancePaymentPromisesDueBannerProps {
  dueCount: number;
  formattedTotal: string;
  onBulkWhatsApp: () => void;
  onFilterToday: () => void;
}

export default function ManagerFinancePaymentPromisesDueBanner({
  dueCount,
  formattedTotal,
  onBulkWhatsApp,
  onFilterToday,
}: ManagerFinancePaymentPromisesDueBannerProps) {
  if (dueCount <= 0) return null;

  return (
    <div
      className="p-4 rounded-xl border-2 border-rose-500/40 bg-rose-500/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 motion-safe:animate-pulse"
      data-testid="manager-finance-due-date-alert-banner"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <BellRing size={20} className="motion-safe:animate-bounce" />
        </div>
        <div>
          <h3 className="text-sm font-black text-rose-700 dark:text-rose-400 flex items-center gap-2">
            <span>Critical Due Date Alert</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-rose-600 text-white font-bold">
              {dueCount} Promises Due Today / Overdue
            </span>
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Total <strong className="text-rose-600 dark:text-rose-400 font-bold">{formattedTotal}</strong> committed by students for payment on or before today. Collect now to prevent unauthorized study access.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <button
          type="button"
          onClick={onBulkWhatsApp}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs motion-safe:transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Send WhatsApp payment reminder to all students due today"
        >
          <MessageSquare size={13} />
          <span>Bulk WhatsApp ({dueCount})</span>
        </button>
        <button
          type="button"
          data-testid="manager-finance-filter-due-today-btn"
          onClick={onFilterToday}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs motion-safe:transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Filter Due Today ({dueCount})</span>
        </button>
      </div>
    </div>
  );
}
