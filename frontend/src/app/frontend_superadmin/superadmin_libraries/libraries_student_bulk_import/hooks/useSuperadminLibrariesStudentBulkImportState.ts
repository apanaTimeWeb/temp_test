// RESPONSIBILITY: Own local file/import-row/filter state for the student bulk-import preview; it does not create student records or call a live import API.
// FLOW: Bulk-import page -> module-owned state hook -> local selected-file and parsed-preview state -> validation/results UI.
import { useState } from 'react';
import type { SuperadminSystemBulkImportRow, SuperadminSystemBulkImportRowStatus } from '../types/SuperadminLibrariesOnboardingSetupStudentBulkImportTypes';

/**
 * Returns local file, row, status, filter, and URL-hydration state. No student records are imported.
 * @returns Module-local UI state and stable React state setters.
 
 * @param initialStatusMessage - Input supplied by the caller under the declared TypeScript contract.
 */
export function useSuperadminLibrariesStudentBulkImportState(initialStatusMessage: string) {
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<SuperadminSystemBulkImportRow[]>([]);
  const [statusMessage, setStatusMessage] = useState(initialStatusMessage);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<'all' | SuperadminSystemBulkImportRowStatus>('all');
  const [urlStateReady, setUrlStateReady] = useState(false);
  return { fileName, setFileName, rows, setRows, statusMessage, setStatusMessage, errorMessage, setErrorMessage, filter, setFilter, urlStateReady, setUrlStateReady };
}
