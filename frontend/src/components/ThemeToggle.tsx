'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkTheme = typeof document !== 'undefined' && (
      document.documentElement.classList.contains('dark') ||
      document.body.classList.contains('dark')
    );
    setIsDark(isDarkTheme);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (typeof document !== 'undefined') {
      if (nextDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="mgr-theme-toggle p-2 rounded-full hover:bg-surface-hover text-text-secondary transition-colors"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
    </button>
  );
}

export default ThemeToggle;

