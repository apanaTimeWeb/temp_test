export namespace logger {
  export function info(...args: unknown[]): void {
    console.info(...args);
  }
  export function warn(...args: unknown[]): void {
    console.warn(...args);
  }
  export function error(...args: unknown[]): void {
    console.error(...args);
  }
}

