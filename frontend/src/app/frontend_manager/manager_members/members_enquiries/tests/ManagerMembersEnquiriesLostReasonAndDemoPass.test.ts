import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  MANAGER_CRM_LOST_REASONS,
} from '@/app/frontend_manager/manager_members/members_enquiries/components/manager_members_enquiries_widgets/ManagerMembersEnquiriesLostReasonModal';
import { MANAGER_CRM_DEFAULT_WHATSAPP_TEMPLATES } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';

const readSource = (relativePath: string) =>
  readFileSync(join(__dirname, '..', relativePath), 'utf8');

describe('Manager Members Enquiries - Lost Reason & WhatsApp Demo Pass Enhancements', () => {
  it('defines comprehensive lost reasons covering fees, availability, competitor, timings, and distance', () => {
    const reasonLabels = MANAGER_CRM_LOST_REASONS.map((r) => r.label);
    expect(reasonLabels).toContain('High Fee Structure');
    expect(reasonLabels).toContain('Seat / Shift Unavailable');
    expect(reasonLabels).toContain('Joined Another Library');
    expect(reasonLabels).toContain('Distance / Commute Issue');
    expect(reasonLabels).toContain('Shift Timing Mismatch');
    expect(reasonLabels).toContain('Exam Postponed / Stopped Prep');
    expect(reasonLabels).toContain('Other Reason');
  });

  it('provides accessible modal structure in ManagerMembersEnquiriesLostReasonModal', () => {
    const modalSource = readSource(
      'components/manager_members_enquiries_widgets/ManagerMembersEnquiriesLostReasonModal.tsx'
    );
    expect(modalSource).toContain('role="dialog"');
    expect(modalSource).toContain('aria-labelledby="lost-reason-modal-title"');
    expect(modalSource).toContain('lost-reason-notes');
    expect(modalSource).toContain('Confirm & Mark as Lost');
  });

  it('exposes 1-Click WhatsApp Demo Pass and Location in actions panel', () => {
    const panelSource = readSource(
      'components/manager_members_enquiries_widgets/ManagerMembersEnquiriesEnquiryActionsPanel.tsx'
    );
    expect(panelSource).toContain('1-Click WhatsApp Demo Pass');
    expect(panelSource).toContain('Send Location Pin & Timings (WhatsApp)');
    expect(panelSource).toContain('onMarkLost');
  });

  it('guarantees Mobile Cards and Table propagate full enquiry object on conversion to prevent blank forms', () => {
    const tableSource = readSource(
      'components/manager_members_enquiries_table_parts/ManagerMembersEnquiriesTable.tsx'
    );
    expect(tableSource).toContain("sessionStorage.setItem('manager_pending_enquiry_conversion'");
    expect(tableSource).toContain("sessionStorage.setItem('enquiry_conversion_prefill'");
    expect(tableSource).toContain('onQuickConvert={(e, enq) => handleQuickConvert(e, enq)}');

    const mobileSource = readSource(
      'components/manager_members_enquiries_table_parts/ManagerMembersEnquiriesMobileCards.tsx'
    );
    expect(mobileSource).toContain('onQuickConvert: (e: MouseEvent, enq?: ManagerMembersEnquiriesEnquiry) => void');
    expect(mobileSource).toContain('onClick={(e) => onQuickConvert(e, enq)}');
  });

  it('enriches bulk WhatsApp templates with 1-Day Demo Pass and Location presets', () => {
    const ids = MANAGER_CRM_DEFAULT_WHATSAPP_TEMPLATES.map((t) => t.id);
    expect(ids).toContain('demo_pass');
    expect(ids).toContain('location_pin');
  });
});
