'use client';
import type { FC } from 'react';
import { Upload } from 'lucide-react';
import { SuperadminSettingsBrandingLabel as Label } from '@/app/frontend_superadmin/superadmin_settings/settings_branding/components/SuperadminSettingsBrandingLabel';

interface SuperadminSettingsBrandingLogoUploadProps {
  label: string;
  buttonText: string;
  tooltip: string;
}

export const SuperadminSettingsBrandingLogoUpload: FC<SuperadminSettingsBrandingLogoUploadProps> = ({
  label,
  buttonText,
  tooltip,
}) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div
      id="branding-logo-upload"
      className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-500/30 hover:border-purple-500/50 rounded-2xl p-6 bg-slate-950/60 motion-safe:transition-all text-center group"
    >
      <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl font-bold mb-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300 shadow-md group-hover:scale-105 transition-transform">
        📚
      </div>
      <button
        type="button"
        disabled
        title={tooltip}
        className="text-xs font-semibold text-slate-400 opacity-75 flex items-center gap-1.5 cursor-not-allowed px-3 py-1.5 rounded-xl bg-slate-900 border border-indigo-500/30"
        data-testid="superadmin-system-system-branding-unavailable-copy-action-is-not-connected-to-configured-branding-data-1"
      >
        <Upload size={13} className="text-purple-400" />
        <span>{buttonText}</span>
      </button>
      <span className="text-[11px] text-slate-500 mt-2">PNG, SVG, or JPG (200×200px recommended)</span>
    </div>
  </div>
);
