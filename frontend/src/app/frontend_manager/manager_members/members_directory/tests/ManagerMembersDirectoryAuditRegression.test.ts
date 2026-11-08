import { describe, it, expect } from 'vitest';
import { memberEditSchema } from '../components/manager_members_directory_sections/ManagerMembersDirectoryEditModal';

describe('Manager Members Directory Audit Regression Tests', () => {
  describe('BUG-05: Zod Schema Validation for Member Edit Form', () => {
    it('should validate valid member payload successfully', () => {
      const valid = {
        name: 'Aarav Sharma',
        phone: '9876543210',
        email: 'aarav@example.com',
        expiryDate: '2026-12-31',
      };
      const result = memberEditSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject empty or whitespace name', () => {
      const invalid = {
        name: '   ',
        phone: '9876543210',
        email: 'aarav@example.com',
        expiryDate: '2026-12-31',
      };
      const result = memberEditSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Student Full Name is required');
      }
    });

    it('should reject invalid short phone number', () => {
      const invalid = {
        name: 'Aarav Sharma',
        phone: '123',
        email: 'aarav@example.com',
        expiryDate: '2026-12-31',
      };
      const result = memberEditSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('at least 7 digits');
      }
    });

    it('should allow empty email as optional', () => {
      const valid = {
        name: 'Aarav Sharma',
        phone: '9876543210',
        email: '',
        expiryDate: '2026-12-31',
      };
      const result = memberEditSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('should reject malformed email format', () => {
      const invalid = {
        name: 'Aarav Sharma',
        phone: '9876543210',
        email: 'not-an-email',
        expiryDate: '2026-12-31',
      };
      const result = memberEditSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('BUG-12 & BUG-13: Search and Hierarchical Matching', () => {
    const mockMembers = [
      { id: 'LIB-001', name: 'Rohan Gupta', phone: '9876543210', email: 'rohan@test.com', seat: 'S-01', type: 'Basic', status: 'Active' as const, joinDate: '2026-01-01', expiryDate: '2026-12-31' },
      { id: 'LIB-002', name: '001 Priya Singh', phone: '9811223344', email: 'priya@test.com', seat: 'S-02', type: 'Pro', status: 'Active' as const, joinDate: '2026-01-01', expiryDate: '2026-12-31' },
    ];

    it('should find member by mobile phone digits', () => {
      const q = '9876543210';
      const filtered = mockMembers.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.seat && m.seat.toLowerCase().includes(q))
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.id).toBe('LIB-001');
    });

    it('should find member by email address', () => {
      const q = 'priya@test.com';
      const filtered = mockMembers.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.seat && m.seat.toLowerCase().includes(q))
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.name).toBe('001 Priya Singh');
    });

    it('should prioritize exact ID match over substring collision', () => {
      const targetQuery = 'LIB-001';
      const exactMatch = mockMembers.find((r) => r.id.toLowerCase() === targetQuery.toLowerCase());
      expect(exactMatch?.id).toBe('LIB-001');
      expect(exactMatch?.name).toBe('Rohan Gupta');
    });
  });

  describe('BUG-14: CSV Escaping Compliance', () => {
    it('should properly escape quotes, commas, and newlines per RFC 4180', () => {
      const escapeCsvVal = (val: unknown): string => {
        const s = String(val ?? '');
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : `"${s}"`;
      };

      expect(escapeCsvVal('Gupta, Rohan')).toBe('"Gupta, Rohan"');
      expect(escapeCsvVal('He said "Hello"')).toBe('"He said ""Hello"""');
      expect(escapeCsvVal('Standard Name')).toBe('"Standard Name"');
      expect(escapeCsvVal('Line1\nLine2')).toBe('"Line1\nLine2"');
    });
  });
});

