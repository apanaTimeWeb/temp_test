'use client';
import React, { type ButtonHTMLAttributes, type MouseEvent, type MouseEventHandler, type ReactElement, type ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import type { ButtonProps, ButtonAsChildElementProps } from '@/app/frontend_admin/components/ui/button/types/AdminUiButtonComponentTypes';


export function Button({
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  loadingLabel,
  disabled = false,
  className = '',
  children,
  onClick,
  ...props
}: ButtonProps) {
  const resolvedDisabled = disabled || loading;
  const classes = [
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 font-medium motion-safe:transition-colors motion-safe:duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page',
    size === 'sm' ? 'min-h-11 px-3 text-caption' : size === 'icon' ? 'h-11 w-11 p-0' : 'text-body',
    variant === 'danger' || variant === 'destructive'
      ? 'bg-danger text-on-danger hover:bg-danger'
      : variant === 'outline'
        ? 'border border-border bg-card text-primary hover:bg-surface-hover'
        : variant === 'ghost'
          ? 'bg-transparent text-primary hover:bg-surface-hover'
          : 'bg-primary text-on-primary hover:bg-primary-hover',
    resolvedDisabled ? 'cursor-not-allowed opacity-60' : '',
    className,
  ].filter(Boolean).join(' ');

  if (asChild && React.isValidElement(children)) {
    const element = children as unknown as ReactElement<ButtonAsChildElementProps>;
    const childProps = element.props;
    const childAriaDisabled = childProps['aria-disabled'] === true || childProps['aria-disabled'] === 'true';
    const childDisabled = resolvedDisabled || childProps.disabled === true || childAriaDisabled;
    const childClick = childProps.onClick;
    const mergedProps = {
      ...props,
      className: `${classes} ${childProps.className ?? ''}`.trim(),
      'aria-disabled': childDisabled || childProps['aria-disabled'] || undefined,
      'aria-busy': loading || props['aria-busy'] || childProps['aria-busy'] || undefined,
      tabIndex: childDisabled ? -1 : childProps.tabIndex ?? props.tabIndex,
      onClick: (event: MouseEvent<HTMLElement>) => {
        if (childDisabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        childClick?.(event);
        if (!event.defaultPrevented) onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
      },
    } as unknown as Partial<ButtonAsChildElementProps>;
    return React.cloneElement(
      element,
      mergedProps,
      <>
        {loading ? <LoaderCircle size={18} strokeWidth={2} aria-hidden="true" className="motion-safe:animate-spin motion-reduce:hidden" /> : null}
        {loading && loadingLabel ? <span className="sr-only">{loadingLabel}</span> : null}
        {childProps.children}
      </>,
    );
  }

  return (
    <button
      type="button"
      {...props}
      disabled={resolvedDisabled}
      aria-busy={loading || props['aria-busy'] || undefined}
      onClick={onClick}
      className={classes}
    >
      {loading ? <LoaderCircle size={18} strokeWidth={2} aria-hidden="true" className="motion-safe:animate-spin motion-reduce:hidden" /> : null}
      {loading && loadingLabel ? <span className="sr-only">{loadingLabel}</span> : null}
      {children}
    </button>
  );
}

export default Button;


export type { ButtonProps };
