'use client';
/**
 * Responsibility: Render and edit global File Upload Restrictions (allowed extensions, max size, storage quotas, virus scan).
 * Flow: FormProvider context -> SuperadminSettingsGeneralUploadRestrictionsCard -> form state updates.
 */
import { useFormContext } from 'react-hook-form';
import { HardDrive, ShieldCheck, FileCheck } from 'lucide-react';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';
import { POPULAR_FILE_EXTENSIONS } from '@/app/frontend_superadmin/superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants';

export function SuperadminSettingsGeneralUploadRestrictionsCard() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SuperadminSettingsFormValues>();

  const currentExtensions = watch('uploadRestrictions.allowedExtensions') ?? [];
  const maxFileSize = watch('uploadRestrictions.maxFileSizeMb') ?? 10;
  const storageQuota = watch('uploadRestrictions.branchStorageQuotaGb') ?? 25;

  const toggleExtension = (ext: string) => {
    if (currentExtensions.includes(ext)) {
      if (currentExtensions.length > 1) {
        setValue(
          'uploadRestrictions.allowedExtensions',
          currentExtensions.filter((e) => e !== ext),
          { shouldDirty: true, shouldValidate: true }
        );
      }
    } else {
      setValue(
        'uploadRestrictions.allowedExtensions',
        [...currentExtensions, ext],
        { shouldDirty: true, shouldValidate: true }
      );
    }
  };

  return (
    <section
      id="section-upload_restrictions"
      aria-labelledby="heading-upload-restrictions"
      className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 backdrop-blur-md shadow-xl shadow-black/40 p-6 space-y-6 hover:border-indigo-500/35 transition-all"
    >
      <div className="flex items-center justify-between border-b border-indigo-500/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <HardDrive size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id="heading-upload-restrictions" className="text-base font-bold text-slate-100">
              4. File Upload Restrictions & Quotas
            </h2>
            <p className="text-xs text-slate-400">
              Set file size caps, allowed MIME extensions, and tenant branch storage limits.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300">
          Security Policy
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allowed File Extensions */}
        <div className="flex flex-col gap-2.5 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Allowed Document & Media Extensions
          </label>
          <p className="text-xs text-slate-400">
            Only files matching these verified extension headers can be uploaded by branches or members.
          </p>
          <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Allowed File Extensions">
            {POPULAR_FILE_EXTENSIONS.map((ext) => {
              const isSelected = currentExtensions.includes(ext);
              return (
                <button
                  type="button"
                  key={ext}
                  onClick={() => toggleExtension(ext)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-sm'
                      : 'bg-slate-950/60 border-indigo-500/20 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  data-testid={`settings-upload-ext-${ext.replace('.', '')}`}
                >
                  <FileCheck size={13} aria-hidden="true" />
                  {ext}
                </button>
              );
            })}
          </div>
          {errors.uploadRestrictions?.allowedExtensions && (
            <p className="text-xs text-rose-400" role="alert">
              At least one allowed extension must be designated.
            </p>
          )}
        </div>

        {/* Max File Size */}
        <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-max-file-size" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Max Single File Size (MB)
            </label>
            <span className="text-xs font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg">
              {maxFileSize} MB
            </span>
          </div>
          <input
            id="settings-max-file-size"
            type="range"
            min={1}
            max={100}
            step={1}
            {...register('uploadRestrictions.maxFileSizeMb', { valueAsNumber: true })}
            className="w-full accent-cyan-400 cursor-pointer"
            data-testid="settings-upload-max-file-size"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>1 MB (Compact)</span>
            <span>50 MB</span>
            <span>100 MB (Enterprise)</span>
          </div>
          {errors.uploadRestrictions?.maxFileSizeMb && (
            <p className="text-xs text-rose-400" role="alert">
              File size cap must be between 1 and 100 MB.
            </p>
          )}
        </div>

        {/* Branch Storage Quota */}
        <div className="flex flex-col gap-2 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-branch-storage-quota" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Branch Total Storage Quota (GB)
            </label>
            <span className="text-xs font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg">
              {storageQuota} GB
            </span>
          </div>
          <input
            id="settings-branch-storage-quota"
            type="range"
            min={1}
            max={500}
            step={5}
            {...register('uploadRestrictions.branchStorageQuotaGb', { valueAsNumber: true })}
            className="w-full accent-cyan-400 cursor-pointer"
            data-testid="settings-upload-branch-quota"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>1 GB (Starter)</span>
            <span>250 GB</span>
            <span>500 GB (Tier 3)</span>
          </div>
          {errors.uploadRestrictions?.branchStorageQuotaGb && (
            <p className="text-xs text-rose-400" role="alert">
              Branch quota must be between 1 and 500 GB.
            </p>
          )}
        </div>

        {/* Security and Optimization Toggles */}
        <div className="flex flex-col gap-3 md:col-span-2 pt-2 border-t border-indigo-500/15">
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/20 bg-slate-950/60">
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-cyan-400 mt-0.5" size={18} aria-hidden="true" />
              <div>
                <span className="text-xs font-bold text-slate-100 block">
                  Automated ClamAV Virus & Malware Scan
                </span>
                <span className="text-xs text-slate-400">
                  Scan uploaded attachments and profile documents asynchronously upon ingress before S3 storage.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              id="settings-virus-scanning"
              {...register('uploadRestrictions.virusScanningEnabled')}
              className="h-4 w-4 rounded-md border-indigo-500/40 bg-slate-950 text-cyan-400 accent-cyan-400 cursor-pointer"
              data-testid="settings-upload-virus-scan"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-indigo-500/20 bg-slate-950/60">
            <div className="flex items-start gap-3">
              <HardDrive className="text-cyan-400 mt-0.5" size={18} aria-hidden="true" />
              <div>
                <span className="text-xs font-bold text-slate-100 block">
                  Automatic Client WebP Compression
                </span>
                <span className="text-xs text-slate-400">
                  Convert large raw JPG/PNG scans into optimized WebP formats automatically to preserve tenant bandwidth.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              id="settings-auto-compress"
              {...register('uploadRestrictions.autoCompressImages')}
              className="h-4 w-4 rounded-md border-indigo-500/40 bg-slate-950 text-cyan-400 accent-cyan-400 cursor-pointer"
              data-testid="settings-upload-auto-compress"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
