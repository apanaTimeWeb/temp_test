import { describe, expect, it } from 'vitest';

describe('Admin Communication Complaints Search & Complainant Links', () => {
  const mockComplaints = [
    {
      id: 'CMP-101',
      title: 'AC cooling issue in Hall A',
      student: 'Rohan Sharma',
      phone: '9876543210',
      seatNumber: 'Seat S-12',
      status: 'Open',
      branch: 'Downtown',
      description: 'Temperature is too high',
    },
    {
      id: 'CMP-102',
      title: 'WiFi intermittent',
      student: 'Priya Patel',
      phone: '9876543211',
      seatNumber: 'Seat B-05',
      status: 'Resolved',
      branch: 'Downtown',
      description: 'Frequent disconnection in evening',
    },
    {
      id: 'CMP-103',
      title: 'Locker lock stuck',
      student: 'Vikram Singh',
      phone: '9876543212',
      seatNumber: 'Locker L-14',
      status: 'In Progress',
      branch: 'City Center',
      description: 'Key not turning smoothly',
    },
  ];

  it('filters complaints by complainant student name', () => {
    const q = 'Priya';
    const results = mockComplaints.filter(
      (c) =>
        c.student.toLowerCase().includes(q.toLowerCase()) ||
        c.seatNumber.toLowerCase().includes(q.toLowerCase()) ||
        c.id.toLowerCase().includes(q.toLowerCase()) ||
        c.title.toLowerCase().includes(q.toLowerCase()),
    );
    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('CMP-102');
  });

  it('filters complaints by seat / room number', () => {
    const q = 'S-12';
    const results = mockComplaints.filter(
      (c) =>
        c.student.toLowerCase().includes(q.toLowerCase()) ||
        c.seatNumber.toLowerCase().includes(q.toLowerCase()) ||
        c.id.toLowerCase().includes(q.toLowerCase()) ||
        c.title.toLowerCase().includes(q.toLowerCase()),
    );
    expect(results).toHaveLength(1);
    expect(results[0]?.student).toBe('Rohan Sharma');
  });

  it('filters complaints by complaint ticket ID', () => {
    const q = 'CMP-103';
    const results = mockComplaints.filter(
      (c) =>
        c.student.toLowerCase().includes(q.toLowerCase()) ||
        c.seatNumber.toLowerCase().includes(q.toLowerCase()) ||
        c.id.toLowerCase().includes(q.toLowerCase()) ||
        c.title.toLowerCase().includes(q.toLowerCase()),
    );
    expect(results).toHaveLength(1);
    expect(results[0]?.student).toBe('Vikram Singh');
  });

  it('generates WhatsApp update link for complainant', () => {
    const complaint = mockComplaints[0]!;
    const message = `Hello ${complaint.student}, Regarding your complaint #${complaint.id} (${complaint.title}): Status is currently ${complaint.status}.`;
    const waUrl = `https://wa.me/91${complaint.phone}?text=${encodeURIComponent(message)}`;
    expect(waUrl).toContain('https://wa.me/919876543210');
    expect(waUrl).toContain('CMP-101');
    expect(waUrl).toContain('Rohan');
  });

  it('generates phone call link for direct call to complainant', () => {
    const complaint = mockComplaints[0]!;
    const callUrl = `tel:${complaint.phone}`;
    expect(callUrl).toBe('tel:9876543210');
  });
});
