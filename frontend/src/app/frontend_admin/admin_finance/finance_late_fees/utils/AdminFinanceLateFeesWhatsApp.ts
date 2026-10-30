export function openAdminFinanceWhatsApp(phone: string, message: string): void {
  const normalized = phone.replace(/[^\d+]/g, '');
  const url = `https://wa.me/${encodeURIComponent(normalized)}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
