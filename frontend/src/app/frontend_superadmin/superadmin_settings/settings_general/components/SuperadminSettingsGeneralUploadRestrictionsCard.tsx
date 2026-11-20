'use client';
/**
 * Responsibility: Render and edit global File Upload Restrictions (allowed extensions, max size, storage quotas, virus scan).
 * Flow: FormProvider context -> SuperadminSettingsGeneralUploadRestrictionsCard -> form state updates.
 */
import { useFormContext } from 'react-hook-form';
import { HardDrive, ShieldCheck, FileCheck, AlertTriangle } from 'lucide-react';
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
      className="sa-card p-6 flex flex-col gap-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-subtle text-primary">
            <HardDrive size={22} aria-hidden="true" />
          </div>
          <div>
            <h2 id="heading-upload-restrictions" className="text-base font-bold text-primary">
              File Upload Restrictions & Quotas
            </h2>
            <p className="text-xs text-secondary">
              Set file size caps, allowed MIME extensions, and tenant branch storage limits.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-surface-hover text-secondary">
          Security Policy
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Allowed File Extensions */}
        <div className="flex flex-col gap-2.5 md:col-span-2">
          <label className="text-xs font-semibold text-primary">
            Allowed Document & Media Extensions
          </label>
          <p className="text-xs text-secondary">
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border motion-safe:transition-all motion-reduce:transition-none ${
                    isSelected
                      ? 'bg-primary-subtle border-focus text-primary font-semibold'
                      : 'bg-surface-subtle border-border text-secondary hover:bg-surface-hover'
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
            <p className="text-xs text-danger" role="alert">
              At least one allowed extension must be designated.
            </p>
          )}
        </div>

        {/* Max File Size */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-max-file-size" className="text-xs font-semibold text-primary">
              Max Single File Size (MB)
            </label>
            <span className="text-xs font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">
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
            className="w-full accent-primary cursor-pointer"
            data-testid="settings-upload-max-file-size"
          />
          <div className="flex justify-between text-[11px] text-secondary">
            <span>1 MB (Compact)</span>
            <span>50 MB</span>
            <span>100 MB (Enterprise)</span>
          </div>
          {errors.uploadRestrictions?.maxFileSizeMb && (
            <p className="text-xs text-danger" role="alert">
              File size cap must be between 1 and 100 MB.
            </p>
          )}
        </div>

        {/* Branch Storage Quota */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="settings-branch-storage-quota" className="text-xs font-semibold text-primary">
              Branch Total Storage Quota (GB)
            </label>
            <span className="text-xs font-bold text-primary bg-primary-subtle px-2 py-0.5 rounded">
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
            className="w-full accent-primary cursor-pointer"
            data-testid="settings-upload-branch-quota"
          />
          <div className="flex justify-between text-[11px] text-secondary">
            <span>1 GB (Starter)</span>
            <span>250 GB</span>
            <span>500 GB (Tier 3)</span>
          </div>
          {errors.uploadRestrictions?.branchStorageQuotaGb && (
            <p className="text-xs text-danger" role="alert">
              Branch quota must be between 1 and 500 GB.
            </p>
          )}
        </div>

        {/* Security and Optimization Toggles */}
        <div className="flex flex-col gap-3 md:col-span-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-subtle">
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-primary mt-0.5" size={18} aria-hidden="true" />
              <div>
                <span className="text-xs font-bold text-primary block">
                  Automated ClamAV Virus & Malware Scan
                </span>
                <span className="text-xs text-secondary">
                  Scan uploaded attachments and profile documents asynchronously upon ingress before S3 storage.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              id="settings-virus-scanning"
              {...register('uploadRestrictions.virusScanningEnabled')}
              className="h-4 w-4 rounded accent-primary cursor-pointer"
              data-testid="settings-upload-virus-scan"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface-subtle">
            <div className="flex items-start gap-3">
              <HardDrive className="text-primary mt-0.5" size={18} aria-hidden="true" />
              <div>
                <span className="text-xs font-bold text-primary block">
                  Automatic Client WebP Compression
                </span>
                <span className="text-xs text-secondary">
                  Convert large raw JPG/PNG scans into optimized WebP formats automatically to preserve tenant bandwidth.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              id="settings-auto-compress"
              {...register('uploadRestrictions.autoCompressImages')}
              className="h-4 w-4 rounded accent-primary cursor-pointer"
              data-testid="settings-upload-auto-compress"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
