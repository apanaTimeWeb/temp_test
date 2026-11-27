'use client';

import type { MembersAlumniRow } from '@/app/frontend_manager/manager_members/members_alumni/types/ManagerMembersAlumniComponentTypes';
import { formatAlumniInr, getDepositSettlementFinanceUrl } from '@/app/frontend_manager/manager_members/members_alumni/utils/ManagerMembersAlumniDepositSettlement';
import { AlertTriangle, Award, Briefcase, Calendar, CheckCircle2, Clock, ExternalLink, GraduationCap, Phone, Quote, ShieldCheck, Trash2 } from 'lucide-react';

export function ManagerMembersAlumniTableRow({
  alumnus,
  onDeleteAlumni,
}: {
  alumnus: MembersAlumniRow;
  onDeleteAlumni?: (id: string) => void;
}) {
  const cleanPhone = alumnus.phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}` : alumnus.phone;

  return (
    <tr className="border-b border-border last:border-0 hover:bg-surface-hover motion-safe:transition-colors">
      <td className="py-3 px-4 font-mono font-bold text-primary text-xs align-middle whitespace-nowrap">{alumnus.id}</td>
      <td className="py-3 px-4 font-semibold text-primary text-xs align-middle whitespace-nowrap">{alumnus.name}</td>
      <td className="py-3 px-4 font-mono text-secondary text-xs align-middle whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5">
          <Phone size={13} className="text-info shrink-0" />
          <span>{formattedPhone}</span>
        </span>
      </td>
      <td className="py-3 px-4 align-middle whitespace-nowrap">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-success text-xs inline-flex items-center gap-1.5">
            <Award size={13} className="text-success shrink-0" />
            <span>{alumnus.exam}</span>
          </span>
          {alumnus.designation ? (
            <span className="text-[11px] text-secondary inline-flex items-center gap-1">
              <Briefcase size={12} className="text-info shrink-0" />
              <span>{alumnus.designation}</span>
            </span>
          ) : null}
        </div>
      </td>
      <td className="py-3 px-4 text-secondary text-xs align-middle whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={13} className="text-primary shrink-0" />
          <span>{alumnus.leftDate}</span>
        </span>
      </td>
      <td className="py-3 px-4 text-secondary text-xs align-middle whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={13} className="text-warning shrink-0" />
          <span>{alumnus.duration}</span>
        </span>
      </td>
      <td className="py-3 px-4 align-middle max-w-[200px] lg:max-w-[260px]">
        {alumnus.testimonial ? (
          <div className="flex items-start gap-1.5 text-xs text-secondary italic" title={alumnus.testimonial}>
            <Quote size={13} className="text-primary shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">{alumnus.testimonial}</span>
          </div>
        ) : (
          <span className="text-xs text-secondary opacity-40">—</span>
        )}
      </td>
      <td className="py-3 px-4 align-middle whitespace-nowrap" data-testid={`alumni-deposit-clearance-${alumnus.id}`}>
        {alumnus.depositSettlementStatus === 'Held' ? (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/30">
              <AlertTriangle size={12} className="shrink-0 text-amber-500" />
              <span>{`Held ${formatAlumniInr(alumnus.depositAmount || 500)}`}</span>
            </span>
            <a
              href={getDepositSettlementFinanceUrl(alumnus.name, alumnus.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 hover:underline px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/25 motion-safe:transition-colors"
              title={`Settle security deposit for ${alumnus.name} in Finance Security Deposits desk`}
            >
              <span>Settle</span>
              <ExternalLink size={10} />
            </a>
          </div>
        ) : alumnus.depositSettlementStatus === 'Refunded' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={12} className="shrink-0 text-emerald-400" />
            <span>{`Refunded ${alumnus.depositAmount ? formatAlumniInr(alumnus.depositAmount) : ''}`}</span>
          </span>
        ) : alumnus.depositSettlementStatus === 'Settled' ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={12} className="shrink-0 text-emerald-400" />
            <span>Settled</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-secondary opacity-70">
            <ShieldCheck size={13} className="shrink-0 text-emerald-500" />
            <span>Cleared</span>
          </span>
        )}
      </td>
      <td className="py-3 px-4 align-middle whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${alumnus.currentStatus === 'Cleared Exam' ? 'bg-success-bg text-success' : alumnus.currentStatus === 'Employed' ? 'bg-info-bg text-info' : 'bg-warning-bg text-warning'}`}>
          {alumnus.currentStatus === 'Cleared Exam' && <CheckCircle2 size={13} className="shrink-0 text-success" />}
          {alumnus.currentStatus === 'Employed' && <Briefcase size={13} className="shrink-0 text-info" />}
          {alumnus.currentStatus === 'Higher Studies' && <GraduationCap size={13} className="shrink-0 text-warning" />}
          <span>{alumnus.currentStatus}</span>
        </span>
      </td>
      <td className="py-3 px-4 text-right align-middle whitespace-nowrap">
        {onDeleteAlumni && (
          <button
            type="button"
            onClick={() => onDeleteAlumni(alumnus.id)}
            className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border text-danger hover:border-danger hover:bg-danger-bg motion-safe:transition-colors"
            title={`Remove ${alumnus.name} from directory`}
            aria-label={`Remove ${alumnus.name}`}
          >
            <Trash2 size={15} className="shrink-0 text-danger" />
          </button>
        )}
      </td>
    </tr>
  );
}
