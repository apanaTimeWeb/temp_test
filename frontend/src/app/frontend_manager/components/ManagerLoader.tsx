'use client';

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

/* ---------- SCOPED MANAGER LOADER STYLE (Aurora Cyber-Luxury) ---------- */
const MGR_LOADER_CSS = `
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
    color: #FFFFFF !important;
  }
  .library-loader-box .loader-icon svg {
    filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.7)) drop-shadow(0 0 4px rgba(34, 211, 238, 0.5)) !important;
  }
  .library-loader-box.button-loader .loader-aura {
    opacity: 0.25;
  }
`;

/* ---------- GRADIENT DEFS (ek baar render) ---------- */
const GradientDefs = React.memo(function GradientDefs() {
  return (
    <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
      <defs>
        <linearGradient id="mgrLibGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#A78BFA" />
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
  const px = SIZES[size];
  const variantClass = variant !== 'default' ? ` ${variant}` : '';
  const Icon = ICONS[icon] ?? Book;

  const showInnerRing = true;

  return (
    <div
      className={`library-loader-box${variantClass}${className ? ' ' + className : ''}`}
      style={{ width: px, height: px }}
      role="status"
      aria-label={label}
    >
      <style dangerouslySetInnerHTML={{ __html: MGR_LOADER_CSS }} />
      <span className="sr-only">{label}</span>
      <GradientDefs />
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
          stroke="url(#mgrLibGrad)" strokeWidth="3.2"
          strokeLinecap="round" strokeDasharray="95 180"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Inner CCW ring — luminous cyan dashed ring */}
      {showInnerRing && (
        <svg className="inner-svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <circle
            cx="50" cy="50" r="35"
            stroke="#22D3EE" strokeWidth="1.8"
            strokeDasharray="6 10" opacity="0.75"
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
