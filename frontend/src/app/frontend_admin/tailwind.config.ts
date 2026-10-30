import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      fontSize: {
        'page-title': 'var(--font-size-page-title)',
        'section-title': 'var(--font-size-section-title)',
        badge: 'var(--font-size-badge)',
        kpi: 'var(--font-size-kpi)',
        'table-header': 'var(--font-size-table-header)',
        body: 'var(--font-size-body)',
        caption: 'var(--font-size-caption)',
        micro: '10px',
        ui: '13px',
      },
      colors: {
        primary:'var(--primary)','primary-hover':'var(--primary-hover)','primary-subtle':'var(--primary-subtle)',
        page:'var(--bg-page)','overlay-backdrop':'var(--overlay-backdrop)',card:'var(--bg-card)',sidebar:'var(--bg-sidebar)',header:'var(--bg-header)','header-translucent':'var(--bg-header-translucent)',input:'var(--bg-input)',floating:'var(--bg-floating)',overlay:'var(--bg-overlay)',popover:'var(--bg-popover)',
        'skeleton-base':'var(--skeleton-base)','skeleton-highlight':'var(--skeleton-highlight)',
        'surface-hover':'var(--surface-hover)','surface-highlight':'var(--surface-highlight)','surface-zebra':'var(--surface-zebra)',
        'text-primary':'var(--text-primary)','text-text-secondary':'var(--text-secondary)','text-text-disabled':'var(--text-disabled)',
        'text-on-primary':'var(--text-on-primary)','text-on-danger':'var(--text-on-danger)','text-on-warning':'var(--text-on-warning)','text-on-success':'var(--text-on-success)','text-on-info':'var(--text-on-info)',
        success:'var(--success)','success-bg':'var(--success-bg)','success-text':'var(--success-text)',warning:'var(--warning)','warning-bg':'var(--warning-bg)','warning-text':'var(--warning-text)',
        danger:'var(--danger)','danger-bg':'var(--danger-bg)','danger-text':'var(--danger-text)',info:'var(--info)','info-bg':'var(--info-bg)','info-text':'var(--info-text)',
        purple:'var(--purple-text)','purple-bg':'var(--purple-bg)',
        'pay-cash':'var(--pay-cash-text)','pay-cash-bg':'var(--pay-cash-bg)','pay-upi':'var(--pay-upi-text)','pay-upi-bg':'var(--pay-upi-bg)','pay-card':'var(--pay-card-text)','pay-card-bg':'var(--pay-card-bg)','pay-bank':'var(--pay-bank-text)','pay-bank-bg':'var(--pay-bank-bg)',
        border:'var(--border)','border-focus':'var(--border-focus)','focus-ring':'var(--focus-ring)',
        'chart-primary':'var(--chart-primary)','chart-success':'var(--chart-success)','chart-danger':'var(--chart-danger)','chart-warning':'var(--chart-warning)','chart-info':'var(--chart-info)','chart-secondary':'var(--chart-secondary)','chart-grid':'var(--chart-grid)','chart-tooltip-bg':'var(--chart-tooltip-bg)',
      },
      borderRadius:{sm:'var(--radius-sm)',md:'var(--radius-md)',lg:'var(--radius-lg)',xl:'var(--radius-xl)',full:'var(--radius-full)'},
      boxShadow:{card:'var(--shadow-card)',popover:'var(--shadow-popover)',dialog:'var(--shadow-dialog)',toast:'var(--shadow-toast)'},
    },
  },
};

export default config;
