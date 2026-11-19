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
  BellRing,
  MessageCircle,
  MessageSquareText,
  Ban,
  HandCoins,
  Banknote,
  Handshake,
  RefreshCw,
  ShieldCheck,
  Shield,
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
  Building2,
  LifeBuoy,
  KeyRound,
  LogIn,
  Book,
  User,
  FileText,
  Ticket,
  Layers,
  Clock,
  WalletCards,
  CreditCard,
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

/* ---------- SCOPED ADMIN LOADER STYLE (Aurora Cyber-Luxury) ---------- */
const ADMIN_LOADER_CSS = `
  .library-loader-box {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .library-loader-box .loader-aura {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    filter: blur(16px);
    opacity: 0.6;
    pointer-events: none;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(139, 92, 246, 0.2) 45%, rgba(34, 211, 238, 0.1) 70%, transparent 85%);
  }
  .library-loader-box .loader-ring {
    width: 100%;
    height: 100%;
    animation: spinCW 1.4s linear infinite;
  }
  .library-loader-box .inner-svg {
    position: absolute;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    pointer-events: none;
    animation: spinCCW 2.4s linear infinite;
  }
  .library-loader-box .loader-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    user-select: none;
    color: #FFFFFF !important;
  }
  .library-loader-box .loader-icon svg {
    width: 45%;
    height: 45%;
    filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.7)) drop-shadow(0 0 4px rgba(34, 211, 238, 0.5)) !important;
  }
  .library-loader-box.button-loader .loader-aura {
    opacity: 0.25;
  }
`;

/* ---------- GRADIENT DEFS ---------- */
const AdminGradientDefs = React.memo(function AdminGradientDefs() {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
      <defs>
        <linearGradient id="adminLibGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#A78BFA" />
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
  const px = SIZES[size];
  const variantClass = variant !== 'default' ? ` ${variant}` : '';
  const Icon = ICONS[icon] ?? Book;

  return (
    <div
      className={`library-loader-box${variantClass}${className ? ' ' + className : ''}`}
      style={{ width: px, height: px }}
      role="status"
      aria-label={label}
      aria-live="polite"
      aria-busy="true"
    >
      <style dangerouslySetInnerHTML={{ __html: ADMIN_LOADER_CSS }} />
      <span className="sr-only">{screenReaderText || label}</span>
      <AdminGradientDefs />
      <div className="loader-aura" aria-hidden="true" />

      {/* Outer CW ring — matches UI gradient (Cyan -> Indigo -> Violet) */}
      <svg className="loader-ring" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle
          cx="50" cy="50" r="44"
          stroke="#6366F1" strokeWidth="2.5"
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
          stroke="#22D3EE" strokeWidth="1.8"
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
  label = 'Loading',
  screenReaderText,
  message,
  className = '',
  ...props
}: AdminPageLoaderProps) {
  return (
    <div
      className={`min-h-[60vh] flex flex-col items-center justify-center w-full gap-4 p-8 ${className}`.trim()}
      role="status"
      aria-label={label}
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{screenReaderText || label}</span>
      <AdminLoader label={label} screenReaderText={screenReaderText} {...props} />
      {message && (
        <p className="text-sm font-medium text-slate-400 tracking-wide animate-pulse">
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
