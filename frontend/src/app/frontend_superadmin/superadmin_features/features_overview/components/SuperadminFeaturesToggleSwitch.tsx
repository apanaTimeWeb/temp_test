'use client';
// RESPONSIBILITY: Reusable iOS-style animated ON/OFF toggle switch component.
// Features vibrant green background with bold "ON" text and solid white circular knob when active.

import React from 'react';

interface SuperadminFeaturesToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  labelOn?: string;
  labelOff?: string;
  title?: string;
  ariaLabel?: string;
  className?: string;
}

export function SuperadminFeaturesToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  labelOn = 'ON',
  labelOff = 'OFF',
  title,
  ariaLabel,
  className = '',
}: SuperadminFeaturesToggleSwitchProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    onChange(!checked);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      onChange(!checked);
    }
  };

  // Dimensions configuration matching user's reference image:
  // sm: 54px x 28px, knob 22px, travel: 26px
  // md: 64px x 32px, knob 24px, travel: 32px
  // lg: 76px x 38px, knob 30px, travel: 38px
  const config = {
    sm: {
      width: 54,
      height: 28,
      padding: 3,
      knobSize: 22,
      travel: 26,
      textOnLeft: '8px',
      textOffRight: '7px',
      fontSize: '10px',
    },
    md: {
      width: 64,
      height: 32,
      padding: 4,
      knobSize: 24,
      travel: 32,
      textOnLeft: '9px',
      textOffRight: '8px',
      fontSize: '11px',
    },
    lg: {
      width: 76,
      height: 38,
      padding: 4,
      knobSize: 30,
      travel: 38,
      textOnLeft: '11px',
      textOffRight: '10px',
      fontSize: '12px',
    },
  }[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel || title}
      title={title}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        width: `${config.width}px`,
        height: `${config.height}px`,
        padding: `${config.padding}px`,
      }}
      className={`relative inline-flex items-center shrink-0 rounded-full select-none cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0a0d24] ${
        disabled
          ? 'opacity-40 cursor-not-allowed bg-slate-800 border border-slate-700'
          : checked
          ? 'bg-[#16a34a] hover:bg-[#15803d] border border-emerald-400/40 shadow-md shadow-emerald-500/25 active:scale-95'
          : 'bg-slate-700 hover:bg-slate-600 border border-slate-600/80 shadow-inner active:scale-95'
      } ${className}`}
    >
      {/* Background Labels */}
      {checked ? (
        <span
          style={{
            left: config.textOnLeft,
            fontSize: config.fontSize,
          }}
          className="absolute font-black tracking-wider text-white select-none pointer-events-none uppercase leading-none drop-shadow-xs"
        >
          {labelOn}
        </span>
      ) : (
        <span
          style={{
            right: config.textOffRight,
            fontSize: config.fontSize,
          }}
          className="absolute font-black tracking-wider text-slate-200 select-none pointer-events-none uppercase leading-none"
        >
          {labelOff}
        </span>
      )}

      {/* Solid Pure White Circular Knob */}
      <span
        aria-hidden="true"
        style={{
          width: `${config.knobSize}px`,
          height: `${config.knobSize}px`,
          transform: checked ? `translateX(${config.travel}px)` : 'translateX(0px)',
          transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="pointer-events-none inline-block rounded-full bg-white shadow-md shadow-black/40 shrink-0"
      />
    </button>
  );
}

export default SuperadminFeaturesToggleSwitch;
