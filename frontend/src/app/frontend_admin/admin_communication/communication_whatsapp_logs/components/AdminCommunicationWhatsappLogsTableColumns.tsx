'use client';

import {
  ADMIN_COMMUNICATION_WHATSAPP_LOG_STATUS_LABEL,
  ADMIN_COMMUNICATION_WHATSAPP_LOG_TYPE_LABEL,
} from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/config/admin_communication_whatsapp_logs.url_config';
import type { AdminCommunicationWhatsappLog, AdminCommunicationWhatsappLogStatus } from '@/app/frontend_admin/admin_communication/communication_whatsapp_logs/types/AdminCommunicationWhatsappLogsTypes';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { AlertCircle, Clock, Eye, MessageSquare, RotateCcw, Server, Smartphone } from 'lucide-react';

const WHATSAPP_TYPE_ICONS: Record<string, string> = {
  welcome: '👋',
  fee_reminder: '💰',
  receipt: '🧾',
  notice: '📢',
  renewal: '🔁',
};

const TYPE_CONFIG: Record<string, { bg: string; text: string; border: string }> = {
  welcome: { bg: 'bg-success-bg', text: 'text-success-text', border: 'border-success' },
  fee_reminder: { bg: 'bg-warning-bg', text: 'text-warning-text', border: 'border-warning' },
  receipt: { bg: 'bg-purple-bg', text: 'text-purple-text', border: 'border-purple-text' },
  notice: { bg: 'bg-info-bg', text: 'text-info-text', border: 'border-info' },
  renewal: { bg: 'bg-info-bg', text: 'text-primary-text', border: 'border-primary' },
};

const STATUS_CONFIG: Record<
  AdminCommunicationWhatsappLogStatus,
  { bg: string; text: string; border: string; dot: string; icon: string }
> = {
  Delivered: { bg: 'bg-success-bg', text: 'text-success-text', border: 'border-success', dot: 'bg-success shadow-sm', icon: '✓✓' },
  Sent: { bg: 'bg-info-bg', text: 'text-info-text', border: 'border-info', dot: 'bg-info shadow-sm', icon: '✓✓' },
  Pending: { bg: 'bg-warning-bg', text: 'text-warning-text', border: 'border-warning', dot: 'bg-warning motion-safe:animate-pulse', icon: '⏱' },
  Failed: { bg: 'bg-danger-bg', text: 'text-danger-text', border: 'border-danger', dot: 'bg-danger shadow-sm', icon: '✕' },
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
  return (lines[0] || '').replace(/\*/g, '').trim();
}

export function buildAdminCommunicationWhatsappLogColumns(
  t: (key: string, values?: Record<string, string | number | Date>) => string,
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
        return (
          <div className="flex h-full items-center">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary shrink-0">
                <Clock size={13} />
              </div>
              <div className="leading-tight">
                <span className="font-semibold text-xs text-text-primary block">{parts[0] || ''}</span>
                <span className="font-mono text-[11px] text-text-secondary block">{parts.slice(1).join(' ')}</span>
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
              <div className="h-8 w-8 rounded-full bg-success-bg border border-success flex items-center justify-center text-success-text font-bold text-xs shrink-0 shadow-inner">
                {initials}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-text-primary truncate block">{p.data.student}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[11px] text-success-text font-medium">{p.data.phone}</span>
                  {p.data.branch && (
                    <span className="text-[10px] bg-surface border border-border px-1.5 py-0.5 rounded text-text-secondary truncate max-w-[90px]">
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
        const conf = TYPE_CONFIG[typeKey] || { bg: 'bg-surface', text: 'text-text-secondary', border: 'border-border' };
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
              <span className="inline-flex items-center gap-1 rounded-full border border-info bg-info-bg px-2 py-0.5 text-[11px] font-semibold text-info-text">
                <Server size={11} className="text-info-text" />
                Server API (1x Auto)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-success bg-success-bg px-2 py-0.5 text-[11px] font-semibold text-success-text">
                <Smartphone size={11} className="text-success-text" />
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
              <MessageSquare size={13} className="text-text-secondary shrink-0" />
              <span className="text-xs text-text-secondary truncate font-sans" title={String(p.value ?? '')}>
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
              <span className="inline-flex items-center gap-1 rounded-md bg-danger-bg border border-danger px-2 py-0.5 text-[11px] font-semibold text-danger-text truncate max-w-[140px]" title={err}>
                <AlertCircle size={11} className="shrink-0 text-danger-text" />
                <span className="truncate">{err}</span>
              </span>
            </div>
          );
        }
        return <div className="flex h-full items-center"><span className="text-text-secondary text-xs font-mono">—</span></div>;
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
            onClick={(e) => { e.stopPropagation(); onView(params.data); }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-success bg-success-bg text-success-text hover:opacity-90 motion-safe:transition-all cursor-pointer shadow-xs"
            title={t('WHATSAPP_VIEW_ACTION')}
            aria-label={t('WHATSAPP_VIEW_MESSAGE_FOR', { phone: params.data.phone })}
          >
            <Eye size={15} strokeWidth={2.2} />
          </button>
          {params.data.status === 'Failed' && (
            <button
              data-testid={`admin_communication-whatsapp-retry-${params.data.id}`}
              type="button"
              onClick={(e) => { e.stopPropagation(); onRetry(params.data.id); }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-warning bg-warning-bg text-warning-text hover:opacity-90 motion-safe:transition-all cursor-pointer shadow-xs"
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
