import { fireEvent,render,screen } from '@testing-library/react';
import { describe,expect,it,vi } from 'vitest';
import ManagerFinanceAutoSuspendKioskModal from '../components/manager_finance_auto_suspend_views/ManagerFinanceAutoSuspendKioskModal';

describe('Module 19: Auto Suspend - QR Kiosk Block Sync & Access Denied Simulation', () => {
  const sampleSuspended = [
    {
      id: 101,
      studentId: 101,
      studentName: 'Rahul Kumar',
      smartId: 'STU101',
      seat: 'A-12',
      shift: 'Morning',
      daysOverdue: 14,
      suspendedSince: '2026-03-28',
    },
  ];

  it('triggers bright red ACCESS DENIED screen and alert buzzer for suspended student', () => {
    const handleClose = vi.fn();

    render(
      <ManagerFinanceAutoSuspendKioskModal
        isOpen={true}
        onClose={handleClose}
        suspendedStudents={sampleSuspended}
        initialStudent={sampleSuspended[0]}
      />
    );

    // Verify modal title
    expect(screen.getByText('Entrance Gate QR Kiosk Simulator')).toBeInTheDocument();

    // Click Scan QR button
    const scanBtn = screen.getByTestId('simulate-kiosk-scan-btn');
    fireEvent.click(scanBtn);

    // Verify ACCESS DENIED screen appears
    const deniedScreen = screen.getByTestId('kiosk-access-denied-screen');
    expect(deniedScreen).toBeInTheDocument();
    expect(screen.getByText('ACCESS DENIED - CONTACT DESK')).toBeInTheDocument();
    expect(screen.getByText(/Turnstile Flap Barred \(100% Synced\)/)).toBeInTheDocument();
    expect(screen.getByText(/Audio Alert Buzzer Ringing At Entrance/)).toBeInTheDocument();
  });

  it('triggers ACCESS GRANTED for active regular student', () => {
    render(
      <ManagerFinanceAutoSuspendKioskModal
        isOpen={true}
        onClose={vi.fn()}
        suspendedStudents={sampleSuspended}
      />
    );

    // Select active student option
    const select = screen.getByTestId('kiosk-student-select');
    fireEvent.change(select, { target: { value: 'active-student-test' } });

    // Scan
    const scanBtn = screen.getByTestId('simulate-kiosk-scan-btn');
    fireEvent.click(scanBtn);

    // Verify ACCESS GRANTED screen
    const grantedScreen = screen.getByTestId('kiosk-access-granted-screen');
    expect(grantedScreen).toBeInTheDocument();
    expect(screen.getByText('ACCESS GRANTED - WELCOME')).toBeInTheDocument();
    expect(screen.getByText(/Turnstile Gate Flap Opened/)).toBeInTheDocument();
  });
});
