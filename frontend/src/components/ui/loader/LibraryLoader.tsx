'use client';

import React from 'react';

export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LoaderIcon = 'book' | 'search' | 'user' | 'issue' | 'return' | 'fine' | 'report' | 'library';
export type LoaderVariant = 'default' | 'flip' | 'contra' | 'breath';

export interface LibraryLoaderProps {
  size?: LoaderSize | number;
  icon?: LoaderIcon;
  variant?: LoaderVariant;
  className?: string;
  label?: string;
  hideAura?: boolean;
  color?: string;
}

const SIZE_MAP: Record<LoaderSize, number> = {
  xs: 20,
  sm: 40,
  md: 64,
  lg: 96,
  xl: 112,
};

function renderSvgIcon(icon: LoaderIcon) {
  switch (icon) {
    case 'search':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      );
    case 'user':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case 'issue':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M9 9h6M13 7l2 2-2 2" />
        </svg>
      );
    case 'return':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M15 9H9M11 7 9 9l2 2" />
        </svg>
      );
    case 'fine':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 3h12" />
          <path d="M6 8h12" />
          <path d="m6 13 8.5 8" />
          <path d="M6 13h3" />
          <path d="M9 13c6.667 0 6.667-10 0-10" />
        </svg>
      );
    case 'report':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 3 3 5-6" />
        </svg>
      );
    case 'library':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );
    case 'book':
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path className="left-page" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path className="right-page" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
  }
}

export function LibraryLoader({
  size = 'md',
  icon = 'book',
  variant = 'default',
  className = '',
  label = 'Loading',
  hideAura = false,
  color,
}: LibraryLoaderProps) {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] ?? 64;
  const isXs = pixelSize <= 24;
  const variantClass = variant !== 'default' ? ` ${variant}` : '';

  return (
    <div
      className={`library-loader-box${variantClass} ${className}`.trim()}
      style={{ width: pixelSize, height: pixelSize }}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>

      {/* Embedded reusable gradient defs */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="libGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4D03F" />
            <stop offset="50%" stopColor="#C8912A" />
            <stop offset="100%" stopColor="#1E3A5F" />
          </linearGradient>
        </defs>
      </svg>

      {/* Aura Glow */}
      {!hideAura && !isXs && <div className="loader-aura" aria-hidden="true" />}

      {/* Outer Rotating Ring */}
      {variant === 'contra' ? (
        <>
          <svg className="loader-ring" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <circle cx="50" cy="50" r="44" stroke="#C8912A" strokeWidth="2.5" strokeDasharray="4 6" opacity="0.3" vectorEffect="non-scaling-stroke" />
            <circle cx="50" cy="50" r="44" stroke="url(#libGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="95 180" vectorEffect="non-scaling-stroke" />
          </svg>
          <svg className="inner-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <circle cx="50" cy="50" r="35" stroke="#1E3A5F" strokeWidth="1.5" strokeDasharray="6 10" opacity="0.4" vectorEffect="non-scaling-stroke" />
          </svg>
        </>
      ) : (
        <svg className="loader-ring" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <circle cx="50" cy="50" r="44" stroke="#C8912A" strokeWidth="2.5" strokeDasharray="4 6" opacity="0.3" vectorEffect="non-scaling-stroke" />
          <circle cx="50" cy="50" r="44" stroke="url(#libGrad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="95 180" vectorEffect="non-scaling-stroke" />
          <circle cx="50" cy="50" r="35" stroke="#1E3A5F" strokeWidth="1.5" strokeDasharray="6 10" opacity="0.35" vectorEffect="non-scaling-stroke" />
        </svg>
      )}

      {/* Center Semantic Icon */}
      <div className={`loader-icon ${color ?? ''}`.trim()} aria-hidden="true">
        {renderSvgIcon(icon)}
      </div>
    </div>
  );
}

/** Wrapper for Buttons (size xs, 20px, aura hidden) */
export function ButtonLoader({
  icon = 'book',
  className = '',
}: {
  icon?: LoaderIcon;
  className?: string;
}) {
  return (
    <LibraryLoader
      size="xs"
      icon={icon}
      hideAura={true}
      className={`shrink-0 ${className}`.trim()}
    />
  );
}

/** Wrapper for Section / In-page widgets (size sm, 40px) */
export function SectionLoader({
  icon = 'search',
  className = '',
}: {
  icon?: LoaderIcon;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center p-6 ${className}`.trim()} role="status" aria-label="Loading">
      <LibraryLoader size="sm" icon={icon} />
    </div>
  );
}

/** Wrapper for Processing Badges / Status pills (size sm, 40px) */
export function ProcessingLoader({
  icon = 'fine',
  className = '',
}: {
  icon?: LoaderIcon;
  className?: string;
}) {
  return (
    <div className={`processing ${className}`.trim()} role="status" aria-label="Loading">
      <LibraryLoader size="sm" icon={icon} />
    </div>
  );
}

/** Wrapper for Page-level route loading screens (loading.tsx - size lg, 96px) */
export function ManagerPageLoader({
  icon = 'library',
  variant = 'default',
  className = '',
}: {
  icon?: LoaderIcon;
  variant?: LoaderVariant;
  className?: string;
  title?: string;
}) {
  return (
    <main
      className={`min-h-[60vh] flex items-center justify-center p-8 w-full ${className}`.trim()}
      role="status"
      aria-label="Loading"
    >
      <LibraryLoader size="lg" icon={icon} variant={variant} />
    </main>
  );
}

export default LibraryLoader;
