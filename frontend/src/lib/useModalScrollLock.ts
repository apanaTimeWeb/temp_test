'use client';

import { useEffect } from 'react';

/**
 * Premium modal scroll lock hook:
 * 1. Locks document.body scroll while a modal is mounted/open.
 * 2. Prevents background page scrolling while the user interacts with the modal.
 * 3. Gracefully restores original body overflow when modal closes/unmounts.
 * 4. Tracks active modals with an internal counter to safely support nested dialogs.
 */
let activeModalsCount = 0;
let originalOverflowStyle = '';

export function useModalScrollLock(isOpen: boolean = true) {
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    if (activeModalsCount === 0) {
      originalOverflowStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    activeModalsCount++;

    return () => {
      activeModalsCount = Math.max(0, activeModalsCount - 1);
      if (activeModalsCount === 0) {
        document.body.style.overflow = originalOverflowStyle;
      }
    };
  }, [isOpen]);
}

export default useModalScrollLock;
