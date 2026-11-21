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

  // Dimensions configuration matching the user's reference image
  const sizeStyles = {
    sm: {
      container: 'w-14 h-7 p-0.5',
      knob: 'w-5 h-5',
      translate: checked ? 'translate-x-7' : 'translate-x-0.5',
      textOn: 'left-2 text-[10px]',
      textOff: 'right-2 text-[9px]',
    },
    md: {
      container: 'w-16 h-8 p-1',
      knob: 'w-6 h-6',
      translate: checked ? 'translate-x-8' : 'translate-x-0.5',
      textOn: 'left-2.5 text-xs',
      textOff: 'right-2 text-[11px]',
    },
    lg: {
      container: 'w-20 h-10 p-1',
      knob: 'w-8 h-8',
      translate: checked ? 'translate-x-10' : 'translate-x-0.5',
      textOn: 'left-3 text-sm',
      textOff: 'right-2.5 text-xs',
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
      className={`relative inline-flex items-center shrink-0 rounded-full transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0a0d24] ${
        sizeStyles.container
      } ${
        disabled
          ? 'opacity-40 cursor-not-allowed bg-slate-800 border border-slate-700'
          : checked
          ? 'bg-[#16a34a] hover:bg-[#15803d] border border-emerald-400/50 shadow-md shadow-emerald-500/25 active:scale-95'
          : 'bg-slate-700/90 hover:bg-slate-600/90 border border-slate-600 shadow-inner active:scale-95'
      } ${className}`}
    >
      {/* Background Labels */}
      {checked ? (
        <span
          className={`absolute font-black tracking-wider text-white select-none ${sizeStyles.textOn}`}
        >
          {labelOn}
        </span>
      ) : (
        <span
          className={`absolute font-black tracking-wider text-slate-300 select-none ${sizeStyles.textOff}`}
        >
          {labelOff}
        </span>
      )}

      {/* Solid Pure White Circular Knob */}
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block rounded-full bg-white shadow-md shadow-black/40 transform transition-transform duration-200 ease-in-out ${
          sizeStyles.knob
        } ${sizeStyles.translate}`}
      />
    </button>
  );
}

export default SuperadminFeaturesToggleSwitch;