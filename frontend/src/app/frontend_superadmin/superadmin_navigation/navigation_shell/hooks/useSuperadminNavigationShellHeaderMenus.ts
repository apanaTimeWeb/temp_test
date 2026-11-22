// RESPONSIBILITY: Own module-local state or interaction logic for navigation shell; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_navigation/navigation_shell/hooks/useSuperadminNavigationShellHeaderMenus.ts -> local state/typed dependencies -> returned state and actions.
'use client';
import { useEffect, useRef, useState } from 'react';

/** Owns the header notification/quick-add menu state, outside-click dismissal, Escape dismissal, and focus restoration. 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminNavigationShellHeaderMenus() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const quickAddButtonRef = useRef<HTMLButtonElement>(null);

  // Effect contract: subscribe to outside-click and Escape dismissal only while the header is mounted; restore focus to the menu trigger on Escape.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false);
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) setQuickAddOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (notifOpen) { setNotifOpen(false); notificationButtonRef.current?.focus(); }
      if (quickAddOpen) { setQuickAddOpen(false); quickAddButtonRef.current?.focus(); }
    };
    document.addEventListener('keydown', handleEscape);
    return () => { document.removeEventListener('mousedown', handleClickOutside); document.removeEventListener('keydown', handleEscape); };
  }, [notifOpen, quickAddOpen]);

  return { notifOpen, setNotifOpen, quickAddOpen, setQuickAddOpen, notifRef, quickAddRef, notificationButtonRef, quickAddButtonRef };
}
