// RESPONSIBILITY: Apply the declared safe formatting or masking rule for users directory; it does not replace authoritative server-side authorization.
// FLOW: Feature display boundary -> superadmin_users/users_directory/utils/SuperadminUsersDirectoryMaskSensitiveData.ts -> local masking/sanitization rule -> safe presentation.
/** Masks confidential email addresses and PII phone numbers for list views. 
 * @param value - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function maskSensitiveData(value: string): string {
  if (value.includes('@')) {
    const [localPart, domainPart = ''] = value.split('@');
    if (!localPart || !domainPart) return '•••';
    const [domainName, ...suffixParts] = domainPart.split('.');
    const suffix = suffixParts.length ? `.${suffixParts.join('.')}` : '';
    return `${localPart.slice(0, 1)}***@${domainName.slice(0, 1)}***${suffix}`;
  }
  if (value.includes('*')) return value;
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 4) return value;
  return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}
