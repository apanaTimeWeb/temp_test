'use client';
// RESPONSIBILITY: Own local seat/locker thresholds and alert toggle state for the capacity-scaling recommendations preview; no live scaling action is executed.
// FLOW: Capacity-scaling page -> module-owned state hook -> local threshold state -> recommendation preview.
import { useState } from 'react';

/**
 * Returns local seat/locker threshold and alert-toggle state for recommendations preview.
 * @returns Module-local UI state and stable React state setters.
 */
export function useSuperadminLibrariesCapacityScalingRecommendationsState() {
  const [seatThreshold, setSeatThreshold] = useState(90);
  const [lockerThreshold, setLockerThreshold] = useState(85);
  const [alertEnabled, setAlertEnabled] = useState(true);
  return { seatThreshold, setSeatThreshold, lockerThreshold, setLockerThreshold, alertEnabled, setAlertEnabled };
}
