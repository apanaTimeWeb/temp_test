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
  <div className="space-y-2.5 pt-2 border-t border-border/60">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
        <SlidersHorizontal size={12} />
        Curated Color Themes
      </span>
      <span className="text-[11px] text-muted-foreground">1-Click Apply</span>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {THEME_PRESETS.map((preset) => {
        const isActive = activePrimary?.toLowerCase() === preset.primary.toLowerCase();
        return (
          <button
            key={preset.name}
            type="button"
            onClick={() => onSelectPreset(preset.primary, preset.accent)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isActive
                ? 'border-primary bg-primary/10 text-primary shadow-xs'
                : 'border-border/80 bg-surface-zebra/60 text-secondary hover:text-primary hover:border-border'
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${preset.dot} shrink-0`} />
            <span className="truncate">{preset.name}</span>
          </button>
        );
      })}
    </div>
  </div>
);
