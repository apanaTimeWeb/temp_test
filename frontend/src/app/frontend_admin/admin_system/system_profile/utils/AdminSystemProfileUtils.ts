/**
 * @description Joins CSS class tokens without introducing a feature dependency on a global class-merging package.
 * @dependencies None.
 * @edge-case Falsy tokens are ignored; string tokens are preserved in their original order.
 */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter((value): value is string => typeof value === 'string' && value.length > 0).join(' ');
}
