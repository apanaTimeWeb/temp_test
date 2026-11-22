// RESPONSIBILITY: Own local export selection, date filters, format, and unavailable-contract feedback state; no live records are exported.
// FLOW: Data-export page -> module-owned state hook -> local manifest-selection state -> preview-only CSV manifest behavior.
import { useState } from 'react';

/**
 * Returns local export selection/date/format and unavailable-contract feedback state; no live data export is implied.
 * @returns Module-local UI state and stable React state setters.
 
 * @param initialOperationMessage - Input supplied by the caller under the declared TypeScript contract.
 */
export function useSuperadminSystemDataExportJobsState(initialOperationMessage: string) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [format] = useState<'CSV'>('CSV');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [operationMessage, setOperationMessage] = useState(initialOperationMessage);
  return { selected, setSelected, format, dateFrom, setDateFrom, dateTo, setDateTo, operationMessage, setOperationMessage };
}
