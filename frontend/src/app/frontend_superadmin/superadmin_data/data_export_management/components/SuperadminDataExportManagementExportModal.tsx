// frontend/src/app/frontend_superadmin/superadmin_data/data_export_management/components/SuperadminDataExportManagementExportModal.tsx
'use client';

/**
 * @file SuperadminDataExportManagementExportModal.tsx
 * @description Modal dialog for configuring customized tenant or branch exports.
 */

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Download, ShieldCheck } from 'lucide-react';
import type {
  TenantOption,
  BranchOption,
  ExportScope,
} from '../types/superadmin_data_export_management.types';
import {
  CreateExportSchema,
  type CreateExportFormData,
} from '../schemas/superadmin_data_export_management.schemas';
import {
  EXPORT_DATA_ENTITIES,
  EXPORT_FORMATS,
} from '../constants/superadmin_data_export_management.constants';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExportFormData) => void;
  isSubmitting: boolean;
  tenants: TenantOption[];
  branches: BranchOption[];
  initialScope?: ExportScope;
  initialTenantId?: string | null;
  initialBranchId?: string | null;
}

export function SuperadminDataExportManagementExportModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  tenants,
  branches,
  initialScope = 'TENANT',
  initialTenantId = null,
  initialBranchId = null,
}: ExportModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateExportFormData>({
    resolver: zodResolver(CreateExportSchema),
    defaultValues: {
      scope: initialScope,
      tenantId: initialTenantId ?? tenants[0]?.id ?? '',
      branchId: initialBranchId ?? '',
      format: 'ENCRYPTED_ZIP',
      entities: ['catalogs', 'patrons', 'circulations', 'financials'],
      encryptionPassword: '',
      reason: '',
    },
  });

  const currentScope = watch('scope');
  const currentTenantId = watch('tenantId');

  const filteredBranches = React.useMemo(() => {
    return branches.filter((b) => b.tenantId === currentTenantId);
  }, [branches, currentTenantId]);

  React.useEffect(() => {
    if (isOpen) {
      reset({
        scope: initialScope,
        tenantId: initialTenantId ?? tenants[0]?.id ?? '',
        branchId: initialBranchId ?? '',
        format: 'ENCRYPTED_ZIP',
        entities: ['catalogs', 'patrons', 'circulations', 'financials'],
        encryptionPassword: '',
        reason: '',
      });
    }
  }, [isOpen, initialScope, initialTenantId, initialBranchId, tenants, reset]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 id="export-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
                Configure Data Export Job
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate an isolated tenant or branch export archive.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Scope Radio */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Export Scope *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer ${
                  currentScope === 'TENANT'
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <input type="radio" value="TENANT" {...register('scope')} className="sr-only" />
                <span>Full Library Tenant</span>
              </label>
              <label
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer ${
                  currentScope === 'BRANCH'
                    ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/20 text-violet-900 dark:text-violet-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <input type="radio" value="BRANCH" {...register('scope')} className="sr-only" />
                <span>Single Branch</span>
              </label>
            </div>
          </div>

          {/* Tenant Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Library Tenant *
            </label>
            <select
              {...register('tenantId')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.code})
                </option>
              ))}
            </select>
            {errors.tenantId && (
              <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.tenantId.message}</span>
            )}
          </div>

          {/* Branch Selector (if Scope == BRANCH) */}
          {currentScope === 'BRANCH' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Branch *
              </label>
              <select
                {...register('branchId')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select Branch...</option>
                {filteredBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
              {errors.branchId && (
                <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.branchId.message}</span>
              )}
            </div>
          )}

          {/* Export Format */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Export Archive Format *
            </label>
            <select
              {...register('format')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="ENCRYPTED_ZIP">Encrypted ZIP Archive (.zip)</option>
              <option value="JSON">Raw JSON Datasets (.json)</option>
              <option value="CSV_ARCHIVE">Relational CSV Bundle (.tar.gz)</option>
              <option value="SQL_DUMP">SQL Database Dump (.sql.gz)</option>
            </select>
          </div>

          {/* Entities Checkboxes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Data Entities to Include *
            </label>
            <Controller
              name="entities"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {EXPORT_DATA_ENTITIES.map((entity) => {
                    const isChecked = field.value.includes(entity.id);
                    return (
                      <label
                        key={entity.id}
                        className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, entity.id]);
                            } else {
                              field.onChange(field.value.filter((id) => id !== entity.id));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="truncate">{entity.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            />
            {errors.entities && (
              <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.entities.message}</span>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Audit Reason / Purpose *
            </label>
            <input
              type="text"
              {...register('reason')}
              placeholder="e.g. Annual library accreditation compliance audit"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
            />
            {errors.reason && (
              <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.reason.message}</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {isSubmitting ? 'Queueing Export...' : 'Generate Export Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
