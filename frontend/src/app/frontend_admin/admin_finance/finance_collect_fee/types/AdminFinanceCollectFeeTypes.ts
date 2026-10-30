import type useCollectFee from '@/app/frontend_admin/admin_finance/finance_collect_fee/hooks/useAdminFinanceCollectFeePage';
import type { ReactNode } from 'react';

export const ADMIN_COLLECT_FEE_PAYMENT_MODES = ['cash', 'upi', 'card', 'bank'] as const;
export type AdminCollectFeePaymentMode = typeof ADMIN_COLLECT_FEE_PAYMENT_MODES[number];

export interface AdminCollectFeeMockStudent {
  id: number;
  name: string;
  smartId: string;
  phone: string;
  status: AdminCollectFeeMockStudentStatus;
  dueAmountMinor: number;
  plan: string;
  shift: string;
  seat: string;
  validUpto: string;
}

export type AdminCollectFeeMockStudentStatus = 'active' | 'expired' | 'suspended';

export interface AdminCollectFeePageViewProps { model: ReturnType<typeof useCollectFee>; }

export type AdminFinanceCollectFeeScenario = "ACTIVE" | "EMPTY" | "SERVER_500" | "TIMEOUT" | "UNAUTHORIZED";

export interface AdminFinanceCollectFeeHarnessProps {
  children?: ReactNode;
  scenario?: AdminFinanceCollectFeeScenario;
}

export type AdminFinanceCollectFeeCouponStatus = 'idle' | 'valid' | 'invalid' | 'blocked';
