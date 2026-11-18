import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminMembersBlacklistMain from '@/app/frontend_admin/admin_members/members_blacklist/components/AdminMembersBlacklistMain';
import { AdminBranchProvider } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_components/AdminBranchProvider';

// Mock runtimeFeatures so demo mode is active
vi.mock('@/app/frontend_admin/lib/runtimeFeatures', () => ({
  isFrontendDemoModeEnabled: () => true,
}));

// Mock next-intl translations and locales
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    if (key === 'COUNT_MESSAGE') return `${values?.count ?? 0} students recorded`;
    return key;
  },
  useLocale: () => 'en',
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/admin/admin_members/members_blacklist',
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

describe('AdminMembersBlacklist Disciplinary Governance & Network-Wide Ban Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the disciplinary blacklist management page with Network-Wide ban tags', () => {
    renderWithProviders(<AdminMembersBlacklistMain />);
    
    // Check page title and action buttons
    expect(screen.getByText('TITLE')).toBeTruthy();
    expect(screen.getByText('ADD_ACTION')).toBeTruthy();
    expect(screen.getAllByText('Export CSV').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Excel').length).toBeGreaterThan(0);

    // Check table headers
    expect(screen.getAllByText('Ban Scope').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Category').length).toBeGreaterThan(0);
  });

  it('opens add disciplinary blacklist dialog with category, network scope and actions', async () => {
    renderWithProviders(<AdminMembersBlacklistMain />);

    // Click Add Action
    const addBtn = screen.getByText('ADD_ACTION').closest('button');
    expect(addBtn).toBeTruthy();
    fireEvent.click(addBtn!);

    // Dialog should open
    expect(screen.getByText('FORM_TITLE')).toBeTruthy();
    expect(screen.getByText(/Network-Wide Disciplinary Expulsion/i)).toBeTruthy();

    // Form inputs should be present
    expect(screen.getByLabelText('NAME_LABEL')).toBeTruthy();
    expect(screen.getByLabelText('PHONE_LABEL')).toBeTruthy();
    expect(screen.getByLabelText('REASON_LABEL')).toBeTruthy();
    expect(screen.getByLabelText(/Disciplinary Violation Category/i)).toBeTruthy();
    expect(screen.getByLabelText(/Enforcement Scope/i)).toBeTruthy();
    expect(screen.getByLabelText(/Ban Duration/i)).toBeTruthy();

    // Automatic disciplinary checkboxes
    expect(screen.getByText(/Revoke & vacate assigned seat immediately/i)).toBeTruthy();
    expect(screen.getByText(/Lock turnstiles & biometric access network-wide/i)).toBeTruthy();
  });

  it('allows clicking a blacklisted student to inspect the Disciplinary Dossier with print and pardon actions', async () => {
    renderWithProviders(<AdminMembersBlacklistMain />);

    // Look for demo fixture in table
    const studentElements = await screen.findAllByText('Vikram Rajput');
    expect(studentElements.length).toBeGreaterThan(0);

    // Click the row to open Disciplinary Dossier
    fireEvent.click(studentElements[0]);

    // Verify Dossier elements appear
    expect(screen.getByText('Print Expulsion Notice')).toBeTruthy();
    expect(screen.getByText('WhatsApp Alert')).toBeTruthy();
    expect(screen.getByText('Pardon / Lift Ban')).toBeTruthy();
    expect(screen.getByText(/Network-Wide Bar Enforced/i)).toBeTruthy();
    expect(screen.getByText(/Vacated Seat/i)).toBeTruthy();
    expect(screen.getByText(/Permanently Blocked/i)).toBeTruthy();
  });

  it('opens Pardon Dialog and allows admin to submit reinstatement notes', async () => {
    renderWithProviders(<AdminMembersBlacklistMain />);

    // Select row
    const studentElements = await screen.findAllByText('Vikram Rajput');
    fireEvent.click(studentElements[0]);

    // Click Pardon / Lift Ban
    const pardonBtn = screen.getByText('Pardon / Lift Ban');
    fireEvent.click(pardonBtn);

    // Pardon modal should open
    expect(screen.getByText(/Revoke Ban & Pardon Student/i)).toBeTruthy();
    const textarea = screen.getByPlaceholderText(/Unconditional written apology submitted/i);
    expect(textarea).toBeTruthy();

    // Enter apology notes
    fireEvent.change(textarea, { target: { value: 'Written apology accepted and compensation settled in full.' } });

    // Confirm button should be active
    const confirmBtn = screen.getByText('Confirm & Reinstate Access');
    expect(confirmBtn).not.toBeDisabled();
    fireEvent.click(confirmBtn);

    // Student should now display Pardoned badge
    const pardonedBadges = await screen.findAllByText('Pardoned');
    expect(pardonedBadges.length).toBeGreaterThan(0);
  });
});
