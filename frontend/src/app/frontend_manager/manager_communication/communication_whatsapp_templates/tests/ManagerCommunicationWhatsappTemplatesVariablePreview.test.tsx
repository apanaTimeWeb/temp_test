import { fireEvent,render,screen } from '@testing-library/react';
import { beforeEach,describe,expect,it,vi } from 'vitest';
import {
analyzeVariables,
ManagerCommunicationWhatsappTemplatesVariablePreview
} from '../components/manager_communication_whatsapp_templates_views/ManagerCommunicationWhatsappTemplatesVariablePreview';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ManagerCommunicationWhatsappTemplatesVariablePreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof navigator !== 'undefined') {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });
    }
  });

  describe('analyzeVariables helper', () => {
    it('identifies valid standard tokens', () => {
      const template = 'Hello {name}, your fee of {amount} is due on {duedate}. Seat: {seat}.';
      const result = analyzeVariables(template);
      expect(result.isAllValid).toBe(true);
      expect(result.validTokens).toContain('{name}');
      expect(result.validTokens).toContain('{amount}');
      expect(result.validTokens).toContain('{duedate}');
      expect(result.validTokens).toContain('{seat}');
      expect(result.aliasTokens).toHaveLength(0);
      expect(result.unknownTokens).toHaveLength(0);
    });

    it('identifies non-standard aliases and suggests canonical replacements', () => {
      const template = 'Hi {student_name}, please pay {fee} before {due_date}.';
      const result = analyzeVariables(template);
      expect(result.isAllValid).toBe(false);
      expect(result.aliasTokens).toEqual([
        { token: '{student_name}', suggested: '{name}' },
        { token: '{fee}', suggested: '{amount}' },
        { token: '{due_date}', suggested: '{duedate}' },
      ]);
    });

    it('identifies unrecognized/broken variables', () => {
      const template = 'Welcome {name}, your coupon is {coupon_xyz}.';
      const result = analyzeVariables(template);
      expect(result.isAllValid).toBe(false);
      expect(result.unknownTokens).toEqual(['{coupon_xyz}']);
    });
  });

  describe('UI Component Rendering & Profile Switching', () => {
    const sampleBody = 'Dear {name}, fee {amount} due on {duedate}. Assigned seat: {seat}.';

    it('renders default profile (Rahul Sharma) data in preview', () => {
      render(<ManagerCommunicationWhatsappTemplatesVariablePreview body={sampleBody} />);

      expect(screen.getByText(/Live Student Variable Preview/i)).toBeInTheDocument();
      expect(screen.getByText(/Variables OK/i)).toBeInTheDocument();
      // Rahul Sharma should appear
      expect(screen.getByText(/Dear Rahul Sharma, fee ₹1,000 due on 15-Apr-2026/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Seat S-03 \(Hall A\)/i).length).toBeGreaterThanOrEqual(1);
    });

    it('switches to another student profile (Priya Patel) when clicked', () => {
      render(<ManagerCommunicationWhatsappTemplatesVariablePreview body={sampleBody} />);

      const priyaButton = screen.getByRole('button', { name: /Priya Patel/i });
      fireEvent.click(priyaButton);

      // Now Priya Patel's details should be displayed in preview
      expect(screen.getByText(/Dear Priya Patel, fee ₹1,500 due on 10-May-2026/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Cabin C-09 \(Quiet Zone\)/i).length).toBeGreaterThanOrEqual(1);
    });

    it('switches to Vikramaditya C. Rao and displays full details', () => {
      render(<ManagerCommunicationWhatsappTemplatesVariablePreview body={sampleBody} />);

      const vikramButton = screen.getByRole('button', { name: /Vikramaditya C. Rao/i });
      fireEvent.click(vikramButton);

      expect(screen.getByText(/Dear Vikramaditya C. Rao, fee ₹2,400 due on 01-Jun-2026/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Seat D-22 \(AC Hall B\)/i).length).toBeGreaterThanOrEqual(1);
    });

    it('allows entering custom student values and updates preview live', () => {
      render(<ManagerCommunicationWhatsappTemplatesVariablePreview body={sampleBody} />);

      const customTab = screen.getByRole('button', { name: /Custom Student Data/i });
      fireEvent.click(customTab);

      // Inputs should appear
      const nameInput = screen.getByPlaceholderText('e.g. Rohit Verma');
      fireEvent.change(nameInput, { target: { value: 'Aarav Gupta' } });

      const amountInput = screen.getByPlaceholderText('e.g. ₹1,200');
      fireEvent.change(amountInput, { target: { value: '₹3,500' } });

      expect(screen.getByText(/Dear Aarav Gupta, fee ₹3,500/i)).toBeInTheDocument();
    });

    it('displays alias alert banner and allows 1-click auto-fix', () => {
      const aliasBody = 'Hello {student_name}, your fee is {fee}.';
      const onUpdateBody = vi.fn();

      render(
        <ManagerCommunicationWhatsappTemplatesVariablePreview
          body={aliasBody}
          onUpdateBody={onUpdateBody}
        />
      );

      expect(screen.getByText(/Non-standard variable token detected/i)).toBeInTheDocument();
      const autoFixButton = screen.getByRole('button', { name: /Auto-Fix All Aliases/i });
      fireEvent.click(autoFixButton);

      expect(onUpdateBody).toHaveBeenCalledWith('Hello {name}, your fee is {amount}.');
    });

    it('displays unknown variable warning badge and banner', () => {
      const unknownBody = 'Notice to {name}: {random_code} is your code.';
      render(<ManagerCommunicationWhatsappTemplatesVariablePreview body={unknownBody} />);

      expect(screen.getByText(/Unknown Variable/i)).toBeInTheDocument();
      expect(screen.getByText(/Unrecognized variables detected: {random_code}/i)).toBeInTheDocument();
    });

    it('toggles variable highlighting mode', () => {
      render(<ManagerCommunicationWhatsappTemplatesVariablePreview body={sampleBody} />);

      const highlightToggle = screen.getByRole('button', { name: /Highlight Variables/i });
      fireEvent.click(highlightToggle);

      expect(screen.getByRole('button', { name: /Realistic View/i })).toBeInTheDocument();
    });

    it('copies preview message to clipboard', () => {
      render(<ManagerCommunicationWhatsappTemplatesVariablePreview body={sampleBody} />);

      const copyButton = screen.getByRole('button', { name: /Copy/i });
      fireEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });
});
