// RESPONSIBILITY: Own the local occupancy threshold and alert toggle state for the power-management preview; no live energy system is contacted.
// FLOW: Power-management page -> module-owned state hook -> local threshold/alert state -> preview calculations.
import { useState } from 'react';

/**
 * Returns local occupancy threshold and alert-toggle state for preview calculations.
 * @returns Module-local UI state and stable React state setters.
 */
export function useSuperadminLibrariesFacilityPowerManagementState() {
  const [threshold, setThreshold] = useState(30);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  return { threshold, setThreshold, alertsEnabled, setAlertsEnabled };
}
