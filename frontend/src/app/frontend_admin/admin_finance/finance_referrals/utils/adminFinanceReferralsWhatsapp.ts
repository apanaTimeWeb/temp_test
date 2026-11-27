'use client';

export function formatCleanPhoneNumber(rawPhone?: string): string {
  const digits = (rawPhone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.length === 10 ? `91${digits}` : digits;
}

export function buildWhatsAppLink(phone: string | undefined, message: string): string {
  const cleanPhone = formatCleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
}
