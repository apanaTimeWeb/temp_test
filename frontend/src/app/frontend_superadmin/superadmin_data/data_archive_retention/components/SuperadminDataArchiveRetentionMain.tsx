// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/components/SuperadminDataArchiveRetentionMain.tsx
'use client';

/**
 * @file SuperadminDataArchiveRetentionMain.tsx
 * @description Main orchestrator for Data Archive Catalog (Feature 7) and Retention Policies (Feature 8).
 */

import React from 'react';
import { useSuperadminDataArchiveRetention } from '../hooks/useSuperadminDataArchiveRetention';
import { SuperadminDataArchiveRetentionSkeleton } from './SuperadminDataArchiveRetentionSkeleton';
import { SuperadminDataArchiveRetentionRulesTable } from './SuperadminDataArchiveRetentionRulesTable';
import { SuperadminDataArchiveRetentionArchiveCatalog } from './SuperadminDataArchiveRetentionArchiveCatalog';
import { SuperadminDataArchiveRetentionRuleModal } from './SuperadminDataArchiveRetentionRuleModal';
import { SuperadminDataArchiveRetentionEmptyState } from './SuperadminDataArchiveRetentionEmptyState';
import { AlertCircle, RotateCcw } from 'lucide-react';

export function SuperadminDataArchiveRetentionMain() {
  const {
    rules,
    isRulesPending,
    rulesError,
    records,
    isRecordsPending,
    recordsError,
    updateRule,
    isUpdatingRule,
    unarchiveRecord,
    isUnarchiving,
    toggleLegalHold,
    isTogglingLegalHold,
    selectedRule,
    isRuleModalOpen,
    openRuleModal,
    closeRuleModal,
    filterEntityType,
    filterTier,
    setFilterEntityType,
    setFilterTier,
    resetFilters,
  } = useSuperadminDataArchiveRetention();

  if (isRulesPending || isRecordsPending) {
    return <SuperadminDataArchiveRetentionSkeleton />;
  }

  if (rulesError || recordsError) {
    const errorMsg = rulesError?.message || recordsError?.message;
    return (
      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="text-xs font-medium">
            Failed to load retention rules or archive records: {errorMsg}
          </span>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 dark:text-rose-200 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/60 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Retention Rules & Auto-Purge Scheduler (Feature 8) */}
      <SuperadminDataArchiveRetentionRulesTable
        rules={rules}
        onEditRule={openRuleModal}
      />

      {/* 2. Cold Storage Data Archive Catalog (Feature 7) */}
      {records.length === 0 ? (
        <SuperadminDataArchiveRetentionEmptyState onResetFilters={resetFilters} />
      ) : (
        <SuperadminDataArchiveRetentionArchiveCatalog
          records={records}
          filterEntityType={filterEntityType}
          onFilterEntityTypeChange={setFilterEntityType}
          filterTier={filterTier}
          onFilterTierChange={setFilterTier}
          onUnarchive={unarchiveRecord}
          isUnarchiving={isUnarchiving}
          onToggleLegalHold={(id) => toggleLegalHold({ id, reason: 'Audited statutory hold review' })}
          isTogglingHold={isTogglingLegalHold}
        />
      )}

      {/* 3. Rule Configuration Modal */}
      <SuperadminDataArchiveRetentionRuleModal
        isOpen={isRuleModalOpen}
        rule={selectedRule}
        onClose={closeRuleModal}
        onSave={(data) => updateRule(data)}
        isSaving={isUpdatingRule}
      />
    </div>
  );
}
