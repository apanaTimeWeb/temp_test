'use client';
// RESPONSIBILITY: Modals for creating/editing, deleting, and broadcasting notices with Cyber-Luxury styling.
// FLOW: SuperadminCommunicationNoticesPageClient -> SuperadminCommunicationNoticesModals.

import React from 'react';
import { Plus, X, AlertTriangle, Send } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { SuperadminCommunicationNoticeFormValues } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/schemas/SuperadminCommunicationNoticesNoticeSchema';
import type { SuperadminCommunicationNotice as Notice } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/types/SuperadminCommunicationNoticesTypes';
import { useTranslations } from 'next-intl';
import { useSuperadminCommunicationNoticesValidationMessage } from '@/app/frontend_superadmin/superadmin_communication/communication_notices/hooks/useSuperadminCommunicationNoticesValidationMessage';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

interface NoticesModalsProps {
  showAdd: boolean;
  editItem: Notice | null;
  deleteItem: Notice | null;
  broadcastItem: Notice | null;
  form: UseFormReturn<SuperadminCommunicationNoticeFormValues>;
  onCloseAdd: () => void;
  onSave: (values: SuperadminCommunicationNoticeFormValues) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onCancelBroadcast: () => void;
  onConfirmBroadcast: () => void;
}

const today = new Date().toISOString().split('T')[0];

export function SuperadminCommunicationNoticesModals({
  showAdd,
  editItem,
  deleteItem,
  broadcastItem,
  form,
  onCloseAdd,
  onSave,
  onCancelDelete,
  onConfirmDelete,
  onCancelBroadcast,
  onConfirmBroadcast,
}: NoticesModalsProps) {
  const tCopy = useTranslations('SUPERADMIN_COMMUNICATION');
  const translateValidationMessage = useSuperadminCommunicationNoticesValidationMessage();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  useModalScrollLock(Boolean(showAdd || deleteItem || broadcastItem));

  return (
    <>
      {/* Add / Edit Notice Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-hidden animate-in fade-in duration-200"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCloseAdd();
          }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-indigo-500/30 bg-slate-950/95 p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 ease-out">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
              <p className="text-base font-bold text-white flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400">
                  <Plus size={18} />
                </div>
                <span>{editItem ? tCopy('COPY.EDIT_NOTICE_ACTION') : tCopy('COPY.POST_NOTICE_ACTION')}</span>
              </p>
              <button
                type="button"
                onClick={onCloseAdd}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                aria-label={tCopy('COPY.CLOSE_ADD_EDIT_NOTICE_DIALOG')}
                data-testid="superadmin-communication-communication-notices-close-add-edit-notice-dialog-5"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSave)}
              noValidate
              className="space-y-4"
              data-testid="superadmin-superadmin-communication-notices-page-client-form-line-119"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="notice-title">
                  {tCopy('COPY.TITLE')} <span className="text-rose-400">*</span>
                </label>
                <input
                  id="notice-title"
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-all shadow-inner"
                  placeholder={tCopy('COPY.NOTICE_TITLE')}
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? 'notice-title-error' : undefined}
                  {...register('title')}
                  data-testid="superadmin-communication-communication-notices-notice-title-6"
                />
                {errors.title && (
                  <p id="notice-title-error" className="mt-1 text-xs text-rose-400" role="alert">
                    {translateValidationMessage(errors.title.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="notice-message">
                  {tCopy('COPY.MESSAGE')} <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="notice-message"
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 resize-none transition-all shadow-inner"
                  rows={4}
                  placeholder={tCopy('COPY.NOTICE_MESSAGE')}
                  aria-invalid={Boolean(translateValidationMessage(errors.message?.message))}
                  aria-describedby={translateValidationMessage(errors.message?.message) ? 'notice-message-error' : undefined}
                  {...register('message')}
                  data-testid="superadmin-communication-communication-notices-notice-message-7"
                />
                {translateValidationMessage(errors.message?.message) && (
                  <p id="notice-message-error" className="mt-1 text-xs text-rose-400" role="alert">
                    {translateValidationMessage(errors.message?.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5" htmlFor="notice-valid-till">
                  {tCopy('COPY.VALID_TILL')} <span className="text-rose-400">*</span>
                </label>
                <input
                  id="notice-valid-till"
                  type="date"
                  className="w-full rounded-xl border border-indigo-500/25 bg-slate-900/90 px-3.5 py-2.5 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400 [color-scheme:dark] transition-all shadow-inner cursor-pointer"
                  min={today}
                  aria-invalid={Boolean(errors.validTill)}
                  aria-describedby={errors.validTill ? 'notice-valid-till-error' : undefined}
                  {...register('validTill')}
                  data-testid="superadmin-communication-communication-notices-notice-valid-till-8"
                />
                {errors.validTill && (
                  <p id="notice-valid-till-error" className="mt-1 text-xs text-rose-400" role="alert">
                    {translateValidationMessage(errors.validTill.message)}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-indigo-500/20">
                <button
                  type="button"
                  onClick={onCloseAdd}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
                  data-testid="superadmin-communication-communication-notices-cancel-9"
                >
                  {tCopy('COPY.CANCEL')}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  disabled={isSubmitting}
                  data-testid="superadmin-communication-communication-notices-update-notice-preview-10"
                >
                  {editItem ? tCopy('COPY.UPDATE_NOTICE_PREVIEW') : tCopy('COPY.POST_NOTICE_PREVIEW')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-hidden animate-in fade-in duration-200"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCancelDelete();
          }}
        >
          <div className="w-full max-w-sm rounded-3xl border border-rose-500/30 bg-slate-950/95 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 ease-out">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertTriangle size={20} />
              <p className="text-base font-bold text-white">{tCopy('COPY.DELETE_NOTICE')}</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed" id="notice-delete-unavailable">
              {tCopy('COPY.NOTICE_DELETE_UNAVAILABLE_NO_CHANGE')}
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-rose-500/20">
              <button
                type="button"
                onClick={onCancelDelete}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
                data-testid="superadmin-communication-communication-notices-cancel-11"
              >
                {tCopy('COPY.CANCEL')}
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled
                className="px-4 py-2 rounded-xl bg-rose-600/50 text-white text-xs font-bold opacity-50 cursor-not-allowed"
                data-testid="superadmin-communication-communication-notices-delete-12"
              >
                {tCopy('COPY.DELETE')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Confirmation Modal */}
      {broadcastItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-hidden animate-in fade-in duration-200"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onCancelBroadcast();
          }}
        >
          <div className="w-full max-w-sm rounded-3xl border border-sky-500/30 bg-slate-950/95 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 ease-out">
            <div className="flex items-center gap-2.5 text-sky-400">
              <Send size={20} />
              <p className="text-base font-bold text-white">{tCopy('COPY.BROADCAST_VIA_WHATSAPP')}</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed" id="notice-broadcast-unavailable">
              {tCopy('COPY.NOTICE_BROADCAST_UNAVAILABLE_NO_CHANGE')}
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-sky-500/20">
              <button
                type="button"
                onClick={onCancelBroadcast}
                className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-all cursor-pointer"
                data-testid="superadmin-communication-communication-notices-cancel-13"
              >
                {tCopy('COPY.CANCEL')}
              </button>
              <button
                type="button"
                onClick={onConfirmBroadcast}
                disabled
                className="px-4 py-2 rounded-xl bg-sky-600/50 text-white text-xs font-bold opacity-50 cursor-not-allowed"
                data-testid="superadmin-communication-communication-notices-broadcast-14"
              >
                {tCopy('COPY.BROADCAST')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
