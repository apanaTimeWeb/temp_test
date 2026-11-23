'use client';

import React, { useMemo } from 'react';
import type { SemanticCellParams as ICellRendererParams, SemanticColumnDef as ColDef } from './SuperadminUsersDirectorySemanticTable';
import type { SuperadminUserData, SuperadminUsersStatus } from '../types/SuperadminUsersDirectoryTypes';
import { maskSensitiveData } from '../utils/SuperadminUsersDirectoryMaskSensitiveData';
import { Ban, Check, KeyRound, Mail, MessageSquare, Pencil, ShieldAlert, ShieldCheck } from 'lucide-react';

function getSuperadminInteractiveTestIdSuffix(value: unknown): string {
  const record = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  for (const field of ['id', 'uuid', 'recordId', 'userId', 'assetId', 'libraryId', 'planId', 'subscriptionId', 'transactionId', 'invoiceId', 'refundId', 'requestId', 'ruleId', 'messageId', 'noticeId', 'complaintId', 'entryId', 'backupId', 'enquiryId', 'studentId', 'memberId', 'branchId', 'scheduleId', 'logId', 'smartId', 'receiptNumber', 'ticketId', 'lockerId', 'seatNo', 'code', 'slug', 'key', 'name']) {
    const candidate = record[field];
    if (typeof candidate === 'string' || typeof candidate === 'number') return String(candidate);
  }
  return 'missing-domain-id';
}

interface UseUsersDirectoryColumnsParams {
  t: (key: string, values?: Record<string, string | number>) => string;
  handleOpenEdit: (user: SuperadminUserData) => void;
  toggleStatus: (id: string, current: SuperadminUsersStatus) => void;
  handleResetPassword: (name: string) => void;
  handleQuickWhatsApp: (user: SuperadminUserData) => void;
}

export function useUsersDirectoryColumns({
  t,
  handleOpenEdit,
  toggleStatus,
  handleResetPassword,
  handleQuickWhatsApp,
}: UseUsersDirectoryColumnsParams) {
  return useMemo<ColDef<SuperadminUserData>[]>(
    () => [
      {
        field: 'name',
        headerName: t('COPY.TABLE_COLUMN_NAME'),
        flex: 1.2,
        minWidth: 180,
        cellClass: 'sa-cell-primary-bold',
        cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => {
          const name = p.value ?? '';
          return (
            <div className="flex items-center gap-2.5 h-full">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm ring-2 ring-indigo-500/20 shrink-0">
                {name.charAt(0)}
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-semibold text-slate-100 truncate">{name}</span>
                <span className="text-xs text-slate-400 font-normal truncate">{p.data?.username ?? ''}</span>
              </div>
            </div>
          );
        },
      },
      {
        field: 'email',
        headerName: t('COPY.TABLE_COLUMN_EMAIL'),
        flex: 1.5,
        minWidth: 200,
        cellClass: 'sa-cell-muted',
        cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => {
          const user = p.data;
          const phone = user?.phone;
          return (
            <div className="flex flex-col justify-center gap-1 leading-tight">
              <span className="text-slate-300 text-xs sm:text-sm font-mono truncate">{maskSensitiveData(String(p.value ?? ''))}</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {phone && <span className="text-[11px] font-mono text-slate-400">{phone}</span>}
                <div className="flex items-center gap-1 ml-auto">
                  {user?.email && (
                    <a
                      href={`mailto:${user.email}?subject=${encodeURIComponent('Smart Library SaaS Access Notice')}&body=${encodeURIComponent(`Dear ${user.name},\n\n`)}`}
                      className="p-1 rounded-md border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors"
                      title={`Email ${user.name}`}
                      aria-label={`Email ${user.name}`}
                    >
                      <Mail size={12} className="text-purple-400" />
                    </a>
                  )}
                  {user && (
                    <button
                      type="button"
                      onClick={() => handleQuickWhatsApp(user)}
                      className="p-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                      title={`WhatsApp chat with ${user.name}`}
                      aria-label={`WhatsApp chat with ${user.name}`}
                    >
                      <MessageSquare size={12} className="text-emerald-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        field: 'role',
        headerName: t('COPY.TABLE_COLUMN_ROLE'),
        flex: 0.9,
        minWidth: 120,
        cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              p.value === 'SuperAdmin'
                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                : p.value === 'Admin'
                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
            }`}
          >
            {p.value === 'SuperAdmin' ? t('COPY.ROLE_SUPERADMIN_SYSTEM') : p.value === 'Admin' ? t('COPY.ROLE_ADMIN_TENANT_OWNER') : t('COPY.ROLE_MANAGER_STAFF')}
          </span>
        ),
      },
      {
        field: 'branch',
        headerName: t('COPY.TABLE_COLUMN_BRANCH_TENANT'),
        flex: 1,
        minWidth: 130,
        cellClass: 'sa-cell-muted',
        cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => (
          <span className="text-slate-300 text-xs sm:text-sm font-medium">{p.value ?? ''}</span>
        ),
      },
      {
        field: 'twoFactor',
        headerName: t('COPY.TABLE_COLUMN_2FA'),
        flex: 0.7,
        minWidth: 90,
        cellRenderer: (p: ICellRendererParams<SuperadminUserData, boolean>) => (
          <span className="inline-flex items-center gap-1">
            <span className="sr-only">
              {t('COPY.TWO_FACTOR_AUTHENTICATION')} {p.value ? t('COPY.TWO_FACTOR_ENABLED') : t('COPY.TWO_FACTOR_DISABLED')}
            </span>
            {p.value ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                <ShieldCheck aria-hidden="true" size={16} />
                <span>ON</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-medium">
                <ShieldAlert aria-hidden="true" size={16} />
                <span>OFF</span>
              </span>
            )}
          </span>
        ),
      },
      {
        field: 'status',
        headerName: t('COPY.TABLE_COLUMN_STATUS'),
        flex: 0.8,
        minWidth: 110,
        cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              p.value === 'Active' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${p.value === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            {p.value === 'Active' ? t('COPY.STATUS_ACTIVE') : t('COPY.STATUS_SUSPENDED')}
          </span>
        ),
      },
      {
        field: 'lastLogin',
        headerName: t('COPY.TABLE_COLUMN_LAST_LOGIN'),
        flex: 1,
        minWidth: 120,
        cellClass: 'sa-cell-muted-sm',
        cellRenderer: (p: ICellRendererParams<SuperadminUserData, string>) => (
          <span className="text-slate-400 text-xs">{p.value === 'Never' ? t('COPY.NEVER') : p.value ?? ''}</span>
        ),
      },
      {
        headerName: t('COPY.TABLE_COLUMN_ACTIONS'),
        flex: 1.4,
        minWidth: 200,
        cellRenderer: (p: ICellRendererParams<SuperadminUserData, unknown>) =>
          p.data ? (
            <div className="flex items-center gap-1.5 h-full flex-wrap">
              <button
                type="button"
                onClick={() => handleOpenEdit(p.data!)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold cursor-pointer transition-colors"
                title="Edit User Permissions"
                data-testid={`superadmin-users-users-overview-edit-1-${getSuperadminInteractiveTestIdSuffix(p.data)}`}
              >
                <Pencil size={12} className="text-emerald-400" />
                <span>{t('COPY.EDIT')}</span>
              </button>
              <button
                type="button"
                onClick={() => toggleStatus(p.data.id, p.data.status)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold cursor-pointer transition-colors"
                title={p.data.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                data-testid={`superadmin-users-users-overview-action-suspend-2-${getSuperadminInteractiveTestIdSuffix(p.data)}`}
              >
                {p.data.status === 'Active' ? <Ban size={12} className="text-amber-400" /> : <Check size={12} className="text-emerald-400" />}
                <span>{p.data.status === 'Active' ? t('COPY.ACTION_SUSPEND') : t('COPY.ACTION_ACTIVATE')}</span>
              </button>
              <button
                type="button"
                onClick={() => handleResetPassword(p.data.name)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold cursor-pointer transition-colors"
                title="Send Password Reset"
                data-testid={`superadmin-users-users-overview-reset-pwd-3-${getSuperadminInteractiveTestIdSuffix(p.data)}`}
              >
                <KeyRound size={12} className="text-indigo-400" />
                <span>{t('COPY.RESET_PWD')}</span>
              </button>
            </div>
          ) : null,
      },
    ],
    [t, handleOpenEdit, toggleStatus, handleResetPassword, handleQuickWhatsApp]
  );
}
