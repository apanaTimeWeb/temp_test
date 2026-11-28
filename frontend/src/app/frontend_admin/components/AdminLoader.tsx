'use client';

import {
Armchair,
Ban,
Banknote,
Bell,
BellRing,
Book,
Building,
Building2,
CalendarCheck,
ChartBar,
ClipboardList,
Clock,
CreditCard,
FileText,
Gift,
GraduationCap,
Grid3x3,
HandCoins,
Handshake,
History,
IdCard,
KeyRound,
Layers,
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
Shield,
ShieldCheck,
Star,
Ticket,
User,
UserCheck,
UserPlus,
Users,
UserX,
WalletCards,
Wrench,
type LucideIcon,
} from 'lucide-react';
import React from 'react';

/* ---------- SIZE MAP ---------- */
const SIZE_CLASSES = {
  xs: 'w-5 h-5',
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-28 h-28',
} as const;

export type LoaderSize = keyof typeof SIZE_CLASSES;
export type LoaderVariant = 'default' | 'contra' | 'flip' | 'breath';
export type LoaderIcon = keyof typeof ICONS;

/* ---------- ICON REGISTRY (Admin + Manager Routes) ---------- */
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
  'bell-ring': BellRing,
  'message-circle': MessageCircle,
  'message-square-text': MessageSquareText,
  'ban': Ban,
  'hand-coins': HandCoins,
  'banknote': Banknote,
  'handshake': Handshake,
  'refresh-cw': RefreshCw,
  'shield-check': ShieldCheck,
  'shield': Shield,
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
  'building-2': Building2,
  'life-buoy': LifeBuoy,
  'key-round': KeyRound,
  'log-in': LogIn,
  'ticket': Ticket,
  'layers': Layers,
  'clock': Clock,
  'wallet-cards': WalletCards,
  'credit-card': CreditCard,
  'book': Book,
  'user': User,
  'report': FileText,
  'file-text': FileText,
};

/* ---------- GRADIENT DEFS ---------- */
const AdminGradientDefs = React.memo(function AdminGradientDefs() {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
      <defs>
        <linearGradient id="adminLibGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--info)" />
          <stop offset="50%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--purple-text)" />
        </linearGradient>
      </defs>
    </svg>
  );
});

export interface AdminLoaderProps {
  size?: LoaderSize;
  icon?: LoaderIcon | string;
  variant?: LoaderVariant;
  className?: string;
  label?: string;
  screenReaderText?: string;
}

export function AdminLoader({
  size = 'md',
  icon = 'book',
  variant = 'contra',
  className = '',
  label = 'Loading',
  screenReaderText,
}: AdminLoaderProps) {
  const sizeClass = SIZE_CLASSES[size];
  const variantClass = variant !== 'default' ? ` ${variant}` : '';
  const Icon = ICONS[icon] ?? Book;

  return (
    <div
      className={`library-loader-box ${sizeClass}${variantClass}${className ? ' ' + className : ''}`}
      role="status"
      aria-label={label}
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{screenReaderText || label}</span>
      <AdminGradientDefs />
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
          stroke="url(#adminLibGrad)" strokeWidth="3.2"
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

export { AdminLoader as LibraryLoader };

/* ---------- PAGE-LEVEL WRAPPER (centered full area) ---------- */
export interface AdminPageLoaderProps extends AdminLoaderProps {
  message?: string;
}

export function AdminPageLoader({
  message,
  className = '',
  ...props
}: AdminPageLoaderProps) {
  return (
    <div
      className={`min-h-[60vh] flex flex-col items-center justify-center w-full gap-4 p-8 ${className}`.trim()}
    >
      <AdminLoader {...props} />
      {message && (
        <p className="text-sm font-medium text-text-secondary tracking-wide motion-safe:animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

/* ---------- BUTTON INLINE LOADER ---------- */
export interface AdminButtonLoaderProps {
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
}: AdminButtonLoaderProps) {
  return (
    <AdminLoader
      size="xs"
      icon={icon}
      variant={variant}
      label={label}
      className={`button-loader ${className}`.trim()}
    />
  );
}

export default AdminLoader;
