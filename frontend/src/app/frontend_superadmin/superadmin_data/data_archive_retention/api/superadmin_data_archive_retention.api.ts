// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/api/superadmin_data_archive_retention.api.ts
/**
 * @file superadmin_data_archive_retention.api.ts
 * @description API client for Retention Policies (Feature 8) and Data Archive Catalog (Feature 7).
 */

import { apiFetch } from '@/lib/api';
import { ARCHIVE_RETENTION_URLS } from '@/app/frontend_superadmin/superadmin_data/data_archive_retention/config/superadmin_data_archive_retention.url_config';
import type {
  ArchiveRetentionOverview,
  RetentionRuleRecord,
  ArchivedRecordItem,
  UpdateRetentionRulePayload,
} from '@/app/frontend_superadmin/superadmin_data/data_archive_retention/types/superadmin_data_archive_retention.types';
import {
  MOCK_ARCHIVE_OVERVIEW,
  MOCK_RETENTION_RULES,
  MOCK_ARCHIVED_RECORDS,
} from '@/app/frontend_superadmin/superadmin_data/data_archive_retention/mocks/fixtures/superadmin_data_archive_retention.fixtures';

const IS_MOCK_ENV = process.env.NODE_ENV !== 'production';

export async function fetchArchiveOverview(): Promise<ArchiveRetentionOverview> {
  if (IS_MOCK_ENV) return Promise.resolve(MOCK_ARCHIVE_OVERVIEW);
  const res = await apiFetch<ArchiveRetentionOverview>(ARCHIVE_RETENTION_URLS.OVERVIEW);
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function fetchRetentionRules(): Promise<RetentionRuleRecord[]> {
  if (IS_MOCK_ENV) return Promise.resolve(MOCK_RETENTION_RULES);
  const res = await apiFetch<RetentionRuleRecord[]>(ARCHIVE_RETENTION_URLS.RULES_LIST);
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function updateRetentionRule(
  payload: UpdateRetentionRulePayload
): Promise<RetentionRuleRecord> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-rule-' + Date.now();
  if (IS_MOCK_ENV) {
    const existing = MOCK_RETENTION_RULES.find((r) => r.id === payload.ruleId);
    return Promise.resolve({
      ...existing!,
      retentionPeriodDays: payload.retentionPeriodDays,
      postRetentionAction: payload.postRetentionAction,
      targetStorageTier: payload.targetStorageTier,
      isEnabled: payload.isEnabled,
    });
  }

  const res = await apiFetch<RetentionRuleRecord>(ARCHIVE_RETENTION_URLS.UPDATE_RULE(payload.ruleId), {
    method: 'PATCH',
    idempotencyKey,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function fetchArchivedRecords(filters?: {
  entityType?: string;
  storageTier?: string;
  isLegalHold?: boolean;
}): Promise<ArchivedRecordItem[]> {
  if (IS_MOCK_ENV) {
    let result = [...MOCK_ARCHIVED_RECORDS];
    if (filters?.entityType && filters.entityType !== 'ALL') {
      result = result.filter((r) => r.entityType === filters.entityType);
    }
    if (filters?.storageTier && filters.storageTier !== 'ALL') {
      result = result.filter((r) => r.storageTier === filters.storageTier);
    }
    if (filters?.isLegalHold !== undefined) {
      result = result.filter((r) => r.isLegalHold === filters.isLegalHold);
    }
    return Promise.resolve(result);
  }

  const searchParams = new URLSearchParams();
  if (filters?.entityType) searchParams.set('entityType', filters.entityType);
  if (filters?.storageTier) searchParams.set('storageTier', filters.storageTier);
  const qs = searchParams.toString();
  const endpoint = `${ARCHIVE_RETENTION_URLS.ARCHIVE_RECORDS_LIST}${qs ? `?${qs}` : ''}`;

  const res = await apiFetch<ArchivedRecordItem[]>(endpoint);
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function unarchiveRecord(id: string): Promise<{ success: boolean; recordId: string }> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-unarc-' + Date.now();
  if (IS_MOCK_ENV) return Promise.resolve({ success: true, recordId: id });
  const res = await apiFetch<{ success: boolean; recordId: string }>(ARCHIVE_RETENTION_URLS.UNARCHIVE_RECORD(id), {
    method: 'POST',
    idempotencyKey,
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}

export async function toggleLegalHold(
  id: string,
  reason: string
): Promise<{ success: boolean; recordId: string; isLegalHold: boolean }> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-lh-' + Date.now();
  if (IS_MOCK_ENV) {
    const record = MOCK_ARCHIVED_RECORDS.find((r) => r.id === id);
    const newStatus = record ? !record.isLegalHold : true;
    return Promise.resolve({ success: true, recordId: id, isLegalHold: newStatus });
  }

  const res = await apiFetch<{ success: boolean; recordId: string; isLegalHold: boolean }>(ARCHIVE_RETENTION_URLS.TOGGLE_LEGAL_HOLD(id), {
    method: 'POST',
    idempotencyKey,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });
  if (!res.success) throw new Error(res.message);
  return res.data;
}
