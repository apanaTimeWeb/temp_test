'use client';
// DATA FLOW: communication_whatsapp_templates route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.

import { useEffect, useRef, useState } from 'react';
import type { AdminCommunicationWhatsappTemplate } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/types/AdminCommunicationWhatsappTemplatesWhatsappTemplateTypes';
import { ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_FIXTURES } from '@/app/frontend_admin/admin_communication/communication_whatsapp_templates/mocks/AdminCommunicationWhatsappTemplatesWhatsappTemplateFixtures';

export default function useAdminCommunicationWhatsappTemplateState() {
  const [templates, setTemplates] = useState<AdminCommunicationWhatsappTemplate[]>(ADMIN_COMMUNICATION_WHATSAPP_TEMPLATE_FIXTURES);
  const [activeId, setActiveId] = useState('welcome');
  const [showTest, setShowTest] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [toast, setToast] = useState('');
  const toastTimeoutRef = useRef<number | null>(null);
  useEffect(() => () => { if (toastTimeoutRef.current !== null) window.clearTimeout(toastTimeoutRef.current); }, []);
  return { templates, setTemplates, activeId, setActiveId, showTest, setShowTest, testPhone, setTestPhone, toast, setToast, toastTimeoutRef } as const;
}
