/**
 * Narrow ambient fallback contracts for the autonomous submodule ZIP harness.
 * These declarations are for standalone source analysis only. Real host modules
 * take precedence when integrated into the application; no backend behavior is implied.
 */
declare module '@/lib/api' {
  export function apiFetch<TResponse = unknown>(path: string, options?: RequestInit): Promise<TResponse>;
}
declare module '@/lib/logger' {
  export function logger(...args: unknown[]): void;
  export namespace logger {
    function debug(...args: unknown[]): void;
    function info(...args: unknown[]): void;
    function warn(...args: unknown[]): void;
    function error(...args: unknown[]): void;
  }
}
declare module '@/lib/socket' {
  export function getSocket(): unknown;
  export namespace socketService {
    function emit(event: string, payload: unknown): void;
    function subscribe<T>(event: string, callback: (data: T) => void): () => void;
  }
}
declare module '@/lib/display_value' {
  export function displayValue(value: unknown, fallback?: string): string;
}
declare module '@/components/ui/*' {
  import type * as React from 'react';
  type HostUiProps = React.PropsWithChildren<{
    className?: string; id?: string; title?: string; disabled?: boolean; type?: string;
    value?: string; defaultValue?: string; checked?: boolean; defaultChecked?: boolean;
    name?: string; htmlFor?: string; placeholder?: string; variant?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    onValueChange?: (value: string) => void;
    open?: boolean; onOpenChange?: (open: boolean) => void;
    'aria-label'?: string; 'aria-labelledby'?: string; 'aria-describedby'?: string;
    'aria-invalid'?: boolean; 'aria-pressed'?: boolean; 'data-testid'?: string;
  } & Record<string, unknown>>;
  export default function HostUiPrimitive(props: HostUiProps): React.ReactElement | null;
  export function Button(props: HostUiProps): React.ReactElement | null;
  export function Badge(props: HostUiProps): React.ReactElement | null;
  export function Card(props: HostUiProps): React.ReactElement | null;
  export function CardContent(props: HostUiProps): React.ReactElement | null;
  export function CardDescription(props: HostUiProps): React.ReactElement | null;
  export function CardFooter(props: HostUiProps): React.ReactElement | null;
  export function CardHeader(props: HostUiProps): React.ReactElement | null;
  export function CardTitle(props: HostUiProps): React.ReactElement | null;
  export function Dialog(props: HostUiProps): React.ReactElement | null;
  export function DialogContent(props: HostUiProps): React.ReactElement | null;
  export function DialogDescription(props: HostUiProps): React.ReactElement | null;
  export function DialogFooter(props: HostUiProps): React.ReactElement | null;
  export function DialogHeader(props: HostUiProps): React.ReactElement | null;
  export function DialogTitle(props: HostUiProps): React.ReactElement | null;
  export function DialogTrigger(props: HostUiProps): React.ReactElement | null;
  export function Input(props: HostUiProps): React.ReactElement | null;
  export function Label(props: HostUiProps): React.ReactElement | null;
  export function Select(props: HostUiProps): React.ReactElement | null;
  export function SelectContent(props: HostUiProps): React.ReactElement | null;
  export function SelectItem(props: HostUiProps): React.ReactElement | null;
  export function SelectTrigger(props: HostUiProps): React.ReactElement | null;
  export function SelectValue(props: HostUiProps): React.ReactElement | null;
  export function Switch(props: HostUiProps): React.ReactElement | null;
  export function Tabs(props: HostUiProps): React.ReactElement | null;
  export function TabsContent(props: HostUiProps): React.ReactElement | null;
  export function TabsList(props: HostUiProps): React.ReactElement | null;
  export function TabsTrigger(props: HostUiProps): React.ReactElement | null;
  export function Skeleton(props: HostUiProps): React.ReactElement | null;
}
