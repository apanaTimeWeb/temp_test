/** Consolidated module regression suites. Each original suite remains isolated under its named describe block. */
import { act, beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { mswTestServer } from '@/app/frontend_admin/test/mswServer';
import { fetchAdminSystem } from '@/app/frontend_admin/admin_system/system_settings/api/admin_system_settings_api';
import { ADMIN_SYSTEM_MSW_HANDLERS } from '@/app/frontend_admin/admin_system/system_settings/mocks/AdminSystemSettingsMSWHandlers';
import { ADMIN_SYSTEM_SETTINGS_API, ADMIN_SYSTEM_SETTINGS_ROUTES } from '@/app/frontend_admin/admin_system/system_settings/config/admin_system_settings.url_config';
import { maskSensitiveEmail as maskAdminSystemEmail, maskSensitivePhone as maskAdminSystemPhone } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_utils/AdminApplicationInfrastructureMaskSensitiveContact';
import { ADMIN_SYSTEM_SETTINGS_CATEGORIES } from '@/app/frontend_admin/admin_system/system_settings/config/admin_system_settings.url_config';
import AdminSystemSettingsCanonicalDestinationCard from '@/app/frontend_admin/admin_system/system_settings/components/AdminSystemSettingsCanonicalDestinationCard';
import { ADMIN_ROUTES } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_constants/AdminApplicationRoutes';
import { createAdminSystemSettingsSchema } from '@/app/frontend_admin/admin_system/system_settings/api/admin_system_settings_api';
import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import AdminSystemSelect from '@/app/frontend_admin/components/ui/select/Select';
import AdminSystemSelectContent from '@/app/frontend_admin/components/ui/select/SelectContent';
import AdminSystemSelectItem from '@/app/frontend_admin/components/ui/select/SelectItem';
import AdminSystemSelectTrigger from '@/app/frontend_admin/components/ui/select/SelectTrigger';
import AdminSystemSelectValue from '@/app/frontend_admin/components/ui/select/SelectValue';
import { AdminSystemButton } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveButton';
import { AdminSystemCard } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCard';
import { AdminSystemCardTitle } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveCardTitle';
import { ADMIN_SYSTEM_SETTINGS_QUERY_KEYS } from '@/app/frontend_admin/admin_system/system_settings/api/admin_system_settings.query_keys';
import toast from 'sonner';
import { getCurrentUser } from '@/app/frontend_admin/lib/auth';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import useAdminSystemSettingsPage from '@/app/frontend_admin/admin_system/system_settings/hooks/useAdminSystemSettingsPage';
import { AdminSystemRoute } from '@/app/frontend_admin/admin_system/system_settings/components/AdminSystemSettingsRoute';

const { mockReplace, mockPush, mockUsePathname, mockUseSearchParams } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockPush: vi.fn(),
  mockUsePathname: vi.fn(() => '/admin/admin_system/system_settings'),
  mockUseSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('next/navigation', () => ({ usePathname: mockUsePathname, useSearchParams: mockUseSearchParams, useRouter: () => ({ replace: mockReplace, push: mockPush }) }));
vi.mock('@/app/frontend_admin/lib/auth', () => ({ getCurrentUser: vi.fn() }));
vi.mock('@/app/frontend_admin/lib/runtimeFeatures', () => ({ isFrontendDemoModeEnabled: vi.fn() }));
vi.mock('sonner', () => ({ default: { info: vi.fn(), error: vi.fn(), success: vi.fn() } }));

describe('Original suite: AdminSystemSettingsApi.test.ts', () => {
  describe('fetchAdminSystem frontend contract boundary', () => {
    afterEach(() => vi.unstubAllEnvs());

    it('unwraps the existing API envelope and accepts the empty, contract-safe fixture', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
      mswTestServer.use(...ADMIN_SYSTEM_MSW_HANDLERS);
      await expect(fetchAdminSystem()).resolves.toEqual([]);
    });

    it('rejects a response shape that contradicts the current frontend schema', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost');
      mswTestServer.use(http.get(ADMIN_SYSTEM_SETTINGS_API.LIST, () => HttpResponse.json({ success: true, message: 'Malformed test response.', data: { records: [] }, requestId: 'test-system-settings-malformed' })));
      await expect(fetchAdminSystem()).rejects.toThrow();
    });
  });
});

describe('Original suite: AdminSystemSettingsMaskSensitiveData.test.ts', () => {
  describe('AdminSystemMaskSensitiveData', () => {
    it('masks email addresses while retaining the domain', () => {
      expect(maskAdminSystemEmail('student@example.test')).toBe('s*****t@example.test');
      expect(maskAdminSystemEmail('a@example.test')).toBe('*@example.test');
      expect(maskAdminSystemEmail('ab@example.test')).toBe('a*@example.test');
      expect(maskAdminSystemEmail(undefined)).toBe('—');
    });
    it('masks phone numbers and handles international prefixes', () => {
      expect(maskAdminSystemPhone('+91 98765 43210')).toBe('98****3210');
      expect(maskAdminSystemPhone('1234')).toBe('****');
      expect(maskAdminSystemPhone('12345')).toBe('1****');
      expect(maskAdminSystemPhone('123456')).toBe('1*****');
      expect(maskAdminSystemPhone('1234567')).toBe('12*4567');
      expect(maskAdminSystemPhone(null)).toBe('—');
    });
  });
});

describe('Original suite: AdminSystemSettingsRegistry.test.ts', () => {
  describe('Admin System settings registry', () => {
    it('provides unique, non-empty settings categories', () => {
      const categoryIds = ADMIN_SYSTEM_SETTINGS_CATEGORIES.map((item) => item.id);
      expect(new Set(categoryIds).size).toBe(categoryIds.length);
      expect(categoryIds.length).toBeGreaterThan(0);
    });
    it('retains compatibility category IDs while canonical routes own the duplicated capabilities', () => {
      expect(ADMIN_SYSTEM_SETTINGS_CATEGORIES.map((item) => item.id)).toEqual(expect.arrayContaining(['branding', 'late-fee', 'auto-suspend', 'upi', 'notifications', 'general']));
      expect(ADMIN_ROUTES.SYSTEM_BRANDING).toBe('/admin/admin_system/system_branding');
      expect(ADMIN_ROUTES.FINANCE_LATE_FEES).toBe('/admin/admin_finance/finance_late_fees');
      expect(ADMIN_ROUTES.FINANCE_AUTO_SUSPEND).toBe('/admin/admin_finance/finance_auto_suspend');
    });
    it('renders the compatibility CTA to its canonical route owner', () => {
      render(<AdminSystemSettingsCanonicalDestinationCard title="Branding" href={ADMIN_ROUTES.SYSTEM_BRANDING} />);
      expect(screen.getByRole('link', { name: 'OPEN_CANONICAL_MODULE' }).getAttribute('href')).toBe(ADMIN_ROUTES.SYSTEM_BRANDING);
    });
  });
});

describe('Original suite: AdminSystemSettingsSchema.test.ts', () => {
  const settingsMessages = {
    appNameRequired: 'app-required', appNameTooLong: 'app-too-long',
    upiIdRequired: 'upi-required', upiIdTooLong: 'upi-too-long', apiKeyTooLong: 'api-too-long',
  };
  const validSettings = {
    appName: 'Test Library', upiId: 'test@upi', acceptCash: true, acceptUpi: true,
    acceptCard: false, acceptBank: false, apiKey: '',
  };
  const schema = createAdminSystemSettingsSchema(settingsMessages);

  describe('Admin System settings schema', () => {
    it('accepts the module-owned settings payload', () => { expect(schema.safeParse(validSettings).success).toBe(true); });
    it('validates app name and UPI ID with visible field error keys', () => {
      const result = schema.safeParse({ ...validSettings, appName: '', upiId: '' });
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues.map((issue) => issue.message)).toEqual(expect.arrayContaining(['app-required', 'upi-required']));
    });
    it('rejects oversized notification API keys without exposing or requiring a credential placeholder', () => {
      expect(schema.safeParse({ ...validSettings, apiKey: 'x'.repeat(501) }).success).toBe(false);
      expect(schema.safeParse({ ...validSettings, apiKey: '' }).success).toBe(true);
    });
  });
});

describe('Original suite: AdminSystemSettingsSelect.test.tsx', () => {
  describe('AdminSystemSelect', () => {
    it('renders a native select with its placeholder and option children', () => {
      render(
        <AdminSystemSelect defaultValue="all">
          <AdminSystemSelectTrigger aria-label="Shift" />
          <AdminSystemSelectContent>
            <AdminSystemSelectValue placeholder="All shifts" />
            <AdminSystemSelectItem value="all">All shifts</AdminSystemSelectItem>
            <AdminSystemSelectItem value="morning">Morning</AdminSystemSelectItem>
          </AdminSystemSelectContent>
        </AdminSystemSelect>,
      );

      const select = screen.getByRole('combobox', { name: 'Shift' }) as HTMLSelectElement;
      expect(select.value).toBe('all');
      expect(select.querySelectorAll('option')).toHaveLength(3);
      expect(select.querySelector('option[value=""]')?.textContent).toBe('All shifts');
    });

    it('updates uncontrolled state and notifies the caller when the option changes', () => {
      const onValueChange = vi.fn();
      render(
        <AdminSystemSelect defaultValue="all" onValueChange={onValueChange}>
          <AdminSystemSelectTrigger aria-label="Shift" />
          <AdminSystemSelectContent>
            <AdminSystemSelectValue placeholder="All shifts" />
            <AdminSystemSelectItem value="all">All shifts</AdminSystemSelectItem>
            <AdminSystemSelectItem value="morning">Morning</AdminSystemSelectItem>
          </AdminSystemSelectContent>
        </AdminSystemSelect>,
      );

      fireEvent.change(screen.getByRole('combobox', { name: 'Shift' }), { target: { value: 'morning' } });
      expect(onValueChange).toHaveBeenCalledWith('morning');
      expect((screen.getByRole('combobox', { name: 'Shift' }) as HTMLSelectElement).value).toBe('morning');
    });
  });
});

describe('Original suite: AdminSystemSettingsSharedPrimitives.test.tsx', () => {
  describe('Admin System shared UI primitives', () => {
    it('maps module button variants to canonical global semantic classes', () => {
      render(<AdminSystemButton variant="primary" size="sm">Save settings</AdminSystemButton>);
      const button = screen.getByRole('button', { name: 'Save settings' });
      expect(button.className).toContain('admin-btn-primary');
      expect(button.className).toContain('admin-btn-sm');
      expect(button.className).not.toContain('sys-btn-primary');
    });

    it('composes cards from the shared global card and section-title primitives', () => {
      render(
        <AdminSystemCard>
          <AdminSystemCardTitle>System overview</AdminSystemCardTitle>
        </AdminSystemCard>,
      );
      expect(screen.getByText('System overview').className).toContain('admin-section-title');
      expect(screen.getByText('System overview').parentElement?.className).toContain('admin-card');
    });
  });
});

describe('Original suite: AdminSystemSettingsUrlConfig.test.ts', () => {
  describe('admin_system_settings canonical route/API/query contract', () => {
    it('preserves the observed settings route and existing host destinations', () => {
      expect(ADMIN_SYSTEM_SETTINGS_ROUTES.route).toBe('/admin/admin_system/system_settings');
      expect(ADMIN_SYSTEM_SETTINGS_ROUTES.AUTH_LOGIN).toBe('/auth/login');
      expect(ADMIN_SYSTEM_SETTINGS_ROUTES.ACCESS_DENIED).toBe('/403');
      expect(ADMIN_SYSTEM_SETTINGS_ROUTES.SEAT_MANAGEMENT).toBe('/admin/admin_seats_shifts_lockers/seats_management');
    });
    it('retains the source-observed list endpoint without claiming the DTO is live-verified', () => {
      expect(ADMIN_SYSTEM_SETTINGS_API.LIST).toBe('/api/v1/admin/system');
    });
    it('isolates settings cache keys under the module namespace', () => {
      expect(ADMIN_SYSTEM_SETTINGS_QUERY_KEYS.all).toEqual(['admin_system_settings']);
      expect(ADMIN_SYSTEM_SETTINGS_QUERY_KEYS.list({ enabled: true })).toEqual(['admin_system_settings', 'list', { enabled: true }]);
    });
  });
});


describe('Admin System settings hook', () => {
  beforeEach(() => { vi.clearAllMocks(); mockUseSearchParams.mockReturnValue(new URLSearchParams()); vi.mocked(isFrontendDemoModeEnabled).mockReturnValue(false); });
  it('keeps settings credentials empty and blocks live saves without a verified contract', () => {
    const { result } = renderHook(() => useAdminSystemSettingsPage());
    expect(result.current.form.apiKey).toBe('');
    expect(result.current.form.appName).toBe('');
    expect(result.current.form).not.toHaveProperty('gracePeriod');
    act(() => result.current.handleSave());
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith('SETTINGS_SAVE_BLOCKED', { id: 'admin-system-settings-save-blocked' });
  });
  it('reads legacy settings view query values and preserves unrelated query parameters when navigating', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('keep=1&view=late-fee'));
    const { result } = renderHook(() => useAdminSystemSettingsPage());
    expect(result.current.active).toBe('late-fee');
    act(() => result.current.setActive('general'));
    expect(mockPush).toHaveBeenCalledWith('/admin/admin_system/system_settings?keep=1&view=general', { scroll: false });
  });
});

describe('AdminSystemRoute', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.mocked(isFrontendDemoModeEnabled).mockReturnValue(false); });
  it('allows explicitly enabled development demo mode without inventing a session', async () => {
    vi.mocked(isFrontendDemoModeEnabled).mockReturnValue(true);
    render(<AdminSystemRoute><p>System content</p></AdminSystemRoute>);
    expect(screen.getByText('System content')).toBeTruthy();
    await waitFor(() => expect(getCurrentUser).not.toHaveBeenCalled());
    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.queryByRole('navigation')).toBeNull();
  });
  it('keeps authorized host users on the route without creating a duplicate shell', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user-1', role: 'admin', name: 'Admin' });
    render(<AdminSystemRoute><p>System content</p></AdminSystemRoute>);
    expect(screen.queryByText('System content')).toBeNull();
    expect(screen.getByText('ACCESS_CHECKING')).toBeTruthy();
    await waitFor(() => expect(screen.getByText('System content')).toBeTruthy());
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalled();
    expect(screen.queryByRole('navigation')).toBeNull();
  });
  it('redirects an unauthenticated live user to login with the return path', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    render(<AdminSystemRoute><p>System content</p></AdminSystemRoute>);
    expect(screen.queryByText('System content')).toBeNull();
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/auth/login?returnTo=%2Fadmin%2Fadmin_system%2Fsystem_settings&reason=unauthenticated'));
    expect(screen.queryByText('System content')).toBeNull();
  });
  it('redirects authenticated users without an allowed role to forbidden', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user-2', role: 'trainer' });
    render(<AdminSystemRoute><p>System content</p></AdminSystemRoute>);
    expect(screen.queryByText('System content')).toBeNull();
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/403'));
    expect(screen.queryByText('System content')).toBeNull();
  });
});
