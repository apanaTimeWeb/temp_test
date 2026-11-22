import AdminCommunicationNoticesPage from '@/app/frontend_admin/admin_communication/communication_notices/components/AdminCommunicationNoticesPage';
import { AdminBranchProvider } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import { fireEvent,render,screen } from '@testing-library/react';
import { beforeEach,describe,expect,it,vi } from 'vitest';

// Mock runtimeFeatures for demo mode
vi.mock('@/app/frontend_admin/lib/runtimeFeatures', () => ({
  isFrontendDemoModeEnabled: () => true,
}));

// Mock next-intl translations
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    if (key === 'NOTICE_DEMO_CREATED') return `Notice created: ${values?.title}`;
    if (key === 'NOTICE_STATUS_ACTIVE') return 'Active';
    return key;
  },
  useLocale: () => 'en',
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/admin/admin_communication/communication_notices',
  useSearchParams: () => new URLSearchParams(),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <AdminBranchProvider>
        {ui}
      </AdminBranchProvider>
    </QueryClientProvider>
  );
}

describe('AdminCommunicationNotices Emergency Broadcast & Network-Wide Alerts Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Emergency Broadcast action button in the notices control bar', () => {
    renderWithProviders(<AdminCommunicationNoticesPage />);

    const emergencyBtn = screen.getByTestId('admin_communication-emergency-broadcast-btn');
    expect(emergencyBtn).toBeTruthy();
    expect(emergencyBtn.textContent).toContain('Emergency Broadcast');
  });

  it('opens modal in emergency mode with quick presets for weather, holiday, and power outages', () => {
    renderWithProviders(<AdminCommunicationNoticesPage />);

    // Click emergency broadcast button
    const emergencyBtn = screen.getByTestId('admin_communication-emergency-broadcast-btn');
    fireEvent.click(emergencyBtn);

    // Modal should open with Emergency Broadcast title
    expect(screen.getByText(/Emergency Notice Broadcast/i)).toBeTruthy();
    expect(screen.getByText(/Quick Broadcast Presets/i)).toBeTruthy();

    // Verify preset buttons exist
    expect(screen.getByText(/Rain Closure/i)).toBeTruthy();
    expect(screen.getByText(/Holiday Off/i)).toBeTruthy();
    expect(screen.getByText(/Power Work/i)).toBeTruthy();
    expect(screen.getByText(/ID Checking/i)).toBeTruthy();

    // Verify multi-channel checkboxes are present
    expect(screen.getByLabelText('WhatsApp Broadcast')).toBeTruthy();
    expect(screen.getByLabelText('Email Broadcast')).toBeTruthy();
    expect(screen.getByLabelText('SMS Flash Alert')).toBeTruthy();
  });

  it('applies Holiday Off preset and broadcasts across All Branches via multi-channel blast', async () => {
    renderWithProviders(<AdminCommunicationNoticesPage />);

    // Open emergency modal
    const emergencyBtn = screen.getByTestId('admin_communication-emergency-broadcast-btn');
    fireEvent.click(emergencyBtn);

    // Click Holiday Off preset
    const holidayPresetBtn = screen.getByText(/Holiday Off/i).closest('button');
    expect(holidayPresetBtn).toBeTruthy();
    fireEvent.click(holidayPresetBtn!);

    // Title and message should be autofilled
    const titleInput = screen.getByPlaceholderText('NOTICE_TITLE_PLACEHOLDER') as HTMLInputElement;
    expect(titleInput.value).toContain('Library Network Closed for Scheduled Holiday');

    // Target branch should be All Branches
    const branchSelect = screen.getByLabelText(/Target Audience \/ Branch/i) as HTMLSelectElement;
    expect(branchSelect.value).toBe('All Branches');

    // Submit emergency broadcast
    const submitBtn = screen.getByTestId('admin_communication-page-control-007');
    fireEvent.click(submitBtn);

    // Verify the emergency notice appears in the table with EMERGENCY badge
    const emergencyBadges = await screen.findAllByText(/EMERGENCY/i);
    expect(emergencyBadges.length).toBeGreaterThan(0);

    // Verify Active Emergency Alert banner appears at top of page
    expect(screen.getByText(/Network-Wide Emergency Alert Active/i)).toBeTruthy();
    expect(screen.getByText('Re-Broadcast Blast')).toBeTruthy();
  });
});
