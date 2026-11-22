'use client';

import {
  Activity,
  Armchair,
  Ban,
  Banknote,
  BarChart3,
  Bell,
  BellRing,
  Book,
  BookOpen,
  Building,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  Cpu,
  CreditCard,
  Crown,
  Database,
  FileSpreadsheet,
  FileText,
  Gauge,
  Gift,
  GitBranch,
  GraduationCap,
  Grid3x3,
  HandCoins,
  Handshake,
  Headphones,
  History,
  IdCard,
  KeyRound,
  Layers,
  LayoutDashboard,
  Library,
  LifeBuoy,
  Lock,
  LogIn,
  MessageCircle,
  MessageSquareText,
  MessageSquareWarning,
  Package,
  PieChart,
  QrCode,
  Radio,
  Receipt,
  RefreshCw,
  Repeat,
  Scale,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Star,
  Ticket,
  ToggleLeft,
  TrendingUp,
  User,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UserX,
  WalletCards,
  Webhook,
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

/* ---------- ICON REGISTRY (Superadmin + Admin + Manager Routes) ---------- */
const ICONS: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  'chart-bar': BarChart3,
  'trending-up': TrendingUp,
  'pie-chart': PieChart,
  'gauge': Gauge,
  'scale': Scale,
  'receipt': Receipt,
  'credit-card': CreditCard,
  'wallet-cards': WalletCards,
  'banknote': Banknote,
  'hand-coins': HandCoins,
  'git-branch': GitBranch,
  'building': Building,
  'building-2': Building2,
  'radio': Radio,
  'bell': Bell,
  'bell-ring': BellRing,
  'database': Database,
  'server': Server,
  'activity': Activity,
  'cpu': Cpu,
  'webhook': Webhook,
  'sparkles': Sparkles,
  'toggle-left': ToggleLeft,
  'library': Library,
  'book': Book,
  'book-open': BookOpen,
  'layers': Layers,
  'package': Package,
  'shield': Shield,
  'shield-alert': ShieldAlert,
  'shield-check': ShieldCheck,
  'settings': Settings,
  'sliders': Sliders,
  'repeat': Repeat,
  'crown': Crown,
  'life-buoy': LifeBuoy,
  'headphones': Headphones,
  'ticket': Ticket,
  'users': Users,
  'user-cog': UserCog,
  'user': User,
  'user-plus': UserPlus,
  'user-check': UserCheck,
  'user-x': UserX,
  'lock': Lock,
  'key-round': KeyRound,
  'history': History,
  'clipboard-list': ClipboardList,
  'file-spreadsheet': FileSpreadsheet,
  'file-text': FileText,
  'report': FileText,
  'search': Search,
  'refresh-cw': RefreshCw,
  'armchair': Armchair,
  'wrench': Wrench,
  'calendar-check': CalendarCheck,
  'qr-code': QrCode,
  'message-square-warning': MessageSquareWarning,
  'message-circle': MessageCircle,
  'message-square-text': MessageSquareText,
  'ban': Ban,
  'handshake': Handshake,
  'star': Star,
  'graduation-cap': GraduationCap,
  'id-card': IdCard,
  'gift': Gift,
  'grid-3x3': Grid3x3,
  'log-in': LogIn,
  'check-circle': CheckCircle2,
};

export type LoaderIcon = keyof typeof ICONS;

/* ---------- SCOPED SUPERADMIN LOADER STYLE (Aurora Cyber-Luxury) ---------- */
const SUPERADMIN_LOADER_CSS = `
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
  @keyframes spinCW {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes spinCCW {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
`;

/* ---------- GRADIENT DEFS ---------- */
const SuperadminGradientDefs = React.memo(function SuperadminGradientDefs() {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
      <defs>
        <linearGradient id="superadminLibGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
    </svg>
  );
});

export interface SuperadminLoaderProps {
  size?: LoaderSize;
  icon?: LoaderIcon | string;
  variant?: LoaderVariant;
  className?: string;
  label?: string;
  screenReaderText?: string;
}

export function SuperadminLoader({
  size = 'md',
  icon = 'shield-check',
  variant = 'contra',
  className = '',
  label = 'Loading',
  screenReaderText,
}: SuperadminLoaderProps) {
  const px = SIZES[size];
  const variantClass = variant !== 'default' ? ` ${variant}` : '';
  const Icon = ICONS[icon] ?? ShieldCheck;

  return (
    <div
      className={`library-loader-box${variantClass}${className ? ' ' + className : ''}`}
      style={{ width: px, height: px }}
      role="status"
      aria-label={label}
      aria-live="polite"
      aria-busy="true"
    >
      <style dangerouslySetInnerHTML={{ __html: SUPERADMIN_LOADER_CSS }} />
      <span className="sr-only">{screenReaderText || label}</span>
      <SuperadminGradientDefs />
      <div className="loader-aura" aria-hidden="true" />

      {/* Outer CW ring — matches UI gradient (Cyan -> Indigo -> Violet) */}
      <svg className="loader-ring" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="#6366F1"
          strokeWidth="2.5"
          strokeDasharray="4 6"
          opacity="0.35"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="url(#superadminLibGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="95 180"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Inner CCW ring — luminous cyan dashed ring */}
      <svg className="inner-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r="35"
          stroke="#22D3EE"
          strokeWidth="1.8"
          strokeDasharray="6 10"
          opacity="0.75"
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

export { SuperadminLoader as LibraryLoader };

/* ---------- PAGE-LEVEL WRAPPER (centered full area) ---------- */
export interface SuperadminPageLoaderProps extends SuperadminLoaderProps {
  message?: string;
}

export function SuperadminPageLoader({
  message,
  className = '',
  label = 'Loading Superadmin Workspace...',
  ...props
}: SuperadminPageLoaderProps) {
  return (
    <div
      className={`min-h-[60vh] flex flex-col items-center justify-center w-full gap-4 p-8 ${className}`.trim()}
    >
      <SuperadminLoader label={label} {...props} />
      {message && (
        <p className="text-sm font-medium text-slate-400 tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

/* ---------- BUTTON INLINE LOADER ---------- */
export interface SuperadminButtonLoaderProps {
  icon?: LoaderIcon | string;
  variant?: LoaderVariant;
  label?: string;
  className?: string;
}

export function ButtonLoader({
  icon = 'shield-check',
  variant = 'contra',
  label = 'Loading',
  className = '',
}: SuperadminButtonLoaderProps) {
  return (
    <SuperadminLoader
      size="xs"
      icon={icon}
      variant={variant}
      label={label}
      className={`button-loader ${className}`.trim()}
    />
  );
}

export default SuperadminLoader;
