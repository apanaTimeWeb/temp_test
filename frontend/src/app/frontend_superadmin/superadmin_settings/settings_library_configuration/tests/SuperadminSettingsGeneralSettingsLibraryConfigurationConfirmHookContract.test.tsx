// RESPONSIBILITY: Define source-level test coverage for settings library configuration using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_settings/settings_library_configuration/tests/SuperadminSettingsGeneralSettingsLibraryConfigurationConfirmHookContract.test.tsx -> module-local test harness/fixtures -> assertions and regression evidence.
/* @vitest-environment jsdom */
import { cleanup, act, renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { createElement, type PropsWithChildren } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import enMessages from '../locales/superadmin_settings_general_settings_library_configuration_en.json';
import hiMessages from '../locales/superadmin_settings_general_settings_library_configuration_hi.json';
import { useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm } from '../hooks/useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm.ts';

const EN = enMessages as unknown as Record<string, { COPY: Record<string, unknown> }>;
const HI = hiMessages as unknown as Record<string, { COPY: Record<string, unknown> }>;
const NAMESPACE = 'SUPERADMIN_SYSTEM';
afterEach(() => { cleanup(); document.body.innerHTML = ''; vi.restoreAllMocks(); });

function renderConfirm(locale: 'en' | 'hi') {
  const messages = locale === 'hi' ? hiMessages : enMessages;
  const wrapper = ({ children }: PropsWithChildren) => createElement(NextIntlClientProvider as any, { locale, messages, children });
  return renderHook(() => useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm(), { wrapper });
}

describe('useSuperadminSettingsGeneralSettingsLibraryConfigurationConfirm contract', () => {
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
    act(() => {
      decision = result.current('Custom title', {
        title: 'Custom title',
        description: 'Custom message',
        confirmLabel: 'Proceed',
        cancelLabel: 'Abort',
        isDestructive: true,
      });
    });
    const dialog = document.querySelector('dialog[open]') as HTMLDialogElement;
    expect(dialog.querySelector('h2')?.textContent).toBe('Custom title');
    expect(dialog.querySelector('p')?.textContent).toBe('Custom message');
    expect(Array.from(dialog.querySelectorAll('button')).map((button) => button.textContent)).toEqual(['Abort', 'Proceed']);
    act(() => dialog.querySelectorAll('button')[1].click());
    await expect(decision).resolves.toBe(true);
  });
});
