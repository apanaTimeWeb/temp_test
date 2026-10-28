export namespace socket {
  export function on(event: string, handler: (...args: unknown[]) => void): unknown {
    return { event, handler };
  }
  export function off(event: string, handler?: (...args: unknown[]) => void): unknown {
    return { event, handler };
  }
  export function emit(event: string, ...args: unknown[]): unknown {
    return { event, args };
  }
}

