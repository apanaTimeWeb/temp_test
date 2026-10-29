import { describe, expect, it } from 'vitest';
import type { ManagerMembersDocumentVaultLocalFileMetadata } from '@/app/frontend_manager/manager_members/members_document_vault/types/ManagerMembersDocumentVaultLocalFileMetadata';

describe('ManagerMembersDocumentVaultLocalFileMetadata', () => {
  it('supports a minimal local draft/metadata shape without claiming a backend operation', () => {
    const document: ManagerMembersDocumentVaultLocalFileMetadata = { id: 'doc-1', name: 'policy.pdf', sizeBytes: 1024 };
    expect(Object.keys(document).length).toBeGreaterThan(0);
  });
});
