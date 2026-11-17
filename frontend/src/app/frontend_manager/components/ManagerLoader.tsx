'use client';

import React from 'react';
import {
  LayoutDashboard,
  ChartBar,
  Scale,
  Receipt,
  Armchair,
  Wrench,
  ClipboardList,
  UserX,
  CalendarCheck,
  QrCode,
  MessageSquareWarning,
  Bell,
  MessageCircle,
  MessageSquareText,
  Ban,
  HandCoins,
  Banknote,
  Handshake,
  RefreshCw,
  ShieldCheck,
  Repeat,
  Star,
  GraduationCap,
  Users,
  Search,
  UserPlus,
  IdCard,
  UserCheck,
  Gift,
  Lock,
  History,
  Grid3x3,
  Building,
  LifeBuoy,
  KeyRound,
  LogIn,
  Book,
  User,
  FileText,
  type LucideIcon,
} from 'lucide-react';

/* ---------- SIZE MAP ---------- */
const SIZES = {
  xs: 20,
  sm: 40,
  md: 64,
  lg: 96,
  xl: 112,
} as const;

export type LoaderSize = keyof typeof SIZES;
export type LoaderVariant = 'default' | 'contra' | 'flip' | 'breath';
export type LoaderIcon = keyof typeof ICONS;

/* ---------- ICON REGISTRY (35 routes + login) ---------- */
const ICONS: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  'chart-bar': ChartBar,
  'scale': Scale,
  'receipt': Receipt,
  'armchair': Armchair,
  'wrench': Wrench,
  'clipboard-list': ClipboardList,
  'user-x': UserX,
  'calendar-check': CalendarCheck,
  'qr-code': QrCode,
  'message-square-warning': MessageSquareWarning,
  'bell': Bell,
  'message-circle': MessageCircle,
  'message-square-text': MessageSquareText,
  'ban': Ban,
  'hand-coins': HandCoins,
  'banknote': Banknote,
  'handshake': Handshake,
  'refresh-cw': RefreshCw,
  'shield-check': ShieldCheck,
  'repeat': Repeat,
  'star': Star,
  'graduation-cap': GraduationCap,
  'users': Users,
  'search': Search,
  'user-plus': UserPlus,
  'id-card': IdCard,
  'user-check': UserCheck,
  'gift': Gift,
  'lock': Lock,
  'history': History,
  'grid-3x3': Grid3x3,
  'building': Building,
  'life-buoy': LifeBuoy,
  'key-round': KeyRound,
  'log-in': LogIn,
  /* legacy fallbacks */
  'book': Book,
  'user': User,
  'report': FileText,
};

/* ---------- GRADIENT DEFS (ek baar render) ---------- */
const GradientDefs = React.memo(function GradientDefs() {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
      <defs>
        <linearGradient id="libGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F4D03F" />
          <stop offset="50%" stopColor="#C8912A" />
          <stop offset="100%" stopColor="#1E3A5F" />
        </linearGradient>
      </defs>
    </svg>
  );
});

/* ---------- CORE LOADER ---------- */
interface LoaderProps {
  size?: LoaderSize;
  icon?: LoaderIcon | string;
  variant?: LoaderVariant;
  className?: string;
  label?: string;
}

export function LibraryLoader({
  size = 'md',
  icon = 'book',
  variant = 'default',
  className = '',
  label = 'Loading',
}: LoaderProps) {
  const px = SIZES[size];
  const variantClass = variant !== 'default' ? ` ${variant}` : '';
  const Icon = ICONS[icon] ?? Book;

  const showInnerRing = variant === 'contra' || variant === 'default';

  return (
    <div
      className={`library-loader-box${variantClass}${className ? ' ' + className : ''}`}
      style={{ width: px, height: px }}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      <GradientDefs />
      <div className="loader-aura" aria-hidden="true" />

      {/* Outer CW ring — sab variants mein */}
      <svg className="loader-ring" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle
          cx="50" cy="50" r="44"
          stroke="#C8912A" strokeWidth="2.5"
          strokeDasharray="4 6" opacity="0.3"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="50" cy="50" r="44"
          stroke="url(#libGrad)" strokeWidth="3"
          strokeLinecap="round" strokeDasharray="95 180"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Inner CCW ring — contra + default */}
      {showInnerRing && (
        <svg className="inner-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <circle
            cx="50" cy="50" r="35"
            stroke="#1E3A5F" strokeWidth="1.5"
            strokeDasharray="6 10" opacity="0.4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      {/* Center semantic icon */}
      <div className="loader-icon" aria-hidden="true">
        <Icon strokeWidth={2} />
      </div>
    </div>
  );
}

/* ---------- PAGE-LEVEL WRAPPER (centered full area) ---------- */
export function ManagerPageLoader(props: LoaderProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LibraryLoader {...props} />
    </div>
  );
}

/* ---------- BUTTON INLINE LOADER ---------- */
interface ButtonLoaderProps {
  icon?: LoaderIcon | string;
  variant?: LoaderVariant;
  label?: string;
  className?: string;
}

export function ButtonLoader({
  icon = 'book',
  variant = 'contra',
  label = 'Loading',
  className = '',
}: ButtonLoaderProps) {
  return (
    <LibraryLoader
      size="xs"
      icon={icon}
      variant={variant}
      label={label}
      className={`button-loader ${className}`.trim()}
    />
  );
}

export default LibraryLoader;
