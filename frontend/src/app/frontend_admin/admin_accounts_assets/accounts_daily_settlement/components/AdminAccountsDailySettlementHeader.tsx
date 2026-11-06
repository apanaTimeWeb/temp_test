'use client';
// Responsibility: AdminAccountsDailySettlementHeader component owned by accounts_daily_settlement.

import { Building2, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AdminAccountsDailySettlementHeaderProps {
  dateMode: 'all' | 'today' | 'yesterday' | 'custom';
  setDateMode: (mode: 'all' | 'today' | 'yesterday' | 'custom') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  demoTodayStr: string;
  demoYesterdayStr: string;
  dateModeLabel: string;
  filteredCount: number;
}

export function AdminAccountsDailySettlementHeader({
  dateMode,
  setDateMode,
  selectedDate,
  setSelectedDate,
  demoTodayStr,
  demoYesterdayStr,
  dateModeLabel,
  filteredCount,
}: AdminAccountsDailySettlementHeaderProps) {
  const t = useTranslations('ADMIN_ACCOUNTS_DAILY_SETTLEMENT');

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-surface to-surface-elevated p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-info-bg px-2.5 py-0.5 text-xs font-semibold text-info-text">
              <Building2 className="h-3.5 w-3.5" />
              Accounts / Daily Settlement
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('TITLE')}</h1>
          <p className="text-sm text-text-secondary">{t('SUBTITLE')}</p>
        </div>

        {/* Specific Date Navigator */}
        <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-surface p-2 shadow-sm backdrop-blur-md">
          <div className="flex items-center rounded-lg bg-surface-muted p-1 border border-border">
            <button
              type="button"
              onClick={() => setDateMode('all')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                dateMode === 'all'
                  ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              All Dates
            </button>
            <button
              type="button"
              onClick={() => {
                setDateMode('today');
                setSelectedDate(demoTodayStr);
              }}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                dateMode === 'today'
                  ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                setDateMode('yesterday');
                setSelectedDate(demoYesterdayStr);
              }}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                dateMode === 'yesterday'
                  ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              Yesterday
            </button>
            <button
              type="button"
              onClick={() => setDateMode('custom')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                dateMode === 'custom'
                  ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <Calendar className="h-3 w-3" />
              Pick Date 📅
            </button>
          </div>
          {dateMode === 'custom' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Pick specific date"
              className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}
          <div className="text-xs font-medium text-text-secondary border-l border-border pl-2.5 ml-0.5">
            {dateModeLabel}
            <span className="ml-1.5 text-text-muted">· {filteredCount} records</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAccountsDailySettlementHeader;

