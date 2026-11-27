'use client';
import type { FC } from 'react';
import { SlidersHorizontal } from 'lucide-react';

export const THEME_PRESETS = [
  { name: 'Imperial Gold', primary: '#FACC15', accent: '#CA8A04', dot: 'bg-amber-400' },
  { name: 'Royal Indigo', primary: '#6366F1', accent: '#4F46E5', dot: 'bg-indigo-500' },
  { name: 'Emerald Mint', primary: '#10B981', accent: '#059669', dot: 'bg-emerald-500' },
  { name: 'Crimson Rose', primary: '#F43F5E', accent: '#E11D48', dot: 'bg-rose-500' },
  { name: 'Cyber Violet', primary: '#8B5CF6', accent: '#7C3AED', dot: 'bg-purple-500' },
] as const;

interface SuperadminSettingsBrandingThemePresetsProps {
  activePrimary?: string;
  onSelectPreset: (primary: string, accent: string) => void;
}

export const SuperadminSettingsBrandingThemePresets: FC<SuperadminSettingsBrandingThemePresetsProps> = ({
  activePrimary,
  onSelectPreset,
}) => (
  <div className="space-y-2.5 pt-3 border-t border-indigo-500/15">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <SlidersHorizontal size={13} className="text-purple-400" />
        Curated Color Themes
      </span>
      <span className="text-[11px] text-slate-400 font-medium">1-Click Apply</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {THEME_PRESETS.map((preset) => {
        const isActive = activePrimary?.toLowerCase() === preset.primary.toLowerCase();
        return (
          <button
            key={preset.name}
            type="button"
            onClick={() => onSelectPreset(preset.primary, preset.accent)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 motion-safe:transition-all cursor-pointer ${
              isActive
                ? 'border-purple-400 bg-purple-500/20 text-purple-200 shadow-sm shadow-purple-950/40 font-bold'
                : 'border-indigo-500/20 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 hover:border-indigo-500/40'
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${preset.dot} shrink-0 shadow-xs`} />
            <span className="truncate">{preset.name}</span>
          </button>
        );
      })}
    </div>
  </div>
);
