'use client';

import React, { useMemo } from 'react';
import type { SemanticColumnDef, SemanticCellParams } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsOverviewSemanticTable';
import type { Log } from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/types/SuperadminAuditLogsOverviewPageClientComponentTypes';
import SuperadminAuditLogsOverviewActionBadge from '@/app/frontend_superadmin/superadmin_system/system_audit_logs/components/SuperadminAuditLogsOverviewActionBadge';
import { Eye } from 'lucide-react';

interface UseAuditLogsColumnsParams {
  t: (key: string, values?: Record<string, string | number>) => string;
  onSelectLog: (log: Log) => void;
}

export function useAuditLogsColumns({ t, onSelectLog }: UseAuditLogsColumnsParams) {
  return useMemo<SemanticColumnDef<Log>[]>(
    () => [
      {
        headerName: t('COPY.TABLE_COLUMN_TIMESTAMP'),
        field: 'time',
        flex: 1.2,
        minWidth: 150,
        cellClass: () => 'font-mono text-xs text-indigo-300/90',
      },
      {
        headerName: t('COPY.TABLE_COLUMN_PERFORMED_BY'),
        field: 'user',
        flex: 1,
        minWidth: 130,
        cellClass: () => 'font-semibold text-slate-100 text-xs',
      },
      {
        headerName: t('COPY.TABLE_COLUMN_TARGET_ENTITY'),
        field: 'target',
        flex: 1.5,
        minWidth: 160,
        cellRenderer: (p: SemanticCellParams<Log>) => (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              {p.data?.entity}
            </span>
            <span className="text-xs text-slate-200 font-medium">{p.data?.target}</span>
          </div>
        ),
      },
      {
        headerName: t('COPY.TABLE_COLUMN_ACTION'),
        field: 'action',
        flex: 1,
        minWidth: 130,
        cellRenderer: (p: SemanticCellParams<Log>) => (
          <SuperadminAuditLogsOverviewActionBadge action={p.data?.action ?? ''} />
        ),
      },
      {
        headerName: t('COPY.TABLE_COLUMN_IP_ADDRESS'),
        field: 'ip',
        flex: 0.9,
        minWidth: 120,
        cellClass: () => 'font-mono text-xs text-indigo-300/80',
      },
      {
        headerName: 'Details',
        field: 'id',
        flex: 0.8,
        minWidth: 90,
        sortable: false,
        cellRenderer: (p: SemanticCellParams<Log>) => (
          <button
            type="button"
            onClick={() => p.data && onSelectLog(p.data)}
            className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/25 cursor-pointer motion-safe:transition-all"
            title="View audit event details"
          >
            <Eye size={12} className="text-indigo-400" />
            <span>View</span>
          </button>
        ),
      },
    ],
    [t, onSelectLog]
  );
}
