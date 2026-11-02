/** Validates a phone number shape locally without attempting provider delivery. */
export function isAdminCommunicationPhoneNumberValid(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || !/^\+?[0-9().\s-]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}
