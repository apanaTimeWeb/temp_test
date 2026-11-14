import { fireEvent, render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, describe, expect, it } from 'vitest';
import PageClient from '../components/SuperadminLibrariesOverviewLibraryOfflineOperationsPageClient';

const originalOnLine = window.navigator.onLine;
afterEach(() => {
  Object.defineProperty(window.navigator, 'onLine', { configurable: true, value: originalOnLine });
});

describe('offline connectivity announcement', () => {
  it('announces stable online/offline status but excludes animated punctuation', async () => {
    Object.defineProperty(window.navigator, 'onLine', { configurable: true, value: false });
    const { container, unmount } = render(
      <NextIntlClientProvider locale="en" messages={{}} onError={() => undefined}>
        <PageClient />
      </NextIntlClientProvider>,
    );

    const announcement = container.querySelector('[data-testid="offline-connectivity-announcement"]');
    expect(announcement?.getAttribute('aria-live')).toBe('polite');
    expect(announcement?.querySelector('h1')?.textContent).toContain('COPY.YOU_ARE_OFFLINE');
    expect(announcement?.querySelector('.sys-offline-subtitle')).not.toBeNull();
    expect(announcement?.querySelector('.sys-offline-status-badge')).toBeNull();

    fireEvent(window, new Event('online'));
    expect(announcement?.textContent).toContain('COPY.BACK_ONLINE');
    unmount();
  });
});
