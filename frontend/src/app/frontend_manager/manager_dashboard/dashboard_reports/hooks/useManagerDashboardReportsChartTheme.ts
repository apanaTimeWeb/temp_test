'use client';
// RESPONSIBILITY: Provide theme-aware chart colors and configuration for ApexCharts conforming to WEB_FRONTEND_UI_UX_DESIGN.md Section 10.

import { useEffect, useState } from 'react';

export interface ManagerReportsChartTheme {
  isDark: boolean;
  primary: string;
  success: string;
  warning: string;
  info: string;
  secondary: string;
  danger: string;
  grid: string;
  tooltipBg: string;
  textSecondary: string;
  textPrimary: string;
  cardBg: string;
  donutSliceColors: string[];
}

const DARK_THEME: ManagerReportsChartTheme = {
  isDark: true,
  primary: '#FACC15',
  success: '#4ADE80',
  warning: '#F97316',
  info: '#38BDF8',
  secondary: '#94A3B8',
  danger: '#F87171',
  grid: '#334155',
  tooltipBg: '#1E293B',
  textSecondary: '#A1A1AA',
  textPrimary: '#FFFFFF',
  cardBg: '#111111',
  donutSliceColors: ['#FACC15', '#4ADE80', '#F97316', '#38BDF8', '#94A3B8', '#F87171'],
};

const LIGHT_THEME: ManagerReportsChartTheme = {
  isDark: false,
  primary: '#EAB308',
  success: '#16A34A',
  warning: '#D97706',
  info: '#0284C7',
  secondary: '#64748B',
  danger: '#DC2626',
  grid: '#E2E8F0',
  tooltipBg: '#FFFFFF',
  textSecondary: '#52525B',
  textPrimary: '#000000',
  cardBg: '#FFFFFF',
  donutSliceColors: ['#EAB308', '#16A34A', '#D97706', '#0284C7', '#64748B', '#DC2626'],
};

export function useManagerDashboardReportsChartTheme(): ManagerReportsChartTheme {
  const [theme, setTheme] = useState<ManagerReportsChartTheme>(DARK_THEME);

  useEffect(() => {
    const updateTheme = () => {
      const isLight = document.documentElement.classList.contains('light');
      setTheme(isLight ? LIGHT_THEME : DARK_THEME);
    };

    updateTheme();

    const observer = new MutationObserver(() => updateTheme());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}

