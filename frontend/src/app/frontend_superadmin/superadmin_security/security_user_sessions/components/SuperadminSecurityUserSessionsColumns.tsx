'use client';

import React from 'react';
import { Globe, LogOut, Monitor, Smartphone } from 'lucide-react';
import type { SemanticCellParams, SemanticColumnDef } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/types/SuperadminSecurityUserSessionsSemanticTableTypes';
import type { SuperadminSessionData } from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/types/SuperadminSecurityUserSessionsTypes';

export function getSuperadminSecurityUserSessionsColumns(
  t: (key: string) => string
): SemanticColumnDef<SuperadminSessionData>[] {
  return [
    {
      field: 'user',
      headerName: t('COPY.TABLE_COLUMN_USER'),
      flex: 1.2,
      minWidth: 140,
      cellClass: 'sa-cell-primary-bold font-semibold text-slate-100',
    },
    {
      field: 'device',
      headerName: t('COPY.TABLE_COLUMN_DEVICE_BROWSER'),
      flex: 1.4,
      minWidth: 150,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => {
        const isDesktop = (params.value ?? '').includes('Mac') || (params.value ?? '').includes('Windows');
        return (
          <span className="inline-flex items-center gap-2 text-slate-300">
            {isDesktop ? (
              <Monitor size={15} className="text-sky-400 shrink-0" aria-hidden="true" />
            ) : (
              <Smartphone size={15} className="text-purple-400 shrink-0" aria-hidden="true" />
            )}
            <span>{params.value ?? ''}</span>
          </span>
        );
      },
    },
    {
      field: 'ip',
      headerName: t('COPY.TABLE_COLUMN_IP_ADDRESS'),
      flex: 1.1,
      minWidth: 130,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => (
        <span className="font-mono text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
          {params.value ?? ''}
        </span>
      ),
    },
    {
      field: 'location',
      headerName: t('COPY.TABLE_COLUMN_LOCATION'),
      flex: 1.1,
      minWidth: 120,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => (
        <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs">
          <Globe size={13} className="text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{params.value ?? ''}</span>
        </span>
      ),
    },
    {
      field: 'lastActive',
      headerName: t('COPY.TABLE_COLUMN_LAST_ACTIVE'),
      flex: 1.1,
      minWidth: 120,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => {
        let label = '';
        switch (params.data.lastActive) {
          case 'JUST_NOW':
            label = t('COPY.SESSION_LAST_ACTIVE_JUST_NOW');
            break;
          case 'TWO_HOURS_AGO':
            label = t('COPY.SESSION_LAST_ACTIVE_TWO_HOURS_AGO');
            break;
          case 'TEN_MINUTES_AGO':
            label = t('COPY.SESSION_LAST_ACTIVE_TEN_MINUTES_AGO');
            break;
          case 'ONE_MONTH_AGO':
            label = t('COPY.SESSION_LAST_ACTIVE_ONE_MONTH_AGO');
            break;
          default:
            label = params.data.lastActive;
        }
        return <span className="text-xs text-slate-400">{label}</span>;
      },
    },
    {
      field: 'status',
      headerName: t('COPY.TABLE_COLUMN_STATUS'),
      flex: 0.9,
      minWidth: 100,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, string>) => {
        const isActive = params.value === 'Active';
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isActive
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            {isActive ? t('COPY.STATUS_ACTIVE') : t('COPY.STATUS_REVOKED')}
          </span>
        );
      },
    },
    {
      headerName: t('COPY.TABLE_COLUMN_ACTION'),
      flex: 1.1,
      minWidth: 130,
      sortable: false,
      cellRenderer: (params: SemanticCellParams<SuperadminSessionData, unknown>) =>
        params.data.status === 'Active' ? (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-300 opacity-60 cursor-not-allowed transition-all"
            disabled
            title={t('COPY.UNAVAILABLE_THE_SESSION_MANAGEMENT_API_CONTRACT_IS_NOT_SUPPLIED')}
            aria-label={t('COPY.UNAVAILABLE_THE_SESSION_MANAGEMENT_API_CONTRACT_IS_NOT_SUPPLIED')}
            data-testid={`superadmin-security-user-sessions-revoke-unavailable-${params.data.id}`}
          >
            <LogOut size={12} className="text-rose-400" aria-hidden="true" />
            <span>{t('COPY.KILL_SESSION')}</span>
          </button>
        ) : (
          <span className="text-slate-500 text-xs font-semibold">{t('COPY.REVOKED')}</span>
        ),
    },
  ];
}
