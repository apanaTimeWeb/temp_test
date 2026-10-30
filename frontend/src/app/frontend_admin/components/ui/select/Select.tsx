'use client';
import { Children, isValidElement, useState, type ChangeEvent, type ReactNode } from 'react';

import { SelectContent, type SelectContentProps } from '@/components/ui/select/SelectContent';
import { SelectItem, type SelectItemProps } from '@/components/ui/select/SelectItem';
import { SelectTrigger, type SelectTriggerProps } from '@/components/ui/select/SelectTrigger';
import { SelectValue, type SelectValueProps } from '@/components/ui/select/SelectValue';
import type { SelectProps, SelectOption } from '@/app/frontend_admin/components/ui/select/types/AdminUiSelectComponentTypes';


export type { SelectContentProps, SelectItemProps, SelectTriggerProps, SelectValueProps };

function isComponentType(type: unknown, expectedName: string, expectedType: unknown): boolean {
  return type === expectedType || (typeof type === 'function' && (type.name === expectedName || (type as { displayName?: string }).displayName === expectedName));
}

function collectSelectValue(children: ReactNode): string | undefined {
  let placeholder: string | undefined;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isComponentType(child.type, 'SelectValue', SelectValue)) {
      const props = child.props as SelectValueProps;
      if (props.placeholder) placeholder = props.placeholder;
      return;
    }
    const nestedChildren = (child.props as { children?: ReactNode }).children;
    if (nestedChildren !== undefined) placeholder ??= collectSelectValue(nestedChildren);
  });
  return placeholder;
}

function findSelectContentClassName(children: ReactNode): string | undefined {
  let className: string | undefined;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isComponentType(child.type, 'SelectContent', SelectContent)) {
      className = (child.props as SelectContentProps).className;
      return;
    }
    const nestedChildren = (child.props as { children?: ReactNode }).children;
    if (nestedChildren !== undefined) className ??= findSelectContentClassName(nestedChildren);
  });
  return className;
}

function collectSelectOptions(children: ReactNode, options: SelectOption[] = []): SelectOption[] {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isComponentType(child.type, 'SelectItem', SelectItem)) {
      const props = child.props as SelectItemProps;
      const dataAttributes = Object.fromEntries(
        Object.entries(props).filter(([key, value]) =>
          key.startsWith('data-') && (typeof value === 'string' || typeof value === 'number'),
        ),
      ) as Record<string, string | number>;
      options.push({ value: props.value, label: props.children, disabled: props.disabled, dataAttributes });
      return;
    }
    const nestedChildren = (child.props as { children?: ReactNode }).children;
    if (nestedChildren !== undefined) collectSelectOptions(nestedChildren, options);
  });
  return options;
}

function findSelectTrigger(children: ReactNode): SelectTriggerProps | undefined {
  let trigger: SelectTriggerProps | undefined;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (isComponentType(child.type, 'SelectTrigger', SelectTrigger)) {
      trigger = child.props as SelectTriggerProps;
      return;
    }
    const nestedChildren = (child.props as { children?: ReactNode }).children;
    if (nestedChildren !== undefined) trigger ??= findSelectTrigger(nestedChildren);
  });
  return trigger;
}

/**
 * Native, keyboard-accessible select. Options are collected from SelectContent so they are
 * always children of the actual <select>, rather than invalid sibling <option> elements.
 */
export function Select({ value, defaultValue, onValueChange, children, disabled = false }: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const trigger = findSelectTrigger(children) ?? {};
  const placeholder = collectSelectValue(trigger.children) ?? collectSelectValue(children);
  const options = collectSelectOptions(children);
  const contentClassName = findSelectContentClassName(children) ?? '';
  const selectedValue = value ?? uncontrolledValue;
  const { children: _triggerChildren, onChange: triggerOnChange, className = '', ...triggerProps } = trigger;

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextValue = event.currentTarget.value;
    if (value === undefined) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
    triggerOnChange?.(event);
  }

  return (
    <select
      {...triggerProps}
      value={selectedValue}
      disabled={disabled || trigger.disabled}
      onChange={handleChange}
      className={`min-h-11 w-full rounded-md border border-border bg-input px-3 text-body text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page ${contentClassName} ${className}`.trim()}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled} {...option.dataAttributes}>{option.label}</option>
      ))}
    </select>
  );
}

export default Select;


export type { SelectProps };
