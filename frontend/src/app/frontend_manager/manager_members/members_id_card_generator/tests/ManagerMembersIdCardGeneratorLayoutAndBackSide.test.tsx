import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messagesEn from '../locales/manager_members_id_card_generator_domain_en.json';
import ManagerMembersIdCardGeneratorStudentIdCard from '../components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCard';
import { ManagerMembersIdCardGeneratorStudentIdCardBack } from '../components/manager_members_id_card_generator_sections/ManagerMembersIdCardGeneratorStudentIdCardBack';
import type { IdCardData } from '../types/ManagerMembersIdCardGeneratorComponentTypes';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const mockCardData: IdCardData = {
  name: 'Rahul Sharma',
  smartId: 'LIB-2026-0042',
  phone: '9876543210',
  shift: 'Morning',
  seat: 'A-12',
  locker: 'L-05',
  plan: 'Monthly',
  status: 'Active',
  joinDate: '01 Oct 2026',
  expiryDate: '30 Nov 2026',
  branch: 'Central Library',
  college: 'Delhi University',
  wifiSsid: 'Central_Library_5G',
  wifiPassword: 'Study@Silent2026',
  emergencyPhone: '+91 98765 00000',
  helpdeskPhone: '+91 98765 43210',
  rules: [
    'Maintain strict silence inside reading halls.',
    'ID card is mandatory for gate entry.',
    'Keep mobile phones in silent mode.',
    'Outside food is strictly prohibited.',
  ],
};

function renderWithIntl(component: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messagesEn}>
      {component}
    </NextIntlClientProvider>
  );
}

describe('ID Card Back Side Component', () => {
  it('renders library guidelines, Wi-Fi credentials, emergency numbers, and official seal', () => {
    renderWithIntl(<ManagerMembersIdCardGeneratorStudentIdCardBack data={mockCardData} />);

    // Header & Branch
    expect(screen.getAllByText(/STUDY LIB OS/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Central Library/i)).toBeInTheDocument();
    expect(screen.getByText(/RULES & CONTACTS/i)).toBeInTheDocument();

    // Rules
    expect(screen.getByText(/General Library Rules & Code of Conduct/i)).toBeInTheDocument();
    expect(screen.getByText(/Maintain strict silence inside reading halls/i)).toBeInTheDocument();
    expect(screen.getByText(/Outside food is strictly prohibited/i)).toBeInTheDocument();

    // Wi-Fi Credentials Box
    expect(screen.getByText(/Study Wi-Fi/i)).toBeInTheDocument();
    expect(screen.getByText('Central_Library_5G')).toBeInTheDocument();
    expect(screen.getByText('Study@Silent2026')).toBeInTheDocument();

    // Emergency Box
    expect(screen.getByText(/Emergency Desk/i)).toBeInTheDocument();
    expect(screen.getByText('+91 98765 43210')).toBeInTheDocument();
    expect(screen.getByText('+91 98765 00000')).toBeInTheDocument();

    // Signatory & Seal
    expect(screen.getByText(/Official Seal/i)).toBeInTheDocument();
    expect(screen.getByText(/Authorized Signatory/i)).toBeInTheDocument();
    expect(screen.getByText(/#LIB-2026-0042/i)).toBeInTheDocument();
  });
});

describe('Student ID Card View & Side Flipper', () => {
  it('renders front side by default with photo, name, smartId, seat, barcode, and QR code', () => {
    renderWithIntl(<ManagerMembersIdCardGeneratorStudentIdCard data={mockCardData} side="front" />);

    expect(screen.getByTestId('student-id-card-front')).toBeInTheDocument();
    expect(screen.queryByTestId('student-id-card-back')).not.toBeInTheDocument();
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText('#LIB-2026-0042')).toBeInTheDocument();
    expect(screen.getByText('A-12')).toBeInTheDocument();
    expect(screen.getByText(/Scan to Verify/i)).toBeInTheDocument();
  });

  it('renders back side when side="back" is selected', () => {
    renderWithIntl(<ManagerMembersIdCardGeneratorStudentIdCard data={mockCardData} side="back" />);

    expect(screen.getByTestId('student-id-card-back')).toBeInTheDocument();
    expect(screen.queryByTestId('student-id-card-front')).not.toBeInTheDocument();
    expect(screen.getByText(/General Library Rules & Code of Conduct/i)).toBeInTheDocument();
    expect(screen.getByText('Study@Silent2026')).toBeInTheDocument();
  });

  it('renders both sides simultaneously when side="both" is chosen for duplex preview', () => {
    renderWithIntl(<ManagerMembersIdCardGeneratorStudentIdCard data={mockCardData} side="both" />);

    expect(screen.getByTestId('student-id-card-front')).toBeInTheDocument();
    expect(screen.getByTestId('student-id-card-back')).toBeInTheDocument();
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument();
    expect(screen.getByText(/Study Wi-Fi/i)).toBeInTheDocument();
  });

  it('allows interactive side switching via UI buttons', () => {
    renderWithIntl(<ManagerMembersIdCardGeneratorStudentIdCard data={mockCardData} />);

    // Initially front side
    expect(screen.getByTestId('student-id-card-front')).toBeInTheDocument();

    // Click "Back Side"
    const backBtn = screen.getByTestId('id-card-side-back-btn');
    fireEvent.click(backBtn);
    expect(screen.getByTestId('student-id-card-back')).toBeInTheDocument();
    expect(screen.queryByTestId('student-id-card-front')).not.toBeInTheDocument();

    // Click "Both Sides"
    const bothBtn = screen.getByTestId('id-card-side-both-btn');
    fireEvent.click(bothBtn);
    expect(screen.getByTestId('student-id-card-front')).toBeInTheDocument();
    expect(screen.getByTestId('student-id-card-back')).toBeInTheDocument();
  });
});

describe('Print Stylesheet and Layout Integrity', () => {
  const cssPath = [
    join(process.cwd(), 'src/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_styles/ManagerMembersIdCardGeneratorManager_id_card_generator.css'),
    join(process.cwd(), 'frontend/src/app/frontend_manager/manager_members/members_id_card_generator/components/manager_members_id_card_generator_styles/ManagerMembersIdCardGeneratorManager_id_card_generator.css'),
  ].find(existsSync);

  it('contains dedicated print media rules for single PVC card and A4 paper sheet', () => {
    expect(cssPath).toBeDefined();
    const cssContent = readFileSync(cssPath!, 'utf8');

    // PVC mode rules
    expect(cssContent).toContain('.print-mode-pvc_single');
    expect(cssContent).toContain('85.6mm');
    expect(cssContent).toContain('53.98mm');
    expect(cssContent).toContain('page-break-after: always');

    // A4 sheet rules
    expect(cssContent).toContain('.print-mode-a4_sheet_8');
    expect(cssContent).toContain('.print-mode-a4_sheet_10');
    expect(cssContent).toContain('210mm');
    expect(cssContent).toContain('.mgr-a4-sheet-grid');

    // Cut guidelines for lamination
    expect(cssContent).toContain('.mgr-a4-print-cell');
    expect(cssContent).toContain('border: 1px dashed');

    // Exact color preservation
    expect(cssContent).toContain('-webkit-print-color-adjust: exact');
    expect(cssContent).toContain('print-color-adjust: exact');
  });
});
