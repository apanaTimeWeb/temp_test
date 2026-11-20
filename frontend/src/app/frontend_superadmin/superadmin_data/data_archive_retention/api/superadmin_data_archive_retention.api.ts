// frontend/src/app/frontend_superadmin/superadmin_data/data_archive_retention/api/superadmin_data_archive_retention.api.ts
/**
 * @file superadmin_data_archive_retention.api.ts
 * @description API client for Retention Policies (Feature 8) and Data Archive Catalog (Feature 7).
 */

import { ARCHIVE_RETENTION_URLS } from '../config/superadmin_data_archive_retention.url_config';
import type {
  ArchiveRetentionOverview,
  RetentionRuleRecord,
  ArchivedRecordItem,
  UpdateRetentionRulePayload,
} from '../types/superadmin_data_archive_retention.types';
import {
  MOCK_ARCHIVE_OVERVIEW,
  MOCK_RETENTION_RULES,
  MOCK_ARCHIVED_RECORDS,
} from '../mocks/fixtures/superadmin_data_archive_retention.fixtures';

const IS_MOCK_ENV = process.env.NODE_ENV !== 'production';

export async function fetchArchiveOverview(): Promise<ArchiveRetentionOverview> {
  if (IS_MOCK_ENV) return Promise.resolve(MOCK_ARCHIVE_OVERVIEW);
  const res = await fetch(ARCHIVE_RETENTION_URLS.OVERVIEW);
  if (!res.ok) throw new Error(`Failed to fetch retention overview: ${res.statusText}`);
  return res.json();
}

export async function fetchRetentionRules(): Promise<RetentionRuleRecord[]> {
  if (IS_MOCK_ENV) return Promise.resolve(MOCK_RETENTION_RULES);
  const res = await fetch(ARCHIVE_RETENTION_URLS.RULES_LIST);
  if (!res.ok) throw new Error(`Failed to fetch retention rules: ${res.statusText}`);
  return res.json();
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

  const res = await fetch(ARCHIVE_RETENTION_URLS.UPDATE_RULE(payload.ruleId), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Failed to update retention rule: ${res.statusText}`);
  return res.json();
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

  const url = new URL(ARCHIVE_RETENTION_URLS.ARCHIVE_RECORDS_LIST, window.location.origin);
  if (filters?.entityType) url.searchParams.set('entityType', filters.entityType);
  if (filters?.storageTier) url.searchParams.set('storageTier', filters.storageTier);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch archived records: ${res.statusText}`);
  return res.json();
}

export async function unarchiveRecord(id: string): Promise<{ success: boolean; recordId: string }> {
  const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'idemp-unarc-' + Date.now();
  if (IS_MOCK_ENV) return Promise.resolve({ success: true, recordId: id });
  const res = await fetch(ARCHIVE_RETENTION_URLS.UNARCHIVE_RECORD(id), {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
  });
  if (!res.ok) throw new Error(`Failed to unarchive record: ${res.statusText}`);
  return res.json();
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

  const res = await fetch(ARCHIVE_RETENTION_URLS.TOGGLE_LEGAL_HOLD(id), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error(`Failed to toggle legal hold: ${res.statusText}`);
  return res.json();
}
