import type { AdminCouponsCoupon, AdminCouponsFormOutput } from '@/app/frontend_admin/admin_members/members_coupons/schemas/AdminMembersCouponsSchema';
import type { AdminMembersCouponsScenario } from '@/app/frontend_admin/admin_members/members_coupons/tests/harness/bootstrap';
import type { DataGridColumn } from '@/app/frontend_admin/components/ui/data-grid/DataGrid';
import type { ReactNode } from 'react';

export type AdminCouponsCreateDialogIntent = 'draft' | 'create';

export interface AdminCouponsCreateDialogProps {
  open: boolean;
  isDemoMode: boolean;
  intent: AdminCouponsCreateDialogIntent;
  onOpenChange: (open: boolean) => void;
  onCreateDemoCoupon: (values: AdminCouponsFormOutput) => void;
  deleteOpen?: boolean;
  couponCode?: string;
  onDeleteOpenChange?: (open: boolean) => void;
  onConfirmDelete?: () => void;
}

export interface AdminCouponsOverviewSectionProps {
  isDemoMode: boolean;
  onCreateCoupon: () => void;
  onValidateDraft: () => void;
  coupons: readonly AdminCouponsCoupon[];
  columns: readonly DataGridColumn<AdminCouponsCoupon>[];
  isError: boolean;
  isPending: boolean;
  onRetry: () => void;
}

export interface AdminMembersCouponsHarnessProps {
  children: ReactNode;
  scenario?: AdminMembersCouponsScenario;
}

export type AdminCouponsCouponAmountUnit = 'minor' | 'major';
export type AdminCouponsFormValuesType = 'Flat' | 'Percent';
