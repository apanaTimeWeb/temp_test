export function openAdminFinanceWhatsApp(phone: string, message: string): void {
  const normalized = phone.replace(/[^\d+]/g, '');
  const url = `https://wa.me/${encodeURIComponent(normalized)}?text=${encodeURIComponent(message)}`;
  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (!popup) throw new Error('WhatsApp pop-up was blocked by the browser.');
}
