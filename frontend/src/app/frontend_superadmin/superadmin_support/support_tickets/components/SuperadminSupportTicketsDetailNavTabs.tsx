'use client';

import React from 'react';
import { Lock, MessageSquare, Paperclip, Timer } from 'lucide-react';

interface SuperadminSupportTicketsDetailNavTabsProps {
  activeTab: 'conversation' | 'internal_notes' | 'attachments' | 'sla_escalation';
  setActiveTab: (tab: 'conversation' | 'internal_notes' | 'attachments' | 'sla_escalation') => void;
  messagesCount: number;
  internalNotesCount: number;
  attachmentsCount: number;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export default function SuperadminSupportTicketsDetailNavTabs({
  activeTab,
  setActiveTab,
  messagesCount,
  internalNotesCount,
  attachmentsCount,
  t,
}: SuperadminSupportTicketsDetailNavTabsProps) {
  return (
    <div className="px-3.5 sm:px-4 pt-2 pb-1 border-b border-indigo-500/15 bg-[#080c21] flex items-center gap-1.5 overflow-x-auto shrink-0">
      <button
        type="button"
        onClick={() => setActiveTab('conversation')}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.97] ${
          activeTab === 'conversation' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <MessageSquare size={12} />
        <span>{t('COPY.CONVERSATION_HISTORY')} ({messagesCount})</span>
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('internal_notes')}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.97] ${
          activeTab === 'internal_notes' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <Lock size={12} />
        <span>{t('COPY.INTERNAL_NOTES')} ({internalNotesCount})</span>
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('attachments')}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.97] ${
          activeTab === 'attachments' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <Paperclip size={12} />
        <span>{t('COPY.ATTACHMENTS')} ({attachmentsCount})</span>
      </button>
      <button
        type="button"
        onClick={() => setActiveTab('sla_escalation')}
        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-[0.97] ${
          activeTab === 'sla_escalation' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        <Timer size={12} />
        <span>{t('COPY.SLA_TRACKING')} & Escalation</span>
      </button>
    </div>
  );
}
