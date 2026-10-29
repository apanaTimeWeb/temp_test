import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { MANAGER_MEMBERS_DOCUMENT_VAULT_API_CONTRACT_STATUS } from '@/app/frontend_manager/manager_members/members_document_vault/api/manager_members_document_vault.api';

describe('Manager Documents storage contract boundary', () => {
  it('declares storage operations blocked instead of silently implying a working API', () => {
    expect(MANAGER_MEMBERS_DOCUMENT_VAULT_API_CONTRACT_STATUS).toBe('EXTERNAL_PRODUCT_DECISION_BLOCKED');
  });

  it('keeps sample metadata actions visibly unavailable until host contracts exist', () => {
    const moduleRootCandidates = [
      join(process.cwd(), 'src/app/frontend_manager/manager_members/members_document_vault'),
      join(process.cwd(), 'app/frontend_manager/manager_members/members_document_vault'),
      join(process.cwd(), 'frontend_manager/manager_members/members_document_vault'),
      join(process.cwd(), '..', '..'),
      join(process.cwd(), '..'),
      process.cwd(),
    ];
    const root = moduleRootCandidates.find((candidate) =>
      existsSync(join(candidate, 'config/manager_members_document_vault.url_config.ts')) &&
      existsSync(join(candidate, 'components/manager_members_document_vault_views/ManagerMembersDocumentVaultPage.tsx'))
    );
    if (!root) throw new Error('Could not locate the canonical members_document_vault module from the test working directory.');
    const source = readFileSync(join(root, 'components/manager_members_document_vault_views/ManagerMembersDocumentVaultPage.tsx'), 'utf8');
    expect(source).toContain('manager-documents-contract-warning');
    expect(source).toMatch(/<button[^>]*disabled[^>]*title=\{tManagerUi\('upload_unavailable_no_verified_host_document_storage_con_afc538'\)\}/s);
    expect(source).toMatch(/<button[^>]*disabled[^>]*title=\{tManagerUi\('download_unavailable_the_source_files_download_contract_2a0e5a'\)\}/s);
    expect(source).toMatch(/<button[^>]*disabled[^>]*title=\{tManagerUi\('delete_unavailable_no_verified_host_document_deletion_co_5d72da'\)\}/s);
  });
});
