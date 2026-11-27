import type { Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import {
  KeyRound,
  Snowflake,
  Tag,
  Volume2,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export function resolveComplaintCategory(c: Complaint): {
  label: string;
  icon: LucideIcon;
  badgeClass: string;
} {
  const text = `${c.category ?? ''} ${c.title} ${c.description}`.toLowerCase();
  if (text.includes('ac ') || text.includes('cooling') || text.includes('temperature') || text.includes('cassette')) {
    return { label: 'HVAC & Cooling', icon: Snowflake, badgeClass: 'text-info-text border-info bg-info-bg' };
  }
  if (text.includes('wi-fi') || text.includes('wifi') || text.includes('internet') || text.includes('ping') || text.includes('fiber')) {
    return { label: 'Network & Wi-Fi', icon: Wifi, badgeClass: 'text-warning-text border-warning bg-warning-bg' };
  }
  if (text.includes('locker') || text.includes('key') || text.includes('lock') || text.includes('cylinder')) {
    return { label: 'Facility & Lockers', icon: KeyRound, badgeClass: 'text-purple-text border-purple-text bg-purple-bg' };
  }
  if (text.includes('light') || text.includes('led') || text.includes('power') || text.includes('socket') || text.includes('ups')) {
    return { label: 'Electrical & Power', icon: Zap, badgeClass: 'text-warning-text border-warning bg-warning-bg' };
  }
  if (text.includes('whisper') || text.includes('noise') || text.includes('silent') || text.includes('talking')) {
    return { label: 'Discipline & Quiet', icon: Volume2, badgeClass: 'text-danger-text border-danger bg-danger-bg' };
  }
  return { label: c.category || 'General Grievance', icon: Tag, badgeClass: 'text-primary border-border-focus bg-primary-subtle' };
}

export function resolvePriority(c: Complaint): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  const p = c.priority || (c.isEscalatedToHq ? 'URGENT' : c.status === 'Open' ? 'HIGH' : 'MEDIUM');
  if (p === 'URGENT') {
    return { label: 'Urgent', badgeClass: 'border-danger bg-danger-bg text-danger-text font-bold', dotClass: 'bg-danger motion-safe:animate-pulse' };
  }
  if (p === 'HIGH') {
    return { label: 'High Priority', badgeClass: 'border-warning bg-warning-bg text-warning-text font-semibold', dotClass: 'bg-warning' };
  }
  if (p === 'MEDIUM') {
    return { label: 'Medium', badgeClass: 'border-info bg-info-bg text-info-text', dotClass: 'bg-info' };
  }
  return { label: 'Standard', badgeClass: 'border-border bg-surface-highlight text-text-secondary', dotClass: 'bg-text-secondary' };
}

export function getStudentInitials(name: string): string {
  if (!name || name === '—') return 'ST';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? '';
  if (parts.length >= 2 && first && second) return `${first}${second}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
