'use client';

import { MessageCircle,X } from 'lucide-react';

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
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-auto min-w-[280px] sm:min-w-[340px] max-w-[95vw] px-4 py-3 bg-[#0c0f28]/95 border border-indigo-500/30 shadow-2xl rounded-2xl flex items-center justify-between gap-4 transition-all duration-200"
      role="region"
      aria-label="Bulk actions toolbar"
    >
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {selectedCount}
        </span>
        <span className="text-xs font-bold text-white">
          {selectedCount} Selected
        </span>

        <button
          type="button"
          onClick={onSelectAllFiltered}
          className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-medium ml-1 hidden sm:inline cursor-pointer"
        >
          Select All ({totalFilteredCount})
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenBulkWhatsApp}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-950/50 transition-colors cursor-pointer"
        >
          <MessageCircle size={13} />
          <span>Launch WhatsApp Queue ({selectedCount})</span>
        </button>

        <button
          type="button"
          onClick={onClearSelection}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Clear Selection"
          aria-label="Clear selection"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

