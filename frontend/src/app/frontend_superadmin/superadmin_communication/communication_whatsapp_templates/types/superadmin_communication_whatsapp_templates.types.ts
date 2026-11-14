// FLOW: WhatsApp templates leaf contracts -> components/hooks/error boundary and synthetic fixtures.
/** Stable semantic icon keys used by the WhatsApp template preview selector. */
export type SuperadminCommunicationWhatsappTemplateIcon =
  | 'hand' | 'wallet' | 'repeat' | 'receipt' | 'megaphone' | 'calendar-days' | 'handshake';

/** Public synthetic preview contract. Preview content is local and is never published or sent. */
export interface SuperadminCommunicationWhatsappTemplatePreview {
  id: string;
  labelKey: string;
  icon: SuperadminCommunicationWhatsappTemplateIcon;
  bodyKey: string;
}

/** Route error-boundary props owned by the templates leaf. */
export type SuperadminCommunicationWhatsappTemplatesErrorFallbackProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/** Route error module props use the same leaf-owned boundary contract. */
export type SuperadminCommunicationWhatsappTemplatesModuleErrorProps = SuperadminCommunicationWhatsappTemplatesErrorFallbackProps;

/** Page Client route input contract. */
export type SuperadminCommunicationWhatsappTemplatesPageClientProps = { id?: string };
