import type React from 'react';
import type { ReactNode } from 'react';
import type { AdminAssetsRegisterScenario } from '@/app/frontend_admin/admin_accounts_assets/assets_register/tests/harness/bootstrap';

export interface AdminAssetsRegisterDeleteConfirmationDialogProps { open: boolean; title: string; description: string; confirmLabel: string; cancelLabel: string; onConfirm: () => void; onCancel: () => void; }

export interface AdminAssetsRegisterErrorBoundaryProps {
  children: React.ReactNode;
  fallbackTitle: string;
  fallbackDescription: string;
  retryLabel: string;
}

export interface AdminAssetsRegisterErrorBoundaryState { hasError: boolean; }

export interface AdminAssetsRegisterSummaryLabels { totalAssets: string; currentValue: string; underMaintenance: string; disposed: string; }

export interface AdminAssetsRegisterHarnessProps { children: ReactNode; scenario?: AdminAssetsRegisterScenario; }

export type AdminAssetsRegisterAssetStatus = 'active' | 'maintenance' | 'disposed';
