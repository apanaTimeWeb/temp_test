'use client';

import React from 'react';
import { Headphones, Lock, MessageSquare, Paperclip, Send, ShieldCheck, Zap } from 'lucide-react';
import type { SuperadminSupportTicketMessage } from '../types/SuperadminSupportTicketsOverviewTypes';

interface SuperadminSupportTicketsConversationThreadProps {
  messages: SuperadminSupportTicketMessage[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isInternalNote: boolean;
  setIsInternalNote: (val: boolean) => void;
  replyText: string;
  setReplyText: (val: string) => void;
  operationMessage: string;
  setOperationMessage: (val: string) => void;
  handleSendReply: () => void;
  onOpenAttachments: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export default function SuperadminSupportTicketsConversationThread({
  messages,
  messagesEndRef,
  isInternalNote,
  setIsInternalNote,
  replyText,
  setReplyText,
  operationMessage,
  setOperationMessage,
  handleSendReply,
  onOpenAttachments,
  t,
}: SuperadminSupportTicketsConversationThreadProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col p-3 sm:p-4 gap-2.5 overflow-hidden">
      <div className="flex-1 min-h-[160px] flex flex-col rounded-xl border border-indigo-500/25 bg-[#070b22]/90 p-3 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between pb-2 border-b border-indigo-500/15 shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Helpdesk Message Stream</h3>
          </div>
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-emerald-400" /> End-to-end Audited Support Thread
          </span>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2 pt-2">
          {messages.map((msg) => {
            const isStaff = msg.role === 'support_agent';
            const isSystem = msg.role === 'system';
            if (isSystem) {
              return (
                <div key={msg.id} className="flex items-center justify-center my-1.5">
                  <div className="px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium flex items-center gap-2">
                    <Zap size={11} className="text-amber-400 shrink-0" />
                    <span>{msg.text}</span>
                    <span className="text-slate-500 text-[10px]">• {msg.timestamp}</span>
                  </div>
                </div>
              );
            }
            return (
              <div key={msg.id} className={`flex items-start gap-3 ${isStaff ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm font-bold text-xs ${isStaff ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' : 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'}`}>
                  {isStaff ? <Headphones size={15} /> : msg.sender.charAt(0)}
                </div>
                <div className={`flex-1 min-w-0 flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 mb-0.5 ${isStaff ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-bold text-slate-100">{msg.sender}</span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${isStaff ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' : 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/30'}`}>
                      {isStaff ? 'Support Staff' : 'Library Admin'}
                    </span>
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>
                  <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm max-w-2xl ${isStaff ? 'bg-[#082218]/90 border border-emerald-500/30 rounded-tr-xs text-slate-100' : 'bg-[#0e1538] border border-indigo-500/30 rounded-tl-xs text-slate-200'}`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="shrink-0 rounded-xl border border-indigo-500/25 bg-[#0b0f2a] p-3 shadow-lg space-y-2">
        {operationMessage && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-xs text-amber-200 flex items-center gap-2" role="alert">
            <span>{operationMessage}</span>
          </div>
        )}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-0.5 rounded-xl border border-indigo-500/20">
            <button
              type="button"
              aria-pressed={!isInternalNote}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.97] ${!isInternalNote ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              onClick={() => setIsInternalNote(false)}
              data-testid="superadmin-support-tickets-support-tickets-detail-public-reply-5"
            >
              <Send size={11} />
              <span>{t('COPY.PUBLIC_REPLY')}</span>
            </button>
            <button
              type="button"
              aria-pressed={isInternalNote}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.97] ${isInternalNote ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              onClick={() => setIsInternalNote(true)}
              data-testid="superadmin-support-tickets-support-tickets-detail-internal-note-hidden-6"
            >
              <Lock size={11} />
              <span>{t('COPY.INTERNAL_NOTE_HIDDEN')}</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-400">{isInternalNote ? '🔒 Visible only to platform team' : '✉️ Visible to library admin'}</span>
        </div>
        <div className={`relative rounded-xl border transition-colors ${isInternalNote ? 'border-amber-500/40 bg-amber-950/20 text-amber-200' : 'border-indigo-500/30 bg-[#070b22] text-slate-100'} p-2.5 shadow-inner`}>
          <label htmlFor="superadmin-support-ticket-reply-text" className="sr-only">{isInternalNote ? t('COPY.INTERNAL_NOTE_TEXT') : t('COPY.PUBLIC_REPLY_TEXT')}</label>
          <textarea
            id="superadmin-support-ticket-reply-text"
            maxLength={5000}
            rows={2}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none resize-none min-h-[50px] max-h-[75px]"
            placeholder={isInternalNote ? t('COPY.TYPE_PRIVATE_NOTE_PLACEHOLDER') : t('COPY.TYPE_REPLY_TO_TENANT_PLACEHOLDER')}
            value={replyText}
            onChange={(e) => {
              setReplyText(e.target.value);
              setOperationMessage('');
            }}
            data-testid="superadmin-support-tickets-support-tickets-detail-superadmin-support-ticket-reply-text-7"
          />
          <div className="flex items-center justify-between pt-1.5 border-t border-indigo-500/15 mt-1">
            <button
              type="button"
              onClick={onOpenAttachments}
              aria-label={t('COPY.ATTACH_FILE_UNAVAILABLE')}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 text-xs transition-colors"
              data-testid="superadmin-support-tickets-support-tickets-detail-attach-file-unavailable-8"
            >
              <Paperclip size={13} />
              <span className="text-[11px] hidden sm:inline">Attach diagnostics</span>
            </button>
            <button
              type="button"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.97] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${isInternalNote ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white'}`}
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              data-testid="superadmin-support-tickets-support-tickets-detail-add-note-9"
            >
              <Send size={12} />
              <span>{isInternalNote ? t('COPY.ADD_NOTE') : t('COPY.SEND_REPLY')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
