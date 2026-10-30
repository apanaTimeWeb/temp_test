import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import '@/app/frontend_admin/test/mswServer';

if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = HTMLDialogElement.prototype.showModal || function(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = HTMLDialogElement.prototype.close || function(this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
}

if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

const mockRouterInstance = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
};

vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>().catch(() => ({}));
  return {
    ...actual,
    useRouter: () => mockRouterInstance,
    usePathname: () => '/admin',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
  };
});

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return {
    ...actual,
    useTranslations: (namespace?: string) => {
      try {
        const t = actual.useTranslations(namespace);
        return (key: string, values?: Record<string, unknown>) => {
          try {
            return (t as (k: string, v?: unknown) => string)(key, values);
          } catch {
            if (values?.name) return `${key} ${values.name}`;
            return key;
          }
        };
      } catch {
        return (key: string, values?: Record<string, unknown>) => {
          if (values?.name) return `${key} ${values.name}`;
          return key;
        };
      }
    },
    useLocale: () => {
      try {
        return actual.useLocale();
      } catch {
        return 'en';
      }
    },
  };
});


