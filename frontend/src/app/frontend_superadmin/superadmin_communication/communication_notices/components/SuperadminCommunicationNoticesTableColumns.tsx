'use client';

import { useMemo } from 'react';
import { Clock, Edit2, Send, Trash2 } from 'lucide-react';
import type { SuperadminCommunicationNotice as Notice } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/types/SuperadminCommunicationNoticesTypes';
import type { SemanticCellParams } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/components/SuperadminCommunicationNoticesSemanticTable';

type ICellRendererParams = SemanticCellParams<Notice>;

export function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'noticeId', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

interface UseNoticesColumnsProps {
  openEdit: (n: Notice) => void;
  setBroadcastItem: (n: Notice) => void;
  setDeleteItem: (n: Notice) => void;
  tCopy: (key: string) => string;
}

export function useSuperadminCommunicationNoticesColumns({
  openEdit,
  setBroadcastItem,
  setDeleteItem,
  tCopy,
}: UseNoticesColumnsProps) {
  return useMemo(() => [
    {
      field: 'title',
      headerName: tCopy('COPY.TITLE'),
      width: 220,
      cellRenderer: (p: ICellRendererParams) => (
        <span className="text-white font-bold text-sm tracking-tight">{String(p.value || tCopy('COPY.UNKNOWN'))}</span>
      ),
    },
    {
      field: 'message',
      headerName: tCopy('COPY.MESSAGE'),
      flex: 1,
      minWidth: 260,
      cellRenderer: (p: ICellRendererParams) => (
        <span className="text-slate-300 text-xs truncate block w-full pt-1" title={String(p.value ?? '')}>
          {String(p.value || tCopy('COPY.UNKNOWN'))}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: tCopy('COPY.STATUS'),
      width: 140,
      cellRenderer: (p: ICellRendererParams) => (
        <span className={`inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-3 py-1 rounded-full ${p.value === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700/60'}`}>
          {p.value === 'Active' ? `✅ ${tCopy('COPY.ACTIVE_STATUS')}` : tCopy('COPY.EXPIRED_STATUS')}
        </span>
      ),
    },
    {
      field: 'validTill',
      headerName: tCopy('COPY.VALID_TILL'),
      width: 150,
      cellRenderer: (p: ICellRendererParams) => (
        <span className="font-mono text-xs text-slate-300 flex items-center gap-1.5 pt-1">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          {String(p.value || tCopy('COPY.UNKNOWN'))}
        </span>
      ),
    },
    {
      field: 'postedBy',
      headerName: tCopy('COPY.POSTED_BY'),
      width: 140,
      cellRenderer: (p: ICellRendererParams) => <span className="text-slate-300 text-xs">{String(p.value || tCopy('COPY.UNKNOWN'))}</span>,
    },
    {
      headerName: tCopy('COPY.ACTIONS'),
      width: 140,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="h-full flex items-center gap-2 py-1">
          <button
            type="button"
            onClick={() => openEdit(params.data)}
            className="p-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/25 motion-safe:transition-all cursor-pointer"
            title={tCopy('COPY.EDIT')}
            data-testid={`superadmin-communication-communication-notices-edit-1-${getSuperadminInteractiveTestIdSuffix(params.data)}`}
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => setBroadcastItem(params.data)}
            className="p-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/25 motion-safe:transition-all cursor-pointer"
            title={tCopy('COPY.BROADCAST')}
            data-testid={`superadmin-communication-communication-notices-broadcast-2-${getSuperadminInteractiveTestIdSuffix(params.data)}`}
          >
            <Send size={13} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteItem(params.data)}
            className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/25 motion-safe:transition-all cursor-pointer"
            title={tCopy('COPY.DELETE')}
            data-testid={`superadmin-communication-communication-notices-delete-3-${getSuperadminInteractiveTestIdSuffix(params.data)}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ], [openEdit, setBroadcastItem, setDeleteItem, tCopy]);
}
