// RESPONSIBILITY: Define the catalog of feature modules that can be delegated or enabled for branch managers.
import {
  QrCode, Armchair, Key, CreditCard, Calculator, MessageSquare,
  FileText, Users, LifeBuoy, Layers
} from 'lucide-react';
import type { ElementType } from 'react';

export interface SuperadminManagerModuleDefinition {
  key: string;
  name: string;
  description: string;
  icon: ElementType;
  category: string;
  defaultOn?: boolean;
}

export const SUPERADMIN_MANAGER_MODULES_CATALOG: SuperadminManagerModuleDefinition[] = [
  {
    key: 'attendance',
    name: 'Daily Attendance Desk',
    description: 'Manual and automated student attendance tracking per shift.',
    icon: Users,
    category: 'Operations',
    defaultOn: true,
  },
  {
    key: 'qr_scanner',
    name: 'QR Scanner & Biometric Check-in',
    description: 'In-browser camera scanner for student entry & exit verification.',
    icon: QrCode,
    category: 'Operations',
    defaultOn: true,
  },
  {
    key: 'seats_matrix',
    name: 'Visual Seats Matrix & Shifts',
    description: 'Live interactive floor grid with real-time seat availability colors.',
    icon: Armchair,
    category: 'Facility',
    defaultOn: true,
  },
  {
    key: 'lockers',
    name: 'Lockers Management Grid',
    description: 'Locker allocations, physical keys registry, and deposit tracking.',
    icon: Key,
    category: 'Facility',
    defaultOn: false,
  },
  {
    key: 'fee_collection',
    name: 'Fee Collection & Renewals',
    description: 'Accept UPI, Cash, Card, record late fines, and process plan renewals.',
    icon: CreditCard,
    category: 'Finance',
    defaultOn: true,
  },
  {
    key: 'daily_settlement',
    name: 'Daily Cash Settlement Register',
    description: 'End-of-day cash drawer tally and handover verification.',
    icon: Calculator,
    category: 'Finance',
    defaultOn: true,
  },
  {
    key: 'expenses',
    name: 'Petty Cash & Expenses Tracker',
    description: 'Track branch utilities, maintenance, chai, and cleaning vouchers.',
    icon: FileText,
    category: 'Finance',
    defaultOn: true,
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp Notices & Receipts',
    description: 'Automated fee receipts, expiry warnings, and welcome messages via WhatsApp API.',
    icon: MessageSquare,
    category: 'Communication',
    defaultOn: true,
  },
  {
    key: 'id_card',
    name: 'ID Card Generator with Barcode',
    description: '1-click customizable student identification card rendering and printing.',
    icon: Layers,
    category: 'CRM',
    defaultOn: true,
  },
  {
    key: 'complaints',
    name: 'Student Grievance & Issue Desk',
    description: 'Track AC, WiFi, lighting, and silence complaints from students.',
    icon: LifeBuoy,
    category: 'Support',
    defaultOn: true,
  },
];
