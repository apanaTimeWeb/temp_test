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
    window.open(`https://wa.me/91${student.phone}?text=${greeting}`, '_blank');
    setWishedIds((prev) => ({ ...prev, [student.id]: true }));
    toast.success(`Birthday greeting dispatched to ${student.name}!`);
  };

  return (
    <div className="mgr-card p-5 border border-primary/20 bg-linear-to-r from-card to-primary-subtle/30 motion-safe:transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Cake size={22} className="text-primary animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-primary text-base flex items-center gap-2">
              Today&apos;s Birthday Celebrations
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <Sparkles size={12} /> {TODAY_BIRTHDAYS.length} Celebrating Today
              </span>
            </h3>
            <p className="text-xs text-secondary mt-0.5">
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
              className="p-4 rounded-xl bg-card border border-border hover:border-primary/40 shadow-xs flex flex-col justify-between gap-3 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {student.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary text-sm truncate">{student.name}</p>
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
                      🎂 Today
                    </span>
                  </div>
                  <p className="text-xs text-secondary font-mono">
                    {student.smartId} • {student.seat}
                  </p>
                  <p className="text-xs text-secondary truncate mt-0.5">
                    {student.shift} • {student.branch}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                <span className="text-xs text-secondary flex items-center gap-1 font-mono">
                  <Phone size={11} /> +91 {student.phone.slice(0, 5)}...
                </span>
                <button
                  type="button"
                  onClick={() => handleSendWish(student)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isWished
                      ? 'bg-surface text-secondary border border-border'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
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

