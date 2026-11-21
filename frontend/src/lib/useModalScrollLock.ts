'use client';

import { useEffect } from 'react';

/**
 * Premium modal scroll lock hook:
 * 1. Locks document.body and document.documentElement scroll while a modal is mounted/open.
 * 2. Prevents background page scrolling while the user interacts with the modal.
 * 3. Gracefully restores original body and html overflow when modal closes/unmounts.
 * 4. Tracks active modals with an internal counter to safely support nested dialogs.
 */
let activeModalsCount = 0;
let originalBodyOverflow = '';
let originalDocOverflow = '';

export function useModalScrollLock(isOpen: boolean = true) {
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;

    if (activeModalsCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      originalDocOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    activeModalsCount++;

    return () => {
      activeModalsCount = Math.max(0, activeModalsCount - 1);
      if (activeModalsCount === 0) {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalDocOverflow;
      }
    };
  }, [isOpen]);
}

export default useModalScrollLock;
