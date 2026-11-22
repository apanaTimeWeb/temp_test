// RESPONSIBILITY: Own module-local state or interaction logic for navigation shell; it does not imply persistence beyond verified contracts.
// FLOW: Feature component -> superadmin_navigation/navigation_shell/hooks/useSuperadminNavigationShellCommandPalette.ts -> local state/typed dependencies -> returned state and actions.
'use client';
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_NAVIGATION_NAV_ITEMS } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellItems';
import { SUPERADMIN_NAVIGATION_OPEN_COMMAND_PALETTE_EVENT } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellCommandPaletteConstants';

/** Owns command-palette search, keyboard navigation, shortcut help, global listeners, and focus restoration. 
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function useSuperadminNavigationShellCommandPalette() {
  const t = useTranslations('SUPERADMIN_SHELL');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const shortcutsCloseRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const wasShortcutsOpenRef = useRef(false);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return SUPERADMIN_NAVIGATION_NAV_ITEMS.filter((item) => {
      const label = t(item.labelKey).toLocaleLowerCase();
      return !normalized || `${label} ${item.href}`.toLocaleLowerCase().includes(normalized);
    });
  }, [query, t]);

  const openPalette = useCallback(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQuery(''); setActiveIndex(0); setIsShortcutsOpen(false); setIsOpen(true);
  }, []);
  const closePalette = useCallback(() => { setIsOpen(false); setQuery(''); }, []);
  const closeShortcuts = useCallback(() => setIsShortcutsOpen(false), []);

  // Effect contract: register global keyboard shortcuts and the header-trigger event, then remove both listeners during cleanup.
  useEffect(() => {
    const openFromHeader = () => openPalette();
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const isTextEntry = !!target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openPalette(); return; }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        const activeForm = target?.closest('form') ?? document.querySelector<HTMLFormElement>('form:focus-within');
        if (activeForm) { event.preventDefault(); activeForm.requestSubmit(); }
        return;
      }
      if (event.key === '?' && !isTextEntry) {
        event.preventDefault(); openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        setIsOpen(false); setIsShortcutsOpen(true); return;
      }
      if (event.key === 'Escape') { if (isOpen) closePalette(); if (isShortcutsOpen) closeShortcuts(); }
    };
    window.addEventListener(SUPERADMIN_NAVIGATION_OPEN_COMMAND_PALETTE_EVENT, openFromHeader);
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener(SUPERADMIN_NAVIGATION_OPEN_COMMAND_PALETTE_EVENT, openFromHeader);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [closePalette, closeShortcuts, isOpen, isShortcutsOpen, openPalette]);

  // Effect contract: focus the search field on open and restore focus to the opener on close.
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
    else if (wasOpenRef.current) openerRef.current?.focus();
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // Effect contract: return focus to the shortcut-help trigger after the help overlay closes.
  useEffect(() => {
    if (isShortcutsOpen) { wasShortcutsOpenRef.current = true; shortcutsCloseRef.current?.focus(); return; }
    if (wasShortcutsOpenRef.current) openerRef.current?.focus();
    wasShortcutsOpenRef.current = false;
  }, [isShortcutsOpen]);

  const trapDialogFocus = useCallback((event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from<HTMLElement>(event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.getAttribute('aria-hidden') !== 'true');
    const first = focusable[0]; const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, []);

  const selectResult = useCallback((href: string) => { closePalette(); router.push(href); }, [closePalette, router]);
  const handleInputKeyDown = useCallback((event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex((current) => results.length ? (current + 1) % results.length : 0); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex((current) => results.length ? (current - 1 + results.length) % results.length : 0); }
    else if (event.key === 'Enter' && results[activeIndex]) { event.preventDefault(); selectResult(results[activeIndex].href); }
  }, [activeIndex, results, selectResult]);

  return { t, isOpen, isShortcutsOpen, query, setQuery, activeIndex, setActiveIndex, results, inputRef, shortcutsCloseRef, closePalette, closeShortcuts, selectResult, handleInputKeyDown, trapDialogFocus };
}
