'use client';
// RESPONSIBILITY: Own local waitlist automation toggle and validated preview form state; changes are not persisted or sent to members.
// FLOW: Waitlist automation page -> module-owned state hook -> local Zod/RHF validation -> preview rendering only.
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  superadminLibrariesWaitlistAutomationSettingsSchema,
  type SuperadminLibrariesWaitlistAutomationSettings,
} from '../schemas/superadmin_libraries_library_waitlist_automation_settings.schema';

export function useSuperadminLibrariesWaitlistAutomationState(defaultTemplate: string) {
  const [enabled, setEnabled] = useState(true);
  const form = useForm<SuperadminLibrariesWaitlistAutomationSettings>({
    resolver: zodResolver(superadminLibrariesWaitlistAutomationSettingsSchema),
    defaultValues: { delay: 0, template: defaultTemplate },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  return { enabled, setEnabled, form };
}
