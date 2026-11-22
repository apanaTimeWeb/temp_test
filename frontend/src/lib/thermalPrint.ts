export function printThermal(payload: Record<string, unknown>): void {
  if (typeof window !== 'undefined') {
    try {
      console.info('[ThermalPrint] Print payload dispatched:', payload);
    } catch {
      // Safe fallback
    }
  }
}
