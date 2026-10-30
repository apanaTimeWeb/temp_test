'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';

/** Toggles the canonical `.dark` class through the application's approved theme provider. */
export function AdminShellThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('ADMIN_SHELL');
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:transition-colors motion-safe:duration-base"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? t('SWITCH_TO_LIGHT') : t('SWITCH_TO_DARK')}
      title={isDark ? t('SWITCH_TO_LIGHT') : t('SWITCH_TO_DARK')}
    >
      {isDark ? <Sun size={18} strokeWidth={2} aria-hidden="true" /> : <Moon size={18} strokeWidth={2} aria-hidden="true" />}
    </button>
  );
}
