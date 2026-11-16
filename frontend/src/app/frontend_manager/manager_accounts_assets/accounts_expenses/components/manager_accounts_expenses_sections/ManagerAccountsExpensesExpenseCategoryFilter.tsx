'use client';

import React from 'react';
import { TrendingUp, Layers, Tag } from 'lucide-react';
import type { ManagerAccountsExpensesExpenseCategoryFilterProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/types/ManagerAccountsExpensesComponentTypes';

const CATEGORY_COLORS: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  all: {
    bg: '#6366f1',
    border: '#818cf8',
    glow: '0 0 16px rgba(99, 102, 241, 0.45)',
    text: '#ffffff',
  },
  Utilities: {
    bg: '#f59e0b',
    border: '#fbbf24',
    glow: '0 0 16px rgba(245, 158, 11, 0.45)',
    text: '#000000',
  },
  Maintenance: {
    bg: '#10b981',
    border: '#34d399',
    glow: '0 0 16px rgba(16, 185, 129, 0.45)',
    text: '#ffffff',
  },
  Internet: {
    bg: '#0ea5e9',
    border: '#38bdf8',
    glow: '0 0 16px rgba(14, 165, 233, 0.45)',
    text: '#ffffff',
  },
  Salary: {
    bg: '#a855f7',
    border: '#c084fc',
    glow: '0 0 16px rgba(168, 85, 247, 0.45)',
    text: '#ffffff',
  },
  Electricity: {
    bg: '#eab308',
    border: '#fde047',
    glow: '0 0 16px rgba(234, 179, 8, 0.45)',
    text: '#000000',
  },
};

export default function ManagerAccountsExpensesExpenseCategoryFilter({
  categories,
  value,
  onChange,
  onViewCategories,
  labels,
}: ManagerAccountsExpensesExpenseCategoryFilterProps) {
  const topCategories = ['all', ...categories.slice(0, 5)];

  return (
    <div className="flex flex-col gap-3 p-3.5 sm:p-4 bg-card border border-border rounded-2xl shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills with Glowing Active Halos */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-secondary flex items-center gap-1.5 shrink-0 mr-1">
            <Tag size={13} className="text-primary" />
            <span>{labels.filterByCategory}:</span>
          </span>

          {topCategories.map((cat) => {
            const isAll = cat === 'all';
            const isActive = value === cat;
            const styleConfig = CATEGORY_COLORS[cat] || {
              bg: '#3b82f6',
              border: '#60a5fa',
              glow: '0 0 16px rgba(59, 130, 246, 0.45)',
              text: '#ffffff',
            };

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange(cat)}
                style={
                  isActive
                    ? {
                        backgroundColor: styleConfig.bg,
                        borderColor: styleConfig.border,
                        boxShadow: styleConfig.glow,
                        color: styleConfig.text,
                      }
                    : undefined
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border shadow-sm font-bold'
                    : 'bg-surface-highlight/70 text-secondary hover:text-primary hover:bg-surface-hover border border-border/80'
                }`}
              >
                <span>{isAll ? labels.allCategories : cat}</span>
              </button>
            );
          })}
        </div>

        {/* View Categories Button */}
        <button
          type="button"
          onClick={onViewCategories}
          className="self-end sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <TrendingUp size={13} />
          <span>{labels.viewCategories}</span>
        </button>
      </div>

      {/* Dropdown for All Categories (Secondary / Advanced Access) */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/60">
        <label htmlFor="expense-category-dropdown-select" className="text-xs text-secondary whitespace-nowrap">
          More Categories:
        </label>
        <select
          id="expense-category-dropdown-select"
          className="px-3 py-1 bg-card border border-border rounded-lg text-xs text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer w-full sm:w-auto"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="all">{labels.allCategories}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
