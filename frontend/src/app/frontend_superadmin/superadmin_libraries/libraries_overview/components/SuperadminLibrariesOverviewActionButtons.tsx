'use client';
/** Responsibility: Renders horizontal non-wrapping action controls for a library row with tooltips and test-ids. */
import type { SuperadminLibrariesLibrary } from '@/app/frontend_superadmin/superadmin_libraries/libraries_overview/types/SuperadminLibrariesOverviewTypes';
import {
  Edit2, Eye, ShieldAlert, CheckCircle, MessageSquare,
  Mail, PhoneCall, Building2, Sliders, KeyRound, UserCheck, Copy,
} from 'lucide-react';

interface SuperadminLibrariesOverviewActionButtonsProps {
  library: SuperadminLibrariesLibrary;
  testIdSuffix: string;
  onView: (lib: SuperadminLibrariesLibrary) => void;
  onEdit: (lib: SuperadminLibrariesLibrary) => void;
  onToggleStatus: (id: string) => void;
  onManageBranches: (lib: SuperadminLibrariesLibrary) => void;
  onConfigureModules: (lib: SuperadminLibrariesLibrary) => void;
  onToggleAdminPanel: (id: string) => void;
  onImpersonate?: (lib: SuperadminLibrariesLibrary) => void;
  onDuplicate?: (lib: SuperadminLibrariesLibrary) => void;
  showToast: (msg: string) => void;
}

export default function SuperadminLibrariesOverviewActionButtons({
  library,
  testIdSuffix,
  onView,
  onEdit,
  onToggleStatus,
  onManageBranches,
  onConfigureModules,
  onToggleAdminPanel,
  onImpersonate,
  onDuplicate,
  showToast,
}: SuperadminLibrariesOverviewActionButtonsProps) {
  const isActive = library.status === 'Active';
  const isAdminOn = library.adminPanelEnabled ?? true;

  return (
    <div className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap shrink-0">
      {/* 1. View Details */}
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        aria-label={`View ${library.name}`}
        onClick={(e) => { e.stopPropagation(); onView(library); }}
        title="View Library Details"
        data-testid={`superadmin-libraries-libraries-overview-view-library-aria-label-1-${testIdSuffix}`}
      >
        <Eye size={14} strokeWidth={2} />
      </button>

      {/* 2. Edit Settings */}
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        aria-label={`Edit ${library.name}`}
        onClick={(e) => { e.stopPropagation(); onEdit(library); }}
        title="Edit Library Settings"
        data-testid={`superadmin-libraries-libraries-overview-edit-library-preview-aria-label-2-${testIdSuffix}`}
      >
        <Edit2 size={14} strokeWidth={2} />
      </button>

      {/* 3. Status Toggle (Active / Maintenance) */}
      <button
        type="button"
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border shadow-xs active:scale-95 cursor-pointer transition-all shrink-0 ${
          isActive
            ? 'border-rose-500/30 bg-rose-500/15 text-rose-300 hover:text-white hover:bg-rose-600/30'
            : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30'
        }`}
        aria-label={`Toggle status for ${library.name}`}
        onClick={(e) => { e.stopPropagation(); onToggleStatus(library.id); }}
        title={isActive ? 'Put into Maintenance' : 'Activate Library'}
        data-testid={`superadmin-libraries-libraries-overview-toggle-library-status-preview-aria-label-3-${testIdSuffix}`}
      >
        {isActive ? <ShieldAlert size={14} strokeWidth={2} /> : <CheckCircle size={14} strokeWidth={2} />}
      </button>

      {/* 4. WhatsApp Quick Connect */}
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        aria-label={`Send WhatsApp to ${library.owner}`}
        onClick={(e) => {
          e.stopPropagation();
          const raw = library.phone || '9876543210';
          let digits = raw.replace(/\D/g, '');
          if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
          const phone = digits.length === 10 ? `91${digits}` : digits;
          const msg = `Hello ${library.owner}, greetings from Smart Library SaaS SuperAdmin regarding your facility "${library.name}".`;
          const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
          if (popup) popup.opener = null;
          showToast(`Opened WhatsApp chat for ${library.owner}`);
        }}
        title="Chat on WhatsApp"
      >
        <MessageSquare size={14} strokeWidth={2} />
      </button>

      {/* 5. Email */}
      {library.email && (
        <a
          href={`mailto:${library.email}?subject=${encodeURIComponent(`Smart Library SaaS - Notice for ${library.name}`)}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:text-white hover:bg-purple-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          aria-label={`Send email to ${library.owner}`}
          title="Send Email"
        >
          <Mail size={14} strokeWidth={2} />
        </a>
      )}

      {/* 6. Call */}
      {library.phone && library.phone !== 'Not supplied' && (
        <a
          href={`tel:${library.phone.replace(/\D/g, '')}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-500/15 text-teal-300 hover:text-white hover:bg-teal-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          aria-label={`Call ${library.owner}`}
          title="Call Facility Owner"
        >
          <PhoneCall size={14} strokeWidth={2} />
        </a>
      )}

      {/* 7. Manage Branches */}
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-500/30 bg-sky-500/15 text-sky-300 hover:text-white hover:bg-sky-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        onClick={(e) => { e.stopPropagation(); onManageBranches(library); }}
        title="Manage Branches"
      >
        <Building2 size={14} strokeWidth={2} />
      </button>

      {/* 8. Configure Manager Modules */}
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:text-white hover:bg-purple-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        onClick={(e) => { e.stopPropagation(); onConfigureModules(library); }}
        title="Configure Manager Modules"
      >
        <Sliders size={14} strokeWidth={2} />
      </button>

      {/* 9. Admin Panel Master Switch */}
      <button
        type="button"
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 ${
          isAdminOn
            ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:text-white hover:bg-emerald-600/30'
            : 'border-amber-500/30 bg-amber-500/15 text-amber-300 hover:text-white hover:bg-amber-600/30'
        }`}
        onClick={(e) => { e.stopPropagation(); onToggleAdminPanel(library.id); }}
        title={isAdminOn ? 'Turn Admin Panel OFF (Manager Only)' : 'Turn Admin Panel ON'}
      >
        <KeyRound size={14} strokeWidth={2} />
      </button>

      {/* 10. Login as Library Admin (Impersonate) */}
      {onImpersonate && (
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-400/30 bg-indigo-500/20 text-indigo-300 hover:text-white hover:bg-indigo-600/40 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          onClick={(e) => { e.stopPropagation(); onImpersonate(library); }}
          title="Login as Library Admin (Impersonate)"
        >
          <UserCheck size={14} strokeWidth={2} />
        </button>
      )}

      {/* 11. Duplicate Library Configuration */}
      {onDuplicate && (
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
          onClick={(e) => { e.stopPropagation(); onDuplicate(library); }}
          title="Duplicate Library Configuration"
        >
          <Copy size={14} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
