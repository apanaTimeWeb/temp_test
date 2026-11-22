'use client';
// RESPONSIBILITY: NextDevIndicator component providing a visual compiling badge in development mode.

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function NextDevIndicator() {
  const [isCompiling, setIsCompiling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerCompiling = () => {
    setIsCompiling(true);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setIsCompiling(false);
    }, 1000);
  };

  useEffect(() => {
    setMounted(true);

    const originalLog = console.log;
    console.log = function (...args: unknown[]) {
      originalLog.apply(console, args);
      try {
        const msg = args.map((a) => (typeof a === 'string' ? a : '')).join(' ');
        if (msg.includes('[Fast Refresh] rebuilding')) {
          triggerCompiling();
        } else if (msg.includes('[Fast Refresh] done')) {
          if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
          resetTimerRef.current = setTimeout(() => setIsCompiling(false), 300);
        }
      } catch {
        // Safe fallback
      }
    };

    return () => {
      console.log = originalLog;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  useEffect(() => {
    triggerCompiling();
  }, [pathname]);

  if (!mounted || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <aside
      aria-label="Next.js Compilation Indicator"
      className="fixed bottom-3.5 left-3.5 z-50 pointer-events-auto select-none font-sans"
    >
      <div
        className={`flex items-center gap-2 rounded-full border px-2.5 py-1.5 shadow-md backdrop-blur-md transition-all duration-200 ${
          isCompiling
            ? 'border-warning bg-card text-warning-text scale-105'
            : 'border-border bg-card text-text-secondary hover:text-text-primary hover:border-primary'
        }`}
      >
        <div className="relative flex h-4 w-4 items-center justify-center">
          {isCompiling && (
            <span className="absolute inset-0 rounded-full border-2 border-warning border-t-transparent animate-spin" />
          )}
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              isCompiling ? 'scale-90 text-warning-text' : 'text-text-primary'
            }`}
            viewBox="0 0 180 180"
            fill="none"
          >
            <mask
              id="next-indicator-mask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="180"
              height="180"
              style={{ maskType: 'alpha' }}
            >
              <circle cx="90" cy="90" r="90" fill="black" />
            </mask>
            <g mask="url(#next-indicator-mask)">
              <circle cx="90" cy="90" r="90" fill="currentColor" />
              <path
                d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.16 149.508 157.52Z"
                fill="var(--color-bg-page, #000)"
              />
              <rect x="115" y="54" width="12" height="72" fill="var(--color-bg-page, #000)" />
            </g>
          </svg>
        </div>
        <span className="text-[11px] font-semibold tracking-wide">
          {isCompiling ? 'Compiling…' : 'Next.js'}
        </span>
      </div>
    </aside>
  );
}
