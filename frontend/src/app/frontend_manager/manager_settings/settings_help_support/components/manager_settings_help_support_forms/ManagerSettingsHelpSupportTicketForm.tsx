'use client';

import { useManagerSettingsHelpSupportConfirm } from '@/app/frontend_manager/manager_settings/settings_help_support/hooks/useManagerSettingsHelpSupportConfirm';
import { useManagerSettingsHelpSupportUnsavedChangesGuard } from '@/app/frontend_manager/manager_settings/settings_help_support/hooks/useManagerSettingsHelpSupportUnsavedChangesGuard';
import {
managerHelpSupportTicketDraftSchema,
type ManagerSettingsHelpSupportTicketDraft,
} from '@/app/frontend_manager/manager_settings/settings_help_support/schemas/ManagerSettingsHelpSupportTicketDraftSchema';
import type { ManagerSettingsHelpSupportTicketFormProps } from '@/app/frontend_manager/manager_settings/settings_help_support/types/ManagerSettingsHelpSupportComponentTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import {
AlertCircle,
AlignLeft,
Flame,
Layers,
Paperclip,
PenLine,
Send,
UploadCloud,
X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function ManagerSettingsHelpSupportTicketForm({ onCancel }: ManagerSettingsHelpSupportTicketFormProps) {
  const tManagerUi = useTranslations('manager.manager_help_support.ui');
  const router = useRouter();
  const { confirm, dialog: unsavedConfirmDialog } = useManagerSettingsHelpSupportConfirm();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ManagerSettingsHelpSupportTicketDraft>({
    resolver: zodResolver(managerHelpSupportTicketDraftSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { category: 'billing', subject: '', description: '', priority: 'Medium' },
  });

  useManagerSettingsHelpSupportUnsavedChangesGuard({ isDirty, confirm, router, tManagerUi });

  const handleCancel = () => {
    if (!isDirty) {
      onCancel();
      return;
    }
    void confirm(
      tManagerUi('confirm_leave_with_unsaved_changes'),
      tManagerUi('cancel'),
      tManagerUi('continue')
    ).then((confirmed) => {
      if (confirmed) onCancel();
    });
  };

  const onSubmit = (data: ManagerSettingsHelpSupportTicketDraft) => {
    toast.success(
      `Support ticket "${data.subject}" submitted successfully. Ticket ID: TKT-${Date.now().toString().slice(-4)}`,
      { id: 'manager-support-ticket-submit' }
    );
    onCancel();
  };

  return (
    <>
      {unsavedConfirmDialog}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* Row 1: Category & Priority Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category Field */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="manager-ticket-category"
                className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer"
              >
                <span className="w-5 h-5 rounded-md bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center shrink-0">
                  <Layers size={12} />
                </span>
                <span>{tManagerUi('category')}</span>
                <span className="text-rose-400 font-bold">*</span>
              </label>
              <span className="text-xs text-secondary font-normal">Department</span>
            </div>

            <div className="relative">
              <select
                id="manager-ticket-category"
                className="mgr-select h-11 text-sm font-medium w-full rounded-xl bg-surface border border-border focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/25 motion-safe:transition-all cursor-pointer px-3.5"
                {...register('category')}
                aria-invalid={Boolean(errors.category)}
                aria-describedby={errors.category ? 'manager-ticket-category-error' : undefined}
              >
                <option value="billing">💳 {tManagerUi('billing_payments')}</option>
                <option value="technical">🛠️ {tManagerUi('technical_issue')}</option>
                <option value="feature">✨ {tManagerUi('feature_request')}</option>
                <option value="account">👤 {tManagerUi('account_settings')}</option>
                <option value="general">💬 {tManagerUi('general_inquiry')}</option>
              </select>
            </div>

            {errors.category && (
              <p
                id="manager-ticket-category-error"
                className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5"
                role="alert"
              >
                <AlertCircle size={13} className="shrink-0" />
                <span>{tManagerUi('validation_field_invalid')}</span>
              </p>
            )}
          </div>

          {/* Priority Field */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="manager-ticket-priority"
                className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer"
              >
                <span className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center shrink-0">
                  <Flame size={12} />
                </span>
                <span>{tManagerUi('priority')}</span>
                <span className="text-rose-400 font-bold">*</span>
              </label>
              <span className="text-xs text-secondary font-normal">Urgency Level</span>
            </div>

            <div className="relative">
              <select
                id="manager-ticket-priority"
                className="mgr-select h-11 text-sm font-medium w-full rounded-xl bg-surface/60 border border-border focus:border-amber-400 focus:ring-1 focus:ring-amber-400/25 transition-all cursor-pointer px-3.5"
                {...register('priority')}
                aria-invalid={Boolean(errors.priority)}
                aria-describedby={errors.priority ? 'manager-ticket-priority-error' : undefined}
              >
                <option value="Low">🟢 {tManagerUi('low')} — Standard inquiry</option>
                <option value="Medium">🟡 {tManagerUi('medium')} — Needs attention</option>
                <option value="High">🔴 {tManagerUi('high')} — Urgent blocker</option>
              </select>
            </div>

            {errors.priority && (
              <p
                id="manager-ticket-priority-error"
                className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5"
                role="alert"
              >
                <AlertCircle size={13} className="shrink-0" />
                <span>{tManagerUi('validation_field_invalid')}</span>
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Subject */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="manager-ticket-subject"
              className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer"
            >
              <span className="w-5 h-5 rounded-md bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center shrink-0">
                <PenLine size={12} />
              </span>
              <span>{tManagerUi('subject')}</span>
              <span className="text-rose-400 font-bold">*</span>
            </label>
            <span className="text-xs text-secondary font-normal">Brief summary</span>
          </div>

          <div className="relative">
            <input maxLength={30}
              id="manager-ticket-subject"
              type="text"
              required
              placeholder={tManagerUi('briefly_describe_the_issue')}
              className="mgr-input h-11 text-sm w-full rounded-xl bg-surface/60 border border-border focus:border-sky-400 focus:ring-1 focus:ring-sky-400/25 transition-all px-4"
              {...register('subject')}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? 'manager-ticket-subject-error' : undefined}
            />
          </div>

          {errors.subject && (
            <p
              id="manager-ticket-subject-error"
              className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5"
              role="alert"
            >
              <AlertCircle size={13} className="shrink-0" />
              <span>{tManagerUi('validation_field_invalid')}</span>
            </p>
          )}
        </div>

        {/* Row 3: Description */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="manager-ticket-description"
              className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer"
            >
              <span className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shrink-0">
                <AlignLeft size={12} />
              </span>
              <span>{tManagerUi('description')}</span>
              <span className="text-rose-400 font-bold">*</span>
            </label>
            <span className="text-xs text-secondary font-normal">Step-by-step details</span>
          </div>

          <div className="relative">
            <textarea maxLength={1000}
              id="manager-ticket-description"
              rows={6}
              required
              placeholder={tManagerUi('provide_as_much_detail_as_possible')}
              className="mgr-input resize-none py-3.5 px-4 text-sm leading-relaxed w-full rounded-xl bg-surface/60 border border-border focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/25 transition-all"
              {...register('description')}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'manager-ticket-description-error' : undefined}
            />
          </div>

          {errors.description && (
            <p
              id="manager-ticket-description-error"
              className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5"
              role="alert"
            >
              <AlertCircle size={13} className="shrink-0" />
              <span>{tManagerUi('validation_field_invalid')}</span>
            </p>
          )}
        </div>

        {/* Row 4: Attachment Upload Zone */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-primary">
              <span className="w-5 h-5 rounded-md bg-violet-500/10 border border-violet-500/25 text-violet-400 flex items-center justify-center shrink-0">
                <Paperclip size={12} />
              </span>
              <span>{tManagerUi('attachment_optional')}</span>
            </label>
            <span className="text-xs text-secondary font-normal">
              {tManagerUi('svg_png_jpg_or_pdf_max_5mb')}
            </span>
          </div>

          <div className="border-2 border-dashed border-border hover:border-violet-500/40 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-surface/30 hover:bg-surface/50 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-2.5">
              <UploadCloud size={22} />
            </div>
            <p className="text-sm font-semibold text-primary mb-1">
              {tManagerUi('click_to_upload_or_drag_and_drop')}
            </p>
            <p className="text-xs text-secondary max-w-md leading-relaxed" role="status">
              {tManagerUi('attachment_unavailable_without_upload_contract')}
            </p>
          </div>
        </div>

        {/* Row 5: Action Buttons */}
        <div className="pt-6 border-t border-border flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="mgr-btn-secondary inline-flex items-center justify-center gap-2 text-sm font-semibold h-11 px-6 rounded-xl w-full sm:w-auto cursor-pointer"
          >
            <X size={15} className="text-secondary" />
            <span>{tManagerUi('cancel')}</span>
          </button>
          <button
            type="submit"
            className="mgr-btn-primary inline-flex items-center justify-center gap-2 text-sm font-semibold h-11 px-8 rounded-xl shadow-md w-full sm:w-auto cursor-pointer"
          >
            <Send size={15} />
            <span>Submit Ticket</span>
          </button>
        </div>
      </form>
    </>
  );
}
