/**
 * Module-owned, sample-only repository implementation. Each exported collection/object is a defensive
 * snapshot of the authored fixture data; these values are not a persistence or API contract.
 */
import type { ManagerMembersDocumentVaultSampleRecord as ManagerMembersDocumentVaultSampleRecordFixture } from '@/app/frontend_manager/manager_members/members_document_vault/mocks/manager_members_document_vault_fixtures/ManagerMembersDocumentVaultSampleFixtures';
import { MANAGER_DOCUMENTS_SAMPLE_RECORDS as MANAGER_DOCUMENTS_SAMPLE_RECORDSFixture } from '@/app/frontend_manager/manager_members/members_document_vault/mocks/manager_members_document_vault_fixtures/ManagerMembersDocumentVaultSampleFixtures';

/** DATA FLOW: Module-owned sample fixtures -> defensive demo repository exports -> feature preview; sample data is not persistence. */

export type ManagerMembersDocumentVaultSampleRecord = ManagerMembersDocumentVaultSampleRecordFixture;
export const MANAGER_DOCUMENTS_SAMPLE_RECORDS = MANAGER_DOCUMENTS_SAMPLE_RECORDSFixture.map((record) => (typeof record === 'object' && record !== null ? { ...record } : record));
