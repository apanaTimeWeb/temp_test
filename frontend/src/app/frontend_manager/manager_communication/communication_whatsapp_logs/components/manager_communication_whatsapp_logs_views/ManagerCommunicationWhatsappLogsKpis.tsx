'use client';

import { CheckCheck, Clock, AlertCircle, Send, ShieldCheck } from 'lucide-react';

interface ManagerCommunicationWhatsappLogsKpisProps {
  totalCount: number;
  deliveredCount: number;
  sentCount: number;
  failedCount: number;
  tManagerUi: (k: string) => string;
}

export function ManagerCommunicationWhatsappLogsKpis({
  totalCount,
  deliveredCount,
  sentCount,
  failedCount,
  tManagerUi,
}: ManagerCommunicationWhatsappLogsKpisProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="mgr-card p-4 flex items-center justify-between border border-border bg-card">
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">{tManagerUi('total_messages')}</p>
          <p className="text-2xl font-black text-primary mt-1">{totalCount}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center border border-border">
          <Send size={18} />
        </div>
      </div>
      <div className="mgr-card p-4 flex items-center justify-between border border-emerald-500/20 bg-emerald-500/5">
        <div>
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">{tManagerUi('delivered')}</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{deliveredCount}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
          <CheckCheck size={18} />
        </div>
      </div>
      <div className="mgr-card p-4 flex items-center justify-between border border-sky-500/20 bg-sky-500/5">
        <div>
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider">{tManagerUi('sent')}</p>
          <p className="text-2xl font-black text-sky-300 mt-1">{sentCount}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
          <Clock size={18} />
        </div>
      </div>
      <div className="mgr-card p-4 flex items-center justify-between border border-rose-500/20 bg-rose-500/5">
        <div>
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">{tManagerUi('failed')}</p>
          <p className="text-2xl font-black text-rose-400 mt-1">{failedCount}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
          <AlertCircle size={18} />
        </div>
      </div>
    </div>
  );
}
