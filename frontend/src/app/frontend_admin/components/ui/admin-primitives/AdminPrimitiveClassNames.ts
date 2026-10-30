/** Joins optional class tokens for zero-business shared UI primitives. */
export function joinAdminPrimitiveClasses(...values: Array<string | false | null | undefined>): string {
  return values.filter((value): value is string => typeof value === 'string' && value.length > 0).join(' ');
}

/** Backward-compatible generic class join for zero-business UI consumers. */
export function cn(...inputs: Array<string | false | null | undefined>): string { return joinAdminPrimitiveClasses(...inputs); }
