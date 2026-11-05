'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ManagerAccountsExpensesCategoryReviewProps {
  isOpen: boolean;
  categories: readonly string[];
  onClose: () => void;
}

export function ManagerAccountsExpensesCategoryReview({
  isOpen,
  categories,
  onClose,
}: ManagerAccountsExpensesCategoryReviewProps) {
  const tManagerUi = useTranslations('manager.manager_expenses.ui');

  if (!isOpen) return null;

  return (
    <section
      aria-labelledby="manager-expenses-category-review-title"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm motion-safe:animate-scale-up"
      role="region"
    >
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-base font-bold text-primary" id="manager-expenses-category-review-title">
          {tManagerUi('expense_categories')}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-secondary hover:text-primary"
        >
          <X size={16} />
        </button>
      </div>
      <p className="mt-2 text-xs text-secondary">
        {tManagerUi('review_sample_budget_allocation_per_expense_category')}
      </p>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {categories.map((category) => (
          <div
            key={category}
            className="px-3 py-2 rounded-xl border border-border bg-muted text-xs font-semibold text-primary flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>{category}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-surface-hover text-xs font-semibold text-primary"
          onClick={onClose}
          type="button"
        >
          {tManagerUi('cancel')}
        </button>
      </div>
    </section>
  );
}

