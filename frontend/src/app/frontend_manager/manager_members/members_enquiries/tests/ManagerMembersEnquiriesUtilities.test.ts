import {
cleanManagerEnquiriesWhatsAppPhone,
getManagerEnquiriesDemoPassWhatsAppUrl,
getManagerEnquiriesInitials,
getManagerEnquiriesLocalDateInputMinimum,
getManagerEnquiriesLocationWhatsAppUrl,
maskManagerEnquiriesPhone,
normalizeManagerEnquiriesEnquiry,
} from '@/app/frontend_manager/manager_members/members_enquiries/utils/ManagerMembersEnquiriesUtilities';
import { describe,expect,it } from 'vitest';

describe('ManagerMembersEnquiriesUtilities', () => {
  it('masks phone numbers while keeping recognizable prefix/suffix', () => {
    expect(maskManagerEnquiriesPhone('+91 9876543210')).toBe('91****3210');
  });

  it('never returns a short or malformed phone value unmasked', () => {
    expect(maskManagerEnquiriesPhone('12345')).toBe('••••');
    expect(maskManagerEnquiriesPhone('not-a-phone')).toBe('—');
  });

  it('derives deterministic initials from a name', () => {
    expect(getManagerEnquiriesInitials('Priya Verma')).toBe('PV');
  });

  it('formats a date-input minimum using the local calendar day', () => {
    expect(getManagerEnquiriesLocalDateInputMinimum(new Date(2026, 9, 16, 0, 30))).toBe('2026-10-16');
  });

  it('cleans WhatsApp phone numbers with international prefix 91', () => {
    expect(cleanManagerEnquiriesWhatsAppPhone('9876543210')).toBe('919876543210');
    expect(cleanManagerEnquiriesWhatsAppPhone('+91 98765 43210')).toBe('919876543210');
    expect(cleanManagerEnquiriesWhatsAppPhone('09876543210')).toBe('919876543210');
  });

  it('generates a 1-Day Free Trial Demo Pass WhatsApp URL with pass ID, shift, and Google Maps pin', () => {
    const url = getManagerEnquiriesDemoPassWhatsAppUrl({
      id: 'enq-999',
      name: 'Rohan Sharma',
      phone: '9876543210',
      shift: 'Morning',
    });

    expect(url).toContain('https://wa.me/919876543210?text=');
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('1-DAY FREE TRIAL DEMO PASS');
    expect(decoded).toContain('Rohan Sharma');
    expect(decoded).toContain('Morning');
    expect(decoded).toContain('https://maps.google.com/?q=Central+Library+Study+Center');
    expect(decoded).toContain('Timings');
  });

  it('generates a Location & Timings WhatsApp URL', () => {
    const url = getManagerEnquiriesLocationWhatsAppUrl({
      name: 'Priya Patel',
      phone: '9876543210',
    });

    expect(url).toContain('https://wa.me/919876543210?text=');
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('LOCATION & DIRECTIONS');
    expect(decoded).toContain('Priya Patel');
    expect(decoded).toContain('Google Maps Pin');
  });

  it('preserves lostReason and lostDate in normalizeManagerEnquiriesEnquiry', () => {
    const normalized = normalizeManagerEnquiriesEnquiry({
      id: 'enq-101',
      name: 'Anjali Gupta',
      phone: '9876543210',
      preferredShift: 'Evening',
      status: 'Lost',
      source: 'Walk-in',
      handledBy: { name: 'Desk Officer' },
      createdAt: '2026-11-01',
      lostReason: 'High Fee Structure',
      lostDate: '2026-11-15',
    } as any);

    expect(normalized.status).toBe('Lost');
    expect(normalized.lostReason).toBe('High Fee Structure');
    expect(normalized.lostDate).toBe('2026-11-15');
  });
});
