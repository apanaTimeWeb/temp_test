/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './public_auth/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        page: 'var(--color-bg-page, #050505)',
        sidebar: 'var(--color-bg-sidebar, #050505)',
        card: 'var(--color-bg-card, #111111)',
        input: 'var(--color-bg-input, #1A1A1A)',
        border: 'var(--color-border, #27272A)',
        primary: {
          DEFAULT: 'var(--color-primary, #FACC15)',
          hover: 'var(--color-primary-hover, #EAB308)',
          subtle: 'var(--color-primary-subtle, rgba(250, 204, 21, 0.15))',
        },
        'on-primary': 'var(--color-text-on-primary, #111111)',
        secondary: 'var(--color-text-secondary, #A1A1AA)',
        disabled: 'var(--color-text-disabled, #52525B)',
        danger: {
          DEFAULT: 'var(--color-danger, #B91C1C)',
          bg: 'var(--color-danger-bg, #450A0A)',
        },
        success: {
          DEFAULT: 'var(--color-success, #15803D)',
          bg: 'var(--color-success-bg, #064E3B)',
        },
        warning: 'var(--color-warning, #F59E0B)',
        info: 'var(--color-info, #1D4ED8)',
        surface: {
          hover: 'var(--color-surface-hover, rgba(250, 204, 21, 0.08))',
          highlight: 'var(--color-surface-highlight, rgba(250, 204, 21, 0.05))',
        },
        skeleton: {
          base: 'var(--color-skeleton-base, #111111)',
          highlight: 'var(--color-skeleton-highlight, #1A1A1A)',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4)',
        dialog: '0 20px 60px rgba(0,0,0,0.6)',
      },
      transitionDuration: {
        base: '200ms',
      },
    },
  },
  plugins: [],
};
