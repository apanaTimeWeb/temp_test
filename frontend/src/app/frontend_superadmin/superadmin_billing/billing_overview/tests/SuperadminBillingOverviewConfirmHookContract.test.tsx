// RESPONSIBILITY: Define source-level test coverage for billing overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_overview/tests/SuperadminBillingOverviewConfirmHookContract.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
/* @vitest-environment jsdom */
import { cleanup, act, renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { createElement, type PropsWithChildren } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import enMessages from '../locales/superadmin_billing_overview_en.json';
import hiMessages from '../locales/superadmin_billing_overview_hi.json';
import { useSuperadminBillingOverviewConfirm } from '../hooks/useSuperadminBillingOverviewConfirm.ts';

afterEach(() => { cleanup(); document.body.innerHTML = ''; vi.restoreAllMocks(); });

function renderConfirm(locale: 'en' | 'hi') {
  const messages = locale === 'hi' ? hiMessages : enMessages;
  const wrapper = ({ children }: PropsWithChildren) => createElement(NextIntlClientProvider, { locale, messages }, children);
  return renderHook(() => useSuperadminBillingOverviewConfirm(), { wrapper });
}

describe('useSuperadminBillingOverviewConfirm contract', () => {
  it('uses English translated defaults and resolves cancel as false', async () => {
    const { result } = renderConfirm('en');
    let decision!: Promise<boolean>;
    act(() => { decision = result.current('Review this action'); });
    const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
    expect(dialog.querySelector('h2')?.textContent).toBe('Confirm action');
    expect(Array.from(dialog.querySelectorAll('button')).map((button) => button.textContent)).toEqual(['Cancel', 'Continue']);
    expect(dialog.querySelector('h2 svg')).toBeNull();
    expect(dialog.querySelectorAll('button')[1].classList.contains('bg-primary')).toBe(true);
    act(() => dialog.querySelectorAll('button')[0].click());
    await expect(decision).resolves.toBe(false);
  });

  it('uses Hindi translated defaults from the active next-intl locale', async () => {
    const { result } = renderConfirm('hi');
    let decision!: Promise<boolean>;
    act(() => { decision = result.current('इस कार्रवाई की समीक्षा करें'); });
    const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
    expect(dialog.querySelector('h2')?.textContent).toBe('कार्रवाई की पुष्टि करें');
    expect(Array.from(dialog.querySelectorAll('button')).map((button) => button.textContent)).toEqual(['रद्द करें', 'जारी रखें']);
    act(() => dialog.querySelectorAll('button')[0].click());
    await expect(decision).resolves.toBe(false);
  });

  it('preserves caller label overrides and marks destructive actions', async () => {
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

  it('keeps native dialog support when showModal is available', async () => {
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

  it('uses class-based fallback geometry and restores background state after cancel', async () => {
    const background = document.createElement('main');
    background.setAttribute('aria-hidden', 'false');
    const trigger = document.createElement('button');
    trigger.textContent = 'Open confirmation';
    background.append(trigger);
    document.body.append(background);
    trigger.focus();
    const descriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function () { throw new Error('Force native modal failure for fallback contract test'); } });
    try {
      const { result } = renderConfirm('en');
      let decision!: Promise<boolean>;
      act(() => { decision = result.current('Continue?'); });
      const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
      expect(dialog.classList.contains('sa-confirm-dialog-fallback')).toBe(true);
      expect(dialog.className).not.toContain('bg-overlay/80');
      expect(dialog.style.cssText).toBe('');
      expect(background.hasAttribute('inert')).toBe(true);
      expect(background.getAttribute('aria-hidden')).toBe('true');
      act(() => dialog.querySelectorAll('button')[0].click());
      await expect(decision).resolves.toBe(false);
      expect(background.hasAttribute('inert')).toBe(false);
      expect(background.getAttribute('aria-hidden')).toBe('false');
      expect(document.activeElement).toBe(trigger);
    } finally {
      if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', descriptor);
      else delete (HTMLDialogElement.prototype as unknown as { showModal?: unknown }).showModal;
    }
  });
});
