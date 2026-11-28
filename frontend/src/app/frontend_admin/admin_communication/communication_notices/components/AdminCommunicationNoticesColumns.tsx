'use client';

import type { Notice } from '@/app/frontend_admin/admin_communication/communication_notices/types/AdminCommunicationNoticesComponentTypes';
import type { DataGridCellParams, DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import { Building2, Edit2, Send, Trash2 } from 'lucide-react';

interface BuildNoticeColumnsParams {
  t: (key: string, values?: Record<string, string | number | Date>) => string;
  isDemoMode: boolean;
  onEdit: (notice: Notice) => void;
  onBroadcast: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
}

export function buildAdminCommunicationNoticeColumns({
  t,
  isDemoMode,
  onEdit,
  onBroadcast,
  onDelete,
}: BuildNoticeColumnsParams): readonly DataGridColumn<Notice>[] {
  return [
    {
      field: 'title',
      headerName: t('NOTICE_COLUMN_TITLE'),
      width: 250,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<Notice>) => {
        const isEmerg = p.data.priority === 'EMERGENCY' || p.data.isEmergency;
        return (
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            <span className={`font-semibold ${isEmerg ? 'text-danger-text font-bold' : 'text-primary-text'}`}>{p.data.title}</span>
            {isEmerg && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold bg-danger-bg text-danger-text border border-danger motion-safe:animate-pulse">
                🚨 EMERGENCY
              </span>
            )}
          </div>
        );
      },
    },
    {
      field: 'targetBranch',
      headerName: 'Target Branch',
      width: 160,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<Notice>) => (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-text-primary mt-2 whitespace-nowrap">
          <Building2 size={12} className="text-primary-text shrink-0" />
          <span>{p.data.targetBranch ?? 'All Branches'}</span>
        </span>
      ),
    },
    {
      field: 'channels',
      headerName: 'Channels',
      width: 130,
      sortable: false,
      cellRenderer: (p: DataGridCellParams<Notice>) => {
        const channels = p.data.channels ?? ['whatsapp', 'email'];
        return (
          <div className="flex items-center gap-1 mt-2">
            {channels.includes('whatsapp') && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-success-bg text-success-text border border-success" title="WhatsApp Broadcast">
                WA
              </span>
            )}
            {channels.includes('email') && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-info-bg text-info-text border border-info" title="Email Dispatch">
                Email
              </span>
            )}
            {channels.includes('sms') && (
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-warning-bg text-warning-text border border-warning" title="SMS Alert">
                SMS
              </span>
            )}
            {channels.length === 0 && (
              <span className="text-[10px] text-text-secondary">Portal</span>
            )}
          </div>
        );
      },
    },
    {
      field: 'message',
      headerName: t('NOTICE_COLUMN_MESSAGE'),
      flex: 1,
      minWidth: 230,
      cellRenderer: (p: DataGridCellParams<Notice>) => (
        <span className="text-text-secondary text-sm truncate block w-full pt-1" title={p.data.message}>
          {p.data.message}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: t('NOTICE_COLUMN_STATUS'),
      width: 120,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<Notice>) => (
        <span
          data-testid="admin_communication-page-state-001"
          className={`inline-flex min-h-6 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${
            p.value === 'Active' ? 'bg-success-bg text-success-text border-success' : 'bg-warning-bg text-warning-text border-warning'
          } mt-2`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${p.value === 'Active' ? 'bg-success motion-safe:animate-pulse' : 'bg-warning'}`} />
          {p.value === 'Active' ? t('NOTICE_STATUS_ACTIVE') : p.value === 'Expired' ? t('NOTICE_STATUS_EXPIRED') : t('NOTICE_STATUS_UNKNOWN')}
        </span>
      ),
    },
    {
      field: 'validTill',
      headerName: t('NOTICE_COLUMN_VALID_TILL'),
      width: 130,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<Notice>) => <span className="font-mono text-text-secondary text-sm">{p.data.validTill}</span>,
    },
    {
      field: 'postedBy',
      headerName: t('NOTICE_COLUMN_POSTED_BY'),
      width: 130,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<Notice>) => <span className="text-text-secondary text-sm">{p.data.postedBy}</span>,
    },
    {
      field: 'postedDate',
      headerName: t('NOTICE_COLUMN_POSTED_DATE'),
      width: 130,
      sortable: true,
      cellRenderer: (p: DataGridCellParams<Notice>) => <span className="font-mono text-text-secondary text-sm">{p.data.postedDate}</span>,
    },
    {
      headerName: t('NOTICE_COLUMN_ACTIONS'),
      width: 150,
      sortable: false,
      cellRenderer: (params: DataGridCellParams<Notice>) => (
        <div className="h-full flex items-center gap-1.5">
          <button
            data-testid={`admin_communication-notice-edit-${params.data.id}`}
            type="button"
            disabled={!isDemoMode}
            title={!isDemoMode ? t('NOTICE_PERSISTENCE_BLOCKED') : t('NOTICE_ROW_EDIT_ARIA', { title: params.data.title })}
            onClick={(e) => { e.stopPropagation(); onEdit(params.data); }}
            aria-label={t('NOTICE_ROW_EDIT_ARIA', { title: params.data.title })}
            className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg border border-info bg-info-bg text-info-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:scale-105 motion-safe:transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Edit2 size={16} strokeWidth={2} />
          </button>
          <button
            data-testid={`admin_communication-notice-broadcast-${params.data.id}`}
            type="button"
            onClick={(e) => { e.stopPropagation(); onBroadcast(params.data); }}
            aria-label={t('NOTICE_ROW_BROADCAST_ARIA', { title: params.data.title })}
            className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg border border-primary bg-info-bg text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:scale-105 motion-safe:transition-all disabled:cursor-not-allowed disabled:opacity-50"
            title={t('NOTICE_ROW_BROADCAST_ARIA', { title: params.data.title })}
          >
            <Send size={16} strokeWidth={2} />
          </button>
          <button
            data-testid={`admin_communication-notice-delete-${params.data.id}`}
            type="button"
            disabled={!isDemoMode}
            title={!isDemoMode ? t('NOTICE_DELETE_BLOCKED_TOAST') : t('NOTICE_ROW_DELETE_ARIA', { title: params.data.title })}
            onClick={(e) => { e.stopPropagation(); onDelete(params.data); }}
            aria-label={t('NOTICE_ROW_DELETE_ARIA', { title: params.data.title })}
            className="inline-flex min-h-[34px] min-w-[34px] items-center justify-center rounded-lg border border-danger bg-danger-bg text-danger-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:hover:scale-105 motion-safe:transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
        </div>
      ),
    },
  ];
}
