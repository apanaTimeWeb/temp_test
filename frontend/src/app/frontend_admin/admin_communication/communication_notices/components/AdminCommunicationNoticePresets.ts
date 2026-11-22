import type { AdminCommunicationNoticeFormValues } from '@/app/frontend_admin/admin_communication/communication_notices/schemas/AdminCommunicationNoticesSchema';
import type { UseFormReturn } from 'react-hook-form';

export type NoticePresetType = 'WEATHER' | 'HOLIDAY' | 'POWER' | 'SECURITY';

export function applyNoticePreset(
  preset: NoticePresetType,
  noticeForm: UseFormReturn<AdminCommunicationNoticeFormValues>
) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  if (preset === 'WEATHER') {
    noticeForm.setValue('title', 'Urgent: All Library Branches Closed Today Due to Heavy Rainfall', { shouldDirty: true });
    noticeForm.setValue('message', 'Dear Students, Due to continuous heavy rainfall, severe waterlogging, and safety guidelines from municipal authorities, all Smart Library branch halls will remain CLOSED today. Digital portal and e-resources remain 24x7 active. Next operational advisory by 8:00 PM.', { shouldDirty: true });
    noticeForm.setValue('validTill', formatDate(tomorrow), { shouldDirty: true });
    noticeForm.setValue('targetBranch', 'All Branches', { shouldDirty: true });
    noticeForm.setValue('sendWhatsApp', true, { shouldDirty: true });
    noticeForm.setValue('sendEmail', true, { shouldDirty: true });
    noticeForm.setValue('sendSms', true, { shouldDirty: true });
    noticeForm.setValue('priority', 'EMERGENCY', { shouldDirty: true });
    noticeForm.setValue('isEmergency', true, { shouldDirty: true });
  } else if (preset === 'HOLIDAY') {
    noticeForm.setValue('title', 'Notice: Library Network Closed for Scheduled Holiday', { shouldDirty: true });
    noticeForm.setValue('message', 'Dear Students, Please be advised that all library study halls across the network will remain closed tomorrow in observance of the public holiday. Study shifts and reserved desks will resume standard schedule from 6:00 AM on the following day.', { shouldDirty: true });
    noticeForm.setValue('validTill', formatDate(tomorrow), { shouldDirty: true });
    noticeForm.setValue('targetBranch', 'All Branches', { shouldDirty: true });
    noticeForm.setValue('sendWhatsApp', true, { shouldDirty: true });
    noticeForm.setValue('sendEmail', true, { shouldDirty: true });
    noticeForm.setValue('sendSms', true, { shouldDirty: true });
    noticeForm.setValue('priority', 'EMERGENCY', { shouldDirty: true });
    noticeForm.setValue('isEmergency', true, { shouldDirty: true });
  } else if (preset === 'POWER') {
    noticeForm.setValue('title', 'Notice: Essential Power Grid & Generator Maintenance', { shouldDirty: true });
    noticeForm.setValue('message', 'Notice: Essential electrical line maintenance and backup generator testing scheduled today between 2:00 PM and 5:00 PM. Reading desk lamps and emergency lighting will remain operational. Silent study continues uninterrupted.', { shouldDirty: true });
    noticeForm.setValue('validTill', formatDate(tomorrow), { shouldDirty: true });
    noticeForm.setValue('targetBranch', 'All Branches', { shouldDirty: true });
    noticeForm.setValue('sendWhatsApp', true, { shouldDirty: true });
    noticeForm.setValue('sendEmail', true, { shouldDirty: true });
    noticeForm.setValue('sendSms', false, { shouldDirty: true });
    noticeForm.setValue('priority', 'URGENT', { shouldDirty: true });
    noticeForm.setValue('isEmergency', true, { shouldDirty: true });
  } else if (preset === 'SECURITY') {
    noticeForm.setValue('title', 'Security Advisory: Mandatory ID Badge & Biometric Inspection', { shouldDirty: true });
    noticeForm.setValue('message', 'Security Alert: Surprise administrative inspection in progress. Carrying digital Smart ID card and barcode pass is strictly mandatory for biometric turnstile entry. Non-registered individuals will be barred.', { shouldDirty: true });
    noticeForm.setValue('validTill', formatDate(nextWeek), { shouldDirty: true });
    noticeForm.setValue('targetBranch', 'All Branches', { shouldDirty: true });
    noticeForm.setValue('sendWhatsApp', true, { shouldDirty: true });
    noticeForm.setValue('sendEmail', true, { shouldDirty: true });
    noticeForm.setValue('sendSms', true, { shouldDirty: true });
    noticeForm.setValue('priority', 'EMERGENCY', { shouldDirty: true });
    noticeForm.setValue('isEmergency', true, { shouldDirty: true });
  }
}
