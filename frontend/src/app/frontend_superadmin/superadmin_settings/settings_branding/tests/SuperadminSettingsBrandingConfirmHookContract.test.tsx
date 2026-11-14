// RESPONSIBILITY: Define source-level test coverage for settings branding using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_branding/tests/SuperadminSettingsBrandingConfirmHookContract.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
/* @vitest-environment jsdom */
import { cleanup, act, renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { createElement, type PropsWithChildren } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import enMessages from '../locales/superadmin_settings_branding_en.json';
import hiMessages from '../locales/superadmin_settings_branding_hi.json';
import { useSuperadminSettingsBrandingConfirm } from '../hooks/useSuperadminSettingsBrandingConfirm.ts';

const EN = enMessages as unknown as Record<string, { COPY: Record<string, unknown> }>;
const HI = hiMessages as unknown as Record<string, { COPY: Record<string, unknown> }>;
const NAMESPACE = 'SUPERADMIN_SYSTEM';
afterEach(() => { cleanup(); document.body.innerHTML = ''; vi.restoreAllMocks(); });

function renderConfirm(locale: 'en' | 'hi') {
  const messages = locale === 'hi' ? hiMessages : enMessages;
  const wrapper = ({ children }: PropsWithChildren) => createElement(NextIntlClientProvider, { locale, messages }, children);
  return renderHook(() => useSuperadminSettingsBrandingConfirm(), { wrapper });
}

describe('useSuperadminSettingsBrandingConfirm contract', () => {
  it('uses active-locale defaults and resolves cancellation as false', async () => {
    for (const locale of ['en', 'hi'] as const) {
      const { result } = renderConfirm(locale);
      let decision!: Promise<boolean>;
      act(() => { decision = result.current('Review this action'); });
      const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
      const messages = locale === 'hi' ? HI : EN;
      const copy = messages[NAMESPACE].COPY;
      expect(dialog.querySelector('h2')?.textContent).toBe(copy.CONFIRM_DIALOG_TITLE);
      expect(Array.from(dialog.querySelectorAll('button')).map((button) => button.textContent)).toEqual([copy.CONFIRM_DIALOG_CANCEL, copy.CONFIRM_DIALOG_CONTINUE]);
      act(() => dialog.querySelectorAll('button')[0].click());
      await expect(decision).resolves.toBe(false);
    }
  });

  it('preserves caller overrides and destructive confirmation semantics', async () => {
    const { result } = renderConfirm('en');
    let decision!: Promise<boolean>;
    act(() => { decision = result.current('Delete sample record?', { title: 'Remove record?', cancelLabel: 'Keep it', confirmLabel: 'Remove', destructive: true }); });
    const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
    expect(dialog.querySelector('h2')?.textContent).toBe('Remove record?');
    expect(Array.from(dialog.querySelectorAll('button')).map((button) => button.textContent)).toEqual(['Keep it', 'Remove']);
    expect(dialog.querySelector('h2 svg')).toBeTruthy();
    expect(dialog.querySelectorAll('button')[1].classList.contains('bg-danger')).toBe(true);
    act(() => dialog.querySelectorAll('button')[1].click());
    await expect(decision).resolves.toBe(true);
  });

  it('supports the native dialog path', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', ''); } });
    try {
      const { result } = renderConfirm('en');
      let decision!: Promise<boolean>;
      act(() => { decision = result.current('Continue?'); });
      const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
      expect(dialog.classList.contains('sa-confirm-dialog-fallback')).toBe(false);
      act(() => dialog.querySelectorAll('button')[0].click());
      await expect(decision).resolves.toBe(false);
    } finally {
      if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', descriptor);
      else delete (HTMLDialogElement.prototype as unknown as { showModal?: unknown }).showModal;
    }
  });

  it('uses class-based fallback geometry and restores page state after cancel', async () => {
    const background = document.createElement('main');
    background.setAttribute('aria-hidden', 'false');
    const trigger = document.createElement('button');
    background.append(trigger); document.body.append(background); trigger.focus();
    const descriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function () { throw new Error('Force fallback'); } });
    try {
      const { result } = renderConfirm('en');
      let decision!: Promise<boolean>;
      act(() => { decision = result.current('Continue?'); });
      const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
      expect(dialog.classList.contains('sa-confirm-dialog-fallback')).toBe(true);
      expect(dialog.className).not.toContain('bg-overlay/80'); expect(dialog.style.cssText).toBe('');
      expect(background.hasAttribute('inert')).toBe(true); expect(background.getAttribute('aria-hidden')).toBe('true');
      act(() => dialog.querySelectorAll('button')[0].click());
      await expect(decision).resolves.toBe(false);
      expect(background.hasAttribute('inert')).toBe(false); expect(background.getAttribute('aria-hidden')).toBe('false'); expect(document.activeElement).toBe(trigger);
    } finally {
      if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', descriptor);
      else delete (HTMLDialogElement.prototype as unknown as { showModal?: unknown }).showModal;
    }
  });

  it('settles exactly once when the dialog is cancelled', async () => {
    const { result } = renderConfirm('en');
    let decision!: Promise<boolean>; act(() => { decision = result.current('Continue?'); });
    const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
    dialog.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true }));
    await expect(decision).resolves.toBe(false);
  });
});
