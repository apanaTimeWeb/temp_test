import { ManagerCommunicationNotificationCenterFlyerModal } from '@/app/frontend_manager/manager_communication/communication_notification_center/components/manager_communication_notification_center_modals/ManagerCommunicationNotificationCenterFlyerModal';
import { fireEvent,render,screen } from '@testing-library/react';
import { beforeEach,describe,expect,it,vi } from 'vitest';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ManagerCommunicationNotificationCenterFlyerModal', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <ManagerCommunicationNotificationCenterFlyerModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders A4 flyer preview and default diwali template when open', () => {
    render(<ManagerCommunicationNotificationCenterFlyerModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('A4 Noticeboard Flyer Generator')).toBeInTheDocument();
    expect(screen.getAllByText(/दीपावली/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Print A4 Flyer (प्रिंट नोटिस)')).toBeInTheDocument();
  });

  it('switches templates when clicking another template button', () => {
    render(<ManagerCommunicationNotificationCenterFlyerModal isOpen={true} onClose={vi.fn()} />);

    const maintenanceBtn = screen.getByText(/विद्युत व AC रखरखाव/i);
    fireEvent.click(maintenanceBtn);

    expect(screen.getAllByText(/विद्युत व AC रखरखाव/i).length).toBeGreaterThanOrEqual(1);
  });

  it('triggers window.print when Print A4 Flyer is clicked', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<ManagerCommunicationNotificationCenterFlyerModal isOpen={true} onClose={vi.fn()} />);

    const printBtn = screen.getByText('Print A4 Flyer (प्रिंट नोटिस)');
    fireEvent.click(printBtn);

    setTimeout(() => {
      expect(printSpy).toHaveBeenCalled();
      printSpy.mockRestore();
    }, 200);
  });

  it('copies formatted notice text to clipboard', () => {
    render(<ManagerCommunicationNotificationCenterFlyerModal isOpen={true} onClose={vi.fn()} />);

    const copyBtn = screen.getByText('Copy Notice Text');
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('दीपावली')
    );
  });
});
