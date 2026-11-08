'use client';
import { useState } from 'react';
import { Cake, MessageSquare, Sparkles, Check, Phone } from 'lucide-react';
import { toast } from 'sonner';

export interface BirthdayStudent {
  id: string;
  name: string;
  smartId: string;
  seat: string;
  shift: string;
  branch: string;
  phone: string;
  age?: number;
}

const TODAY_BIRTHDAYS: BirthdayStudent[] = [
  {
    id: 'STU-101',
    name: 'Aman Verma',
    smartId: 'LIB-103',
    seat: 'Seat C-18',
    shift: 'Full Day Shift',
    branch: 'Main Central Branch',
    phone: '9876543210',
    age: 23,
  },
  {
    id: 'STU-102',
    name: 'Priya Singh',
    smartId: 'LIB-102',
    seat: 'Seat B-05',
    shift: 'Evening Shift',
    branch: 'Main Central Branch',
    phone: '8765432109',
    age: 22,
  },
  {
    id: 'STU-103',
    name: 'Rohan Mehta',
    smartId: 'LIB-107',
    seat: 'Seat A-12',
    shift: 'Morning Shift',
    branch: 'North Campus Branch',
    phone: '7654321098',
    age: 24,
  },
];

export function ManagerDashboardOverviewBirthdayWidget() {
  const [wishedIds, setWishedIds] = useState<Record<string, boolean>>({});

  const handleSendWish = (student: BirthdayStudent) => {
    const greeting = encodeURIComponent(
      `🎉 Dear ${student.name}, Heartiest Birthday Wishes from Library OS (${student.branch})! 🎂 Wishing you endless focus, good health, and grand success in your competitive exams and studies. Keep shining! 📚🌟`
    );
    const digits = (student.phone || '').replace(/\D/g, '');
    const targetPhone = digits.length === 10 ? `91${digits}` : digits;
    const popup = window.open(`https://wa.me/${targetPhone}?text=${greeting}`, '_blank');
    if (popup) popup.opener = null;
    setWishedIds((prev) => ({ ...prev, [student.id]: true }));
    toast.success(`Birthday greeting dispatched to ${student.name}!`);
  };

  return (
    <div className="rounded-2xl border border-border bg-linear-to-r from-card via-card to-primary-subtle p-5 sm:p-6 shadow-card transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning-bg border border-border text-warning flex items-center justify-center font-bold">
            <Cake size={22} className="text-primary animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-base sm:text-lg flex items-center gap-2">
              Today&apos;s Birthday Celebrations
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-bg text-success border border-border">
                <Sparkles size={12} /> {TODAY_BIRTHDAYS.length} Celebrating Today
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Send personalized WhatsApp birthday greetings to students studying at your library today.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TODAY_BIRTHDAYS.map((student) => {
          const isWished = wishedIds[student.id];
          return (
            <div
              key={student.id}
              className="p-4 rounded-xl bg-card border border-border hover:border-primary shadow-xs flex flex-col justify-between gap-3.5 transition-all group hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-linear-to-br from-amber-400 to-amber-600 text-primary-foreground font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {student.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-bold text-foreground text-sm truncate">{student.name}</p>
                    <span className="text-[11px] font-semibold text-warning bg-warning-bg border border-border px-2 py-0.5 rounded-full shrink-0">
                      🎂 Today
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {student.smartId} • {student.seat}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {student.shift} • {student.branch}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-border flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                  <Phone size={11} className="text-primary" /> +91 {student.phone.slice(0, 5)}...
                </span>
                <button
                  type="button"
                  onClick={() => handleSendWish(student)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
                    isWished
                      ? 'bg-muted text-muted-foreground border border-border'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                  title={`Send WhatsApp birthday wish to ${student.name}`}
                >
                  {isWished ? (
                    <>
                      <Check size={13} className="text-emerald-500" />
                      <span>Wished</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare size={13} />
                      <span>Send Wish</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

