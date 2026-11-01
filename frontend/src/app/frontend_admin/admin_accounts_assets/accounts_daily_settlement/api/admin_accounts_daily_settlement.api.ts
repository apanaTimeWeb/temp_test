// api/admin_accounts_daily_settlement.api.ts
import { apiFetch } from '@/lib/api';
import { parseApiResponseData } from '@/lib/apiSchema';
import { z } from 'zod';
import { ADMIN_ACCOUNTS_DAILY_SETTLEMENT_API } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/config/admin_accounts_daily_settlement.url_config';
import {
  DailySettlementRecordSchema,
  DailySettlementKpiSummarySchema,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/schemas/AdminAccountsDailySettlementSchemas';
import type {
  DailySettlementRecord,
  DailySettlementKpiSummary,
  DailySettlementFilterParams,
  ApproveSettlementPayload,
  FlagDiscrepancyPayload,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';

const DailySettlementListResponseSchema = z.array(DailySettlementRecordSchema);

function buildQueryString(params?: DailySettlementFilterParams): string {
  if (!params) return '';
  const query = new URLSearchParams();
  if (params.branchId && params.branchId !== 'ALL') query.set('branchId', params.branchId);
  if (params.status && params.status !== 'ALL') query.set('status', params.status);
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

/** Fetches daily settlements list filtered by branch, status, date or search query */
export async function fetchDailySettlements(params?: DailySettlementFilterParams): Promise<DailySettlementRecord[]> {
  const url = `${ADMIN_ACCOUNTS_DAILY_SETTLEMENT_API.list}${buildQueryString(params)}`;
  const payload = await apiFetch<unknown>(url);
  return parseApiResponseData(payload, DailySettlementListResponseSchema);
}

/** Fetches a single daily settlement record by ID */
export async function fetchDailySettlementDetail(id: string): Promise<DailySettlementRecord> {
  const payload = await apiFetch<unknown>(ADMIN_ACCOUNTS_DAILY_SETTLEMENT_API.detail(id));
  return parseApiResponseData(payload, DailySettlementRecordSchema);
}

/** Fetches aggregated KPI summary for daily settlements across all branches */
export async function fetchDailySettlementKpis(): Promise<DailySettlementKpiSummary> {
  const payload = await apiFetch<unknown>(ADMIN_ACCOUNTS_DAILY_SETTLEMENT_API.kpis);
  return parseApiResponseData(payload, DailySettlementKpiSummarySchema);
}

/** Approves a manager cash handover with verified cash amount */
export async function approveDailySettlement(payload: ApproveSettlementPayload): Promise<DailySettlementRecord> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `adm-appr-${Date.now()}`;
  const response = await apiFetch<unknown>(ADMIN_ACCOUNTS_DAILY_SETTLEMENT_API.approve(payload.settlementId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      verifiedCashAmount: payload.verifiedCashAmount,
      adminNotes: payload.adminNotes,
    }),
  });
  return parseApiResponseData(response, DailySettlementRecordSchema);
}

/** Flags a discrepancy on a manager handover requiring audit/reconciliation */
export async function flagSettlementDiscrepancy(payload: FlagDiscrepancyPayload): Promise<DailySettlementRecord> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `adm-flag-${Date.now()}`;
  const response = await apiFetch<unknown>(ADMIN_ACCOUNTS_DAILY_SETTLEMENT_API.flagDiscrepancy(payload.settlementId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      discrepancyReason: payload.discrepancyReason,
      adminNotes: payload.adminNotes,
    }),
  });
  return parseApiResponseData(response, DailySettlementRecordSchema);
}

