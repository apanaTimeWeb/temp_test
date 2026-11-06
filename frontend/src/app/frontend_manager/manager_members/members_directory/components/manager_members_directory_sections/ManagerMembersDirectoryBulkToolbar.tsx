'use client';

import React from 'react';
import { MessageSquare, X } from 'lucide-react';

interface ManagerMembersDirectoryBulkToolbarProps {
  selectedCount: number;
  totalFilteredCount: number;
  onClearSelection: () => void;
  onSelectAllFiltered: () => void;
  onOpenBulkWhatsApp: () => void;
}

export function ManagerMembersDirectoryBulkToolbar({
  selectedCount,
  totalFilteredCount,
  onClearSelection,
  onSelectAllFiltered,
  onOpenBulkWhatsApp,
}: ManagerMembersDirectoryBulkToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-auto min-w-[340px] max-w-[95vw] px-4 py-3 bg-card border border-border shadow-2xl rounded-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-3"
      role="region"
      aria-label="Bulk actions toolbar"
    >
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center shrink-0">
          {selectedCount}
        </span>
        <span className="text-xs font-bold text-foreground">
          {selectedCount} Selected
        </span>

        <button
          type="button"
          onClick={onSelectAllFiltered}
          className="text-xs text-primary hover:underline font-medium ml-1 hidden sm:inline"
        >
          Select All ({totalFilteredCount})
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenBulkWhatsApp}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
        >
          <MessageSquare size={13} />
          <span>Launch WhatsApp Queue ({selectedCount})</span>
        </button>

        <button
          type="button"
          onClick={onClearSelection}
          className="p-1.5 rounded-lg text-secondary hover:text-foreground hover:bg-surface transition-colors"
          title="Clear Selection"
          aria-label="Clear selection"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

