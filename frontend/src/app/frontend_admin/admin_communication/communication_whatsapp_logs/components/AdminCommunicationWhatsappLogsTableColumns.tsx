'use client';

import {
  ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_LABEL,
  ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL,
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/config/admin_communication_whatsapp_logs.url_config';
import type { AdminCommunicationWhatsappLog,AdminCommunicationWhatsappLogStatus } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import type { DataGridCellParams,DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import {
  AlertCircle,
  Clock,
  Eye,
  MessageSquare,
  RotateCcw,
  Server,
  Smartphone,
} from 'lucide-react';

const WHATSAPP_TYPE_ICONS: Record<string, string> = {
  welcome: '👋',
  fee_reminder: '💰',
  receipt: '🧾',
  notice: '📢',
  renewal: '🔁',
};

const TYPE_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  welcome: { bg: 'bg-teal-500/10', text: 'text-teal-300', border: 'border-teal-500/30' },
  fee_reminder: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30' },
  receipt: { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30' },
  notice: { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/30' },
  renewal: { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/30' },
};

const STATUS_CONFIG: Record<
  AdminCommunicationWhatsappLogStatus,
  { bg: string; text: string; border: string; dot: string; icon: string }
> = {
  Delivered: { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400 shadow-sm shadow-emerald-400/50', icon: '✓✓' },
  Sent: { bg: 'bg-sky-500/10', text: 'text-sky-300', border: 'border-sky-500/30', dot: 'bg-sky-400 shadow-sm shadow-sky-400/50', icon: '✓✓' },
  Pending: { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400 animate-pulse', icon: '⏱' },
  Failed: { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-400 shadow-sm shadow-rose-400/50', icon: '✕' },
};

function getInitials(name: string): string {
  if (!name) return 'W';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getSnippet(message: string): string {
  if (!message) return '';
  const lines = message.split('\n').filter((l) => l.trim().length > 0);
  const headline = lines[0] || '';
  return headline.replace(/\*/g, '').trim();
}

export function buildAdminCommunicationWhatsappLogColumns(
  t: (key: string, values?: any) => string,
  onView: (log: AdminCommunicationWhatsappLog) => void,
  onRetry: (id: string) => void
): readonly DataGridColumn<AdminCommunicationWhatsappLog>[] {
  return [
    {
      field: 'dateTime',
      headerName: t('WHATSAPP_COLUMN_DATETIME'),
      width: 165,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const parts = String(p.value ?? '').split(' ');
        const datePart = parts[0] || '';
        const timePart = parts.slice(1).join(' ');
        return (
          <div className="flex h-full items-center">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 shrink-0">
                <Clock size={13} />
              </div>
              <div className="leading-tight">
                <span className="font-semibold text-xs text-white block">{datePart}</span>
                <span className="font-mono text-[11px] text-slate-400 block">{timePart}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: 'student',
      headerName: t('WHATSAPP_COLUMN_STUDENT'),
      width: 200,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const initials = getInitials(String(p.value ?? ''));
        return (
          <div className="flex h-full items-center">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500/25 to-teal-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0 shadow-inner">
                {initials}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-white truncate block">{p.data.student}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[11px] text-emerald-400/90 font-medium">{p.data.phone}</span>
                  {p.data.branch && (
                    <span className="text-[10px] bg-slate-800 border border-slate-700/60 px-1.5 py-0.2 rounded text-slate-300 truncate max-w-[90px]">
                      {p.data.branch}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      field: 'type',
      headerName: t('WHATSAPP_COLUMN_TYPE'),
      width: 135,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const typeKey = String(p.value ?? 'welcome');
        const icon = WHATSAPP_TYPE_ICONS[typeKey] || '📱';
        const conf = TYPE_CONFIG[typeKey] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };
        return (
          <div className="flex h-full items-center">
            <span
              data-testid={`admin_communication-whatsapp-type-${p.data.id}`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-xs ${conf.bg} ${conf.text} ${conf.border}`}
            >
              <span>{icon}</span>
              <span>{t(ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL[typeKey] ?? 'WHATSAPP_TYPE_UNKNOWN')}</span>
            </span>
          </div>
        );
      },
    },
    {
      field: 'dispatchMode',
      headerName: 'Dispatch Mode',
      width: 160,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const isAutoApi = p.data.dispatchMode === 'auto_api_single';
        return (
          <div className="flex h-full items-center">
            {isAutoApi ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">
                <Server size={11} className="text-indigo-400" />
                Server API (1x Auto)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                <Smartphone size={11} className="text-emerald-400" />
                WhatsApp Web (Free)
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: 'message',
      headerName: 'Message Content',
      flex: 1,
      minWidth: 200,
      sortable: false,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const snippet = getSnippet(String(p.value ?? ''));
        return (
          <div className="flex h-full items-center min-w-0 pr-2">
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare size={13} className="text-slate-500 shrink-0" />
              <span className="text-xs text-slate-300 truncate font-sans" title={String(p.value ?? '')}>
                {snippet || '—'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: t('WHATSAPP_COLUMN_STATUS'),
      width: 140,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const statusKey = p.data.status as AdminCommunicationWhatsappLogStatus;
        const conf = STATUS_CONFIG[statusKey] || STATUS_CONFIG.Delivered;
        return (
          <div className="flex h-full items-center">
            <span
              data-testid={`admin_communication-whatsapp-status-${p.data.id}`}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shadow-xs ${conf.bg} ${conf.text} ${conf.border}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`} />
              <span>{t(ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_LABEL[statusKey] ?? 'WHATSAPP_STATUS_UNKNOWN')}</span>
              <span className="font-mono text-[10px] opacity-75">{conf.icon}</span>
            </span>
          </div>
        );
      },
    },
    {
      field: 'error',
      headerName: t('WHATSAPP_COLUMN_ERROR'),
      width: 150,
      sortable: false,
      cellRenderer: (p: DataGridCellParams<AdminCommunicationWhatsappLog>) => {
        const err = typeof p.value === 'string' ? p.value.trim() : '';
        if (err) {
          return (
            <div className="flex h-full items-center">
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[11px] font-semibold text-rose-300 truncate max-w-[140px]" title={err}>
                <AlertCircle size={11} className="shrink-0 text-rose-400" />
                <span className="truncate">{err}</span>
              </span>
            </div>
          );
        }
        return <div className="flex h-full items-center"><span className="text-slate-500 text-xs font-mono">—</span></div>;
      },
    },
    {
      headerName: t('WHATSAPP_COLUMN_ACTIONS'),
      width: 110,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<AdminCommunicationWhatsappLog>) => (
        <div className="h-full flex items-center justify-center gap-1.5">
          <button
            data-testid={`admin_communication-whatsapp-view-${params.data.id}`}
            type="button"
            onClick={() => onView(params.data)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:text-white transition-all cursor-pointer shadow-xs"
            title={t('WHATSAPP_VIEW_ACTION')}
            aria-label={t('WHATSAPP_VIEW_MESSAGE_FOR', { phone: params.data.phone })}
          >
            <Eye size={15} strokeWidth={2.2} />
          </button>
          {params.data.status === 'Failed' && (
            <button
              data-testid={`admin_communication-whatsapp-retry-${params.data.id}`}
              type="button"
              onClick={() => onRetry(params.data.id)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-white transition-all cursor-pointer shadow-xs"
              title="Retry / Resend failed message"
              aria-label="Retry dispatch"
            >
              <RotateCcw size={14} strokeWidth={2.2} />
            </button>
          )}
        </div>
      ),
    },
  ];
}
export default buildAdminCommunicationWhatsappLogColumns;
