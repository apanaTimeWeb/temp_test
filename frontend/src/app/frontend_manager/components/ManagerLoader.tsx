'use client';

import '@/app/frontend_manager/components/ManagerLoader.css';
import {
Armchair,
Ban,
Banknote,
Bell,
Book,
Building,
CalendarCheck,
ChartBar,
ClipboardList,
FileText,
Gift,
GraduationCap,
Grid3x3,
HandCoins,
Handshake,
History,
IdCard,
KeyRound,
LayoutDashboard,
LifeBuoy,
Lock,
LogIn,
MessageCircle,
MessageSquareText,
MessageSquareWarning,
QrCode,
Receipt,
RefreshCw,
Repeat,
Scale,
Search,
ShieldCheck,
Star,
User,
UserCheck,
UserPlus,
Users,
UserX,
Wrench,
type LucideIcon,
} from 'lucide-react';
import React from 'react';

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
        <linearGradient id="mgrLibGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" className="library-loader-stop-start" />
          <stop offset="50%" className="library-loader-stop-mid" />
          <stop offset="100%" className="library-loader-stop-end" />
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
  variant = 'contra',
  className = '',
  label = 'Loading',
}: LoaderProps) {
  const variantClass = variant !== 'default' ? ` ${variant}` : '';
  const sizeClass = ` library-loader-box--${size in SIZES ? size : 'md'}`;
  const Icon = ICONS[icon] ?? Book;

  return (
    <div
      className={`library-loader-box${sizeClass}${variantClass}${className ? ' ' + className : ''}`}
      role="status"
      aria-label={label}
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <GradientDefs />
      <div className="loader-aura" aria-hidden="true" />

      {/* Outer CW ring — matches UI gradient (Cyan -> Indigo -> Violet) */}
      <svg className="loader-ring" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle
          cx="50" cy="50" r="44"
          stroke="var(--primary)" strokeWidth="2.5"
          strokeDasharray="4 6" opacity="0.35"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="50" cy="50" r="44"
          stroke="url(#mgrLibGrad)" strokeWidth="3.2"
          strokeLinecap="round" strokeDasharray="95 180"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Inner CCW ring — luminous cyan dashed ring */}
      <svg className="inner-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle
          cx="50" cy="50" r="35"
          stroke="var(--info)" strokeWidth="1.8"
          strokeDasharray="6 10" opacity="0.75"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Center semantic icon */}
      <div className="loader-icon" aria-hidden="true">
        <Icon strokeWidth={2} />
      </div>
    </div>
  );
}

/* ---------- PAGE-LEVEL WRAPPER (centered full area) ---------- */
export function ManagerPageLoader({ size, icon, variant, className, label }: LoaderProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LibraryLoader size={size} icon={icon} variant={variant} className={className} label={label} />
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
