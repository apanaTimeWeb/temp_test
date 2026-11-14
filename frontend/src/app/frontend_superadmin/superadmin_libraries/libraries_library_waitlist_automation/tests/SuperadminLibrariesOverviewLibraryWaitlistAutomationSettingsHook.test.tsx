import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSuperadminLibrariesWaitlistAutomationState } from '../hooks/useSuperadminLibrariesWaitlistAutomationState';

describe('waitlist automation local settings validation', () => {
  it('validates a non-negative integer delay without defining a write contract', async () => {
    const { result } = renderHook(() => useSuperadminLibrariesWaitlistAutomationState('नमस्ते {name}'));
    expect(result.current.form.getValues()).toEqual({ delay: 0, template: 'नमस्ते {name}' });

    await act(async () => {
      result.current.form.setValue('template', '   ');
      await result.current.form.trigger('template');
    });
    expect(result.current.form.getFieldState('template').error?.message).toBe('COPY.MESSAGE_TEMPLATE_REQUIRED');

    await act(async () => {
      result.current.form.setValue('template', 'नमस्ते {name}');
      await result.current.form.trigger('template');
    });
    expect(result.current.form.getFieldState('template').error).toBeUndefined();

    await act(async () => {
      result.current.form.setValue('delay', -1);
      await result.current.form.trigger('delay');
    });
    expect(result.current.form.getFieldState('delay').error?.message).toBe('COPY.NOTIFICATION_DELAY_NON_NEGATIVE');

    await act(async () => {
      result.current.form.setValue('delay', 0);
      await result.current.form.trigger('delay');
    });
    expect(result.current.form.getFieldState('delay').error).toBeUndefined();
  });
});
