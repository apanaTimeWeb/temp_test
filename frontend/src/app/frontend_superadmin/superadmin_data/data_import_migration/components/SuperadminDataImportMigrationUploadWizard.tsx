// frontend/src/app/frontend_superadmin/superadmin_data/data_import_migration/components/SuperadminDataImportMigrationUploadWizard.tsx
'use client';

/**
 * @file SuperadminDataImportMigrationUploadWizard.tsx
 * @description File ingestion wizard for library data migration (Feature 9).
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadCloud, FileSpreadsheet, Play, ShieldAlert } from 'lucide-react';
import {
  PreflightValidateSchema,
  type PreflightValidateFormData,
} from '../schemas/superadmin_data_import_migration.schemas';
import {
  IMPORT_ENTITY_TYPES,
  DUPLICATE_STRATEGIES,
  SUPPORTED_IMPORT_EXTENSIONS,
} from '../constants/superadmin_data_import_migration.constants';

interface UploadWizardProps {
  onRunPreflight: (data: PreflightValidateFormData) => void;
  isValidating: boolean;
}

export function SuperadminDataImportMigrationUploadWizard({
  onRunPreflight,
  isValidating,
}: UploadWizardProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PreflightValidateFormData>({
    resolver: zodResolver(PreflightValidateSchema),
    defaultValues: {
      tenantId: 'tnt-delhi-central',
      entityType: 'PATRONS',
      duplicateStrategy: 'SKIP',
      fileName: '',
      fileSizeBytes: 0,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue('fileName', file.name, { shouldValidate: true });
      setValue('fileSizeBytes', file.size, { shouldValidate: true });
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Library Migration Ingestion Wizard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ingest legacy library records into an isolated tenant schema with automated pre-flight testing.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onRunPreflight)} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tenant Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Destination Library Tenant *
            </label>
            <select
              {...register('tenantId')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="tnt-delhi-central">Delhi Central Library (DCL-01)</option>
              <option value="tnt-mumbai-suburb">Mumbai Metro Library Network (MML-02)</option>
              <option value="tnt-bangalore-tech">Bengaluru Digital Learning Vault (BDL-03)</option>
            </select>
            {errors.tenantId && (
              <span className="text-[11px] text-rose-500 mt-0.5 block">{errors.tenantId.message}</span>
            )}
          </div>

          {/* Entity Type Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Data Entity Category *
            </label>
            <select
              {...register('entityType')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="PATRONS">Patrons & Memberships</option>
              <option value="SEATS_LOCKERS_INVENTORY">Seats & Lockers Layout Matrix (CSV / Excel)</option>
              <option value="CIRCULATION_HISTORY">Historical Checkouts & Loans</option>
              <option value="FINES_FEES">Fines & Historical Fee Invoices</option>
            </select>
          </div>

          {/* Duplicate Strategy */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Duplicate Conflict Strategy *
            </label>
            <select
              {...register('duplicateStrategy')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="SKIP">Skip Duplicates (Recommended)</option>
              <option value="OVERWRITE">Overwrite Existing Records</option>
              <option value="ERROR">Abort Entire Batch on Duplicate</option>
            </select>
          </div>
        </div>

        {/* Drag & Drop File Ingestion Area */}
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Migration File Source (.csv, .xlsx, .json, .mrc) *
          </label>
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 rounded-xl p-5 text-center transition-colors bg-slate-50/50 dark:bg-slate-800/20">
            <input
              type="file"
              accept=".csv,.xlsx,.json,.mrc"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center pointer-events-none">
              <FileSpreadsheet className="w-8 h-8 text-amber-500 mb-2" />
              {selectedFile ? (
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {selectedFile.name}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {(selectedFile.size / 1024).toFixed(1)} KB — Ready for validation
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Click to browse or drop migration file here
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Supported: Excel (.xlsx), CSV, JSON, Koha MARC21 (.mrc)
                  </span>
                </div>
              )}
            </div>
          </div>
          {errors.fileName && (
            <span className="text-[11px] text-rose-500 mt-1 block">{errors.fileName.message}</span>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Pre-flight checks simulate data insertion without writing to the live database.</span>
          </div>

          <button
            type="submit"
            disabled={!selectedFile || isValidating}
            className="group inline-flex items-center gap-2.5 px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 disabled:opacity-50 rounded-xl shadow-lg shadow-amber-600/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 cursor-pointer"
          >
            <span className="p-1 rounded-md bg-white/20 text-white border border-white/30 group-hover:scale-110 transition-transform">
              <Play className="w-3.5 h-3.5 fill-current" />
            </span>
            <span>{isValidating ? 'Validating Dry Run...' : 'Run Pre-flight Dry Run'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
