/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        page: 'var(--color-bg-page, #050505)',
        sidebar: 'var(--color-bg-sidebar, #050505)',
        card: 'var(--color-bg-card, #111111)',
        header: 'var(--color-bg-header, #111111)',
        'header-translucent': 'var(--color-bg-header-translucent, rgba(17, 17, 17, 0.8))',
        input: 'var(--color-bg-input, #1A1A1A)',
        floating: 'var(--color-bg-floating, #1A1A1A)',
        border: 'var(--color-border, #27272A)',
        'border-focus': 'var(--color-border-focus, #FACC15)',
        popover: 'var(--color-bg-popover, #2E2E2E)',
        primary: {
          DEFAULT: 'var(--color-primary, #FACC15)',
          hover: 'var(--color-primary-hover, #EAB308)',
          subtle: 'var(--color-primary-subtle, rgba(250, 204, 21, 0.15))',
        },
        'on-primary': 'var(--color-text-on-primary, #111111)',
        'on-danger': 'var(--color-text-on-danger, #FFFFFF)',
        'on-success': 'var(--color-text-on-success, #FFFFFF)',
        'on-warning': 'var(--color-text-on-warning, #111111)',
        'on-info': 'var(--color-text-on-info, #FFFFFF)',
        secondary: 'var(--color-text-secondary, #A1A1AA)',
        disabled: 'var(--color-text-disabled, #52525B)',
        danger: {
          DEFAULT: 'var(--color-danger, #B91C1C)',
          bg: 'var(--color-danger-bg, #450A0A)',
          text: 'var(--color-danger-text, #F87171)',
        },
        success: {
          DEFAULT: 'var(--color-success, #15803D)',
          bg: 'var(--color-success-bg, #064E3B)',
          text: 'var(--color-success-text, #4ADE80)',
        },
        warning: {
          DEFAULT: 'var(--color-warning, #F59E0B)',
          bg: 'var(--color-warning-bg, #451A03)',
          text: 'var(--color-warning-text, #FBBF24)',
        },
        info: {
          DEFAULT: 'var(--color-info, #1D4ED8)',
          bg: 'var(--color-info-bg, #172554)',
          text: 'var(--color-info-text, #60A5FA)',
        },
        purple: {
          bg: 'var(--color-purple-bg, #3B0764)',
          text: 'var(--color-purple-text, #D8B4FE)',
        },
        'pay-cash': {
          bg: 'var(--pay-cash-bg, #134E4A)',
          text: 'var(--pay-cash-text, #5EEAD4)',
        },
        'pay-upi': {
          bg: 'var(--pay-upi-bg, #164E63)',
          text: 'var(--pay-upi-text, #67E8F9)',
        },
        'pay-card': {
          bg: 'var(--pay-card-bg, #1E293B)',
          text: 'var(--pay-card-text, #CBD5E1)',
        },
        'pay-bank': {
          bg: 'var(--pay-bank-bg, #0C4A6E)',
          text: 'var(--pay-bank-text, #7DD3FC)',
        },
        surface: {
          DEFAULT: 'var(--color-bg-card, #111111)',
          hover: 'var(--color-surface-hover, rgba(250, 204, 21, 0.08))',
          highlight: 'var(--color-surface-highlight, rgba(250, 204, 21, 0.05))',
          zebra: 'var(--color-surface-zebra, #141414)',
        },
        overlay: {
          DEFAULT: 'var(--color-bg-overlay, #242424)',
          backdrop: 'var(--color-overlay-backdrop, rgba(0, 0, 0, 0.6))',
        },
        skeleton: {
          base: 'var(--color-skeleton-base, #111111)',
          highlight: 'var(--color-skeleton-highlight, #1A1A1A)',
        },
      },
      boxShadow: {
        card: 'var(--shadow-card, 0 1px 3px rgba(0,0,0,0.4))',
        popover: 'var(--shadow-popover, 0 4px 16px rgba(0,0,0,0.5))',
        dialog: 'var(--shadow-dialog, 0 20px 60px rgba(0,0,0,0.6))',
        toast: 'var(--shadow-toast, 0 8px 24px rgba(0,0,0,0.5))',
      },
      transitionDuration: {
        fast: 'var(--animate-duration-fast, 150ms)',
        base: '200ms',
        slow: 'var(--animate-duration-slow, 300ms)',
        xslow: 'var(--animate-duration-xslow, 500ms)',
      },
    },
  },
  plugins: [],
};
