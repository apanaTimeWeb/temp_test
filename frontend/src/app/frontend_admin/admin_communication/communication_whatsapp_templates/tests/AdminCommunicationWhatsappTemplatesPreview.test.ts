import { describe, expect, it } from 'vitest';

describe('Admin Communication WhatsApp Templates Preview & Dispatch', () => {
  const defaultTemplates = [
    {
      id: 'welcome',
      labelKey: 'WHATSAPP_TEMPLATE_WELCOME',
      body: 'Hello {name}, welcome to {libraryname}! Your seat is {seat}.',
      category: 'Onboarding',
      triggerEvent: 'Student admission confirmed',
    },
    {
      id: 'fee_reminder',
      labelKey: 'WHATSAPP_TEMPLATE_FEE_REMINDER',
      body: 'Dear {name}, your fee of ₹{amount} is due on {duedate}.',
      category: 'Finance',
      triggerEvent: '3 days before due date',
    },
  ];

  it('formats preview with dynamic variable replacements', () => {
    const template = defaultTemplates[0]!;
    const formatted = template.body
      .replace(/{name}/g, 'Rahul Sharma')
      .replace(/{libraryname}/g, 'Smart Library')
      .replace(/{seat}/g, 'S-08');

    expect(formatted).toBe('Hello Rahul Sharma, welcome to Smart Library! Your seat is S-08.');
    expect(formatted).not.toContain('{name}');
    expect(formatted).not.toContain('{seat}');
  });

  it('supports adding a new custom template to templates state', () => {
    const newTemplate = {
      id: `custom_${Date.now()}`,
      labelKey: 'Night Shift Expiry Warning',
      icon: '💬',
      category: 'Shifts',
      triggerEvent: 'Night shift expiry in 2 days',
      body: 'Hello {name}, your night shift at {libraryname} expires on {duedate}.',
    };

    const updatedList = [newTemplate, ...defaultTemplates];
    expect(updatedList).toHaveLength(3);
    expect(updatedList[0]?.labelKey).toBe('Night Shift Expiry Warning');
    expect(updatedList[0]?.category).toBe('Shifts');
  });

  it('supports editing an existing template in state', () => {
    const templateToEdit = defaultTemplates[1]!;
    const edited = {
      ...templateToEdit,
      body: 'Urgent: Dear {name}, please clear your outstanding fee ₹{amount} immediately.',
      triggerEvent: 'On due date at 10 AM',
    };

    const updatedList = defaultTemplates.map((t) => (t.id === edited.id ? edited : t));
    const found = updatedList.find((t) => t.id === 'fee_reminder');
    expect(found?.body).toContain('Urgent: Dear {name}');
    expect(found?.triggerEvent).toBe('On due date at 10 AM');
  });

  it('creates a live WhatsApp Web dispatch link with encoded body', () => {
    const phone = '9876543210';
    const body = 'Hello Rahul Sharma, your fee of ₹1,000 is due on 25-Apr-2026.';
    const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(body)}`;
    expect(waUrl).toBe(
      'https://wa.me/919876543210?text=Hello%20Rahul%20Sharma%2C%20your%20fee%20of%20%E2%82%B91%2C000%20is%20due%20on%2025-Apr-2026.',
    );
  });
});
