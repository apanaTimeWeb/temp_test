'use client';

import React from 'react';
import {
  Building2,
  CreditCard,
  TrendingUp,
  Key,
  Database,
  Tag,
  Bug,
  ShieldAlert,
  HelpCircle,
  Wrench,
} from 'lucide-react';

export function SuperadminSupportTicketsCategoryIcon({ category }: { category: string }) {
  switch (category) {
    case 'Technical issue': return <Wrench size={13} className="text-sky-400" />;
    case 'Billing issue':
    case 'Billing': return <CreditCard size={13} className="text-emerald-400" />;
    case 'Branch creation request': return <Building2 size={13} className="text-indigo-400" />;
    case 'Plan upgrade request': return <TrendingUp size={13} className="text-purple-400" />;
    case 'Account access issue':
    case 'Account': return <Key size={13} className="text-amber-400" />;
    case 'Data correction request': return <Database size={13} className="text-rose-400" />;
    case 'Feature request': return <Tag size={13} className="text-teal-400" />;
    case 'Bug report':
    case 'Bug': return <Bug size={13} className="text-rose-400" />;
    case 'Security complaint': return <ShieldAlert size={13} className="text-red-400" />;
    default: return <HelpCircle size={13} className="text-indigo-400" />;
  }
}
