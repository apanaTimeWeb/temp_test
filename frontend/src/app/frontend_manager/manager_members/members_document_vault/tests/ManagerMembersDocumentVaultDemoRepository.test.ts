import { describe, expect, it } from 'vitest';
import { MANAGER_DOCUMENTS_SAMPLE_RECORDS } from '@/app/frontend_manager/manager_members/members_document_vault/hooks/ManagerMembersDocumentVaultDemoRepository';
import { MANAGER_DOCUMENTS_SAMPLE_RECORDS as FIXTURE_SOURCE } from '@/app/frontend_manager/manager_members/members_document_vault/mocks/manager_members_document_vault_fixtures/ManagerMembersDocumentVaultSampleFixtures';

describe('ManagerMembersDocumentVaultDemoRepository', () => {
  it('returns a defensive sample snapshot rather than aliasing fixture objects', () => {
    expect(MANAGER_DOCUMENTS_SAMPLE_RECORDS).not.toBe(FIXTURE_SOURCE);
    expect(MANAGER_DOCUMENTS_SAMPLE_RECORDS[0]).not.toBe(FIXTURE_SOURCE[0]);
    expect(MANAGER_DOCUMENTS_SAMPLE_RECORDS[0]).toEqual(FIXTURE_SOURCE[0]);
  });
});
