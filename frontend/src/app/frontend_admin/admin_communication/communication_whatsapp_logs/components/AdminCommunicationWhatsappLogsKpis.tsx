'use client';

import type { AdminCommunicationWhatsappLog } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import { AlertCircle,CheckCircle,Clock,MessageSquare } from 'lucide-react';

export interface AdminCommunicationWhatsappLogsKpisProps {
  visibleLogs: readonly AdminCommunicationWhatsappLog[];
}

export function AdminCommunicationWhatsappLogsKpis({ visibleLogs }: AdminCommunicationWhatsappLogsKpisProps) {
  const deliveredCount = visibleLogs.filter((l) => l.status === 'Delivered').length;
  const transitCount = visibleLogs.filter((l) => l.status === 'Sent' || l.status === 'Pending').length;
  const failedCount = visibleLogs.filter((l) => l.status === 'Failed').length;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* Total Messages - Indigo */}
      <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 p-5 shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/40">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Dispatches</span>
          <div className="p-2.5 rounded-xl border shrink-0 bg-indigo-500/15 border-indigo-500/30 text-indigo-400">
            <MessageSquare size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight text-white">{visibleLogs.length}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-indigo-300 bg-indigo-500/10 border-indigo-500/25">
            All Outbound Messages
          </span>
        </div>
      </div>

      {/* Delivered - Emerald */}
      <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 p-5 shadow-lg shadow-emerald-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/40">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Delivered</span>
          <div className="p-2.5 rounded-xl border shrink-0 bg-emerald-500/15 border-emerald-500/30 text-emerald-400">
            <CheckCircle size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-400">{deliveredCount}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-emerald-300 bg-emerald-500/10 border-emerald-500/25">
            Successfully Received
          </span>
        </div>
      </div>

      {/* In Transit - Amber */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 p-5 shadow-lg shadow-amber-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-amber-500/40">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Transit / Sent</span>
          <div className="p-2.5 rounded-xl border shrink-0 bg-amber-500/15 border-amber-500/30 text-amber-400">
            <Clock size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight text-amber-400">{transitCount}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-amber-300 bg-amber-500/10 border-amber-500/25">
            Queued / Sent
          </span>
        </div>
      </div>

      {/* Failed / Issues - Rose */}
      <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 p-5 shadow-lg shadow-rose-950/30 transition-all duration-300 hover:scale-[1.01] hover:border-rose-500/40">
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Failed / Issues</span>
          <div className="p-2.5 rounded-xl border shrink-0 bg-rose-500/15 border-rose-500/30 text-rose-400">
            <AlertCircle size={18} strokeWidth={2.2} />
          </div>
        </div>
        <p className="mt-3 text-2xl font-bold tracking-tight text-rose-400">{failedCount}</p>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border text-rose-300 bg-rose-500/10 border-rose-500/25">
            Attention Required
          </span>
        </div>
      </div>
    </div>
  );
}
export default AdminCommunicationWhatsappLogsKpis;
