'use client';

import { Clock, Eye, Server, MessageCircle, AlertCircle, CheckCheck, Send, Coins, Megaphone, Receipt, RotateCcw } from 'lucide-react';
import type { NativeCellParams } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/components/manager_communication_whatsapp_logs_table_parts/ManagerCommunicationWhatsappLogsNativeTable';
import type { WaLog } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/hooks/ManagerCommunicationWhatsappLogsDemoRepository';
import { maskManagerWhatsappLogsPhone } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/utils/ManagerCommunicationWhatsappLogsUtilities';

export interface BuildLogColumnsParams {
  tManagerUi: (k: string) => string;
  onViewLog: (log: WaLog) => void;
}

export function buildLogColumns({ tManagerUi, onViewLog }: BuildLogColumnsParams) {
  return [
    {
      field: 'dateTime',
      headerName: tManagerUi('date_time'),
      width: 160,
      cellRenderer: (p: NativeCellParams) => (
        <div className="flex items-center gap-1.5 text-xs text-secondary font-mono">
          <Clock size={12} className="text-secondary opacity-70" />
          <span>{String(p.value ?? '—')}</span>
        </div>
      ),
    },
    {
      field: 'student',
      headerName: tManagerUi('student'),
      flex: 1.2,
      minWidth: 150,
      cellRenderer: (p: NativeCellParams) => {
        const name = String(p.value ?? '—');
        return <span className="text-xs font-bold text-primary truncate">{name}</span>;
      },
    },
    {
      field: 'phone',
      headerName: tManagerUi('phone'),
      width: 130,
      cellRenderer: (p: NativeCellParams) => (
        <span className="text-xs font-mono text-secondary">
          {maskManagerWhatsappLogsPhone(String(p.value ?? ''))}
        </span>
      ),
    },
    {
      field: 'channelType',
      headerName: 'Dispatch Mode',
      width: 160,
      cellRenderer: (p: NativeCellParams) => {
        const row = p.data as WaLog;
        const isApi = row.channelType?.includes('API') || row.type === 'receipt' || row.type === 'welcome';
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              isApi
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
            }`}
          >
            {isApi ? <Server size={10} /> : <MessageCircle size={10} />}
            <span>{isApi ? 'Server API (1x Auto)' : 'WhatsApp Web (Free)'}</span>
          </span>
        );
      },
    },
    {
      field: 'type',
      headerName: tManagerUi('type'),
      width: 120,
      cellRenderer: (p: NativeCellParams) => {
        const val = String(p.value ?? '');
        return <span className="text-xs font-semibold capitalize text-primary">{val.replace('_', ' ')}</span>;
      },
    },
    {
      field: 'status',
      headerName: tManagerUi('status'),
      width: 120,
      cellRenderer: (p: NativeCellParams) => {
        const val = String(p.value ?? '');
        const isDelivered = val === 'Delivered';
        const isSent = val === 'Sent';
        const isFailed = val === 'Failed';
        return (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
              isDelivered
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                : isSent
                ? 'bg-sky-500/10 text-sky-400 border-sky-500/25'
                : isFailed
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
            }`}
          >
            {isDelivered ? <CheckCheck size={11} /> : isSent ? <Send size={10} /> : <AlertCircle size={11} />}
            <span>{val}</span>
          </span>
        );
      },
    },
    {
      headerName: tManagerUi('actions'),
      width: 90,
      sortable: false,
      cellRenderer: (p: NativeCellParams) => (
        <button
          type="button"
          onClick={() => onViewLog(p.data as WaLog)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 motion-safe:transition-colors cursor-pointer"
          title="View Delivery Details"
        >
          <Eye size={12} className="text-indigo-400" />
          <span>View</span>
        </button>
      ),
    },
  ];
}
