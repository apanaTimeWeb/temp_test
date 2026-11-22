import React from 'react';
import { Coins, Handshake, Megaphone, Receipt, RotateCcw, Sparkles, UserX } from 'lucide-react';
import type { TemplateMeta } from './ManagerCommunicationWhatsappTemplatesSidebar';

export const VARIABLE_CHIP_CONFIGS: Record<string, { bg: string; text: string; border: string; hover: string; title: string }> = {
  '{name}': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', hover: 'hover:bg-emerald-500/20 hover:border-emerald-500/50', title: 'Student Full Name' },
  '{amount}': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', hover: 'hover:bg-amber-500/20 hover:border-amber-500/50', title: 'Payable / Due Amount' },
  '{duedate}': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', hover: 'hover:bg-rose-500/20 hover:border-rose-500/50', title: 'Payment / Renewal Due Date' },
  '{planname}': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', hover: 'hover:bg-purple-500/20 hover:border-purple-500/50', title: 'Membership Plan Name' },
  '{libraryname}': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', hover: 'hover:bg-indigo-500/20 hover:border-indigo-500/50', title: 'Branch / Library Name' },
  '{phone}': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', hover: 'hover:bg-cyan-500/20 hover:border-cyan-500/50', title: 'Student / Parent Contact' },
  '{seat}': { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30', hover: 'hover:bg-sky-500/20 hover:border-sky-500/50', title: 'Assigned Seat Number' },
};

export const TEMPLATE_CONFIGS: Record<string, TemplateMeta> = {
  welcome: {
    icon: <Sparkles size={16} />,
    conditionTag: 'Auto-API (1x)',
    conditionDesc: 'Auto-sent 1x via Server API on student admission',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    iconBox: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    accentBorder: 'border-l-4 border-l-emerald-500',
    ring: 'ring-emerald-500/20 border-emerald-500/40',
  },
  fee_reminder: {
    icon: <Coins size={16} />,
    conditionTag: 'Free Web',
    conditionDesc: 'Dispatched manually via WhatsApp Web (Zero Cost)',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    iconBox: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    accentBorder: 'border-l-4 border-l-amber-500',
    ring: 'ring-amber-500/20 border-amber-500/40',
  },
  renewal: {
    icon: <RotateCcw size={16} />,
    conditionTag: 'Free Web',
    conditionDesc: 'Dispatched manually via WhatsApp Web (Zero Cost)',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    iconBox: 'bg-purple-500/10 text-purple-400 border-purple-500/25',
    accentBorder: 'border-l-4 border-l-purple-500',
    ring: 'ring-purple-500/20 border-purple-500/40',
  },
  receipt: {
    icon: <Receipt size={16} />,
    conditionTag: 'Auto-API (1x)',
    conditionDesc: 'Auto-sent 1x via Server API on fee payment',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
    iconBox: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
    accentBorder: 'border-l-4 border-l-cyan-500',
    ring: 'ring-cyan-500/20 border-cyan-500/40',
  },
  notice: {
    icon: <Megaphone size={16} />,
    conditionTag: 'Free Web',
    conditionDesc: 'Broadcast manually via WhatsApp Web (Zero Cost)',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
    iconBox: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25',
    accentBorder: 'border-l-4 border-l-indigo-500',
    ring: 'ring-indigo-500/20 border-indigo-500/40',
  },
  absentee: {
    icon: <UserX size={16} />,
    conditionTag: 'Free Web',
    conditionDesc: 'Dispatched manually to parent via WhatsApp Web (Zero Cost)',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    iconBox: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    accentBorder: 'border-l-4 border-l-rose-500',
    ring: 'ring-rose-500/20 border-rose-500/40',
  },
  ptp: {
    icon: <Handshake size={16} />,
    conditionTag: 'Free Web',
    conditionDesc: 'Dispatched manually on commitment date via WhatsApp Web (Zero Cost)',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/25',
    iconBox: 'bg-orange-500/10 text-orange-400 border-orange-500/25',
    accentBorder: 'border-l-4 border-l-orange-500',
    ring: 'ring-orange-500/20 border-orange-500/40',
  },
};
