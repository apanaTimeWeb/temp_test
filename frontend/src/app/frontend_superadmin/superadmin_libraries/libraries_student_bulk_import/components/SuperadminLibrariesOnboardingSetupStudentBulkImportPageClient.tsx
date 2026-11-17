"use client";
import SuperadminLibrariesOnboardingSetupStudentBulkImportEmptyState from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_bulk_import/components/SuperadminLibrariesOnboardingSetupStudentBulkImportEmptyState';
import { useSuperadminLibrariesStudentBulkImportState } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_bulk_import/hooks/useSuperadminLibrariesStudentBulkImportState';
/** Responsibility: Superadmin System Bulk Import Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */


import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle, Download, FileSpreadsheet, Upload, XCircle } from 'lucide-react';

import type { SuperadminSystemBulkImportRow, SuperadminSystemBulkImportRowStatus } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_bulk_import/types/SuperadminLibrariesOnboardingSetupStudentBulkImportTypes';
import { SuperadminSystemParseCsv, SuperadminSystemValidateCsv, maskSensitiveData } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_bulk_import/utils/SuperadminLibrariesOnboardingSetupStudentBulkImportCsvImportUtilities';
import { SUPERADMIN_SYSTEM_BULK_IMPORT_TEMPLATE_HEADERS } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_bulk_import/constants/SuperadminLibrariesOnboardingSetupStudentBulkImportConstants';
import { SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_CLIENT_ALLOWED, SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE } from '@/app/frontend_superadmin/superadmin_libraries/libraries_student_bulk_import/constants/SuperadminLibrariesOnboardingSetupStudentBulkImportStaticConstants';



function downloadTemplate() {
  const blob = new Blob([`${SUPERADMIN_SYSTEM_BULK_IMPORT_TEMPLATE_HEADERS.join(',')}\n`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'superadmin_bulk_import_template.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Renders the `superadmin_system` view owned by `SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient`.
 * Owns local UI state for `fileName`, `rows`, `statusMessage`, `errorMessage`, `filter`, `urlStateReady` and related form/selection state.
 * Effect lifecycle boundaries are `[]`, `[filter, urlStateReady]`; listeners/timers/focus are cleaned up by their owning effects.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminLibrariesOnboardingSetupStudentBulkImportPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SYSTEM');
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { fileName, setFileName, rows, setRows, statusMessage, setStatusMessage, errorMessage, setErrorMessage, filter, setFilter, urlStateReady, setUrlStateReady } = useSuperadminLibrariesStudentBulkImportState(tCopy('COPY.BULK_IMPORT_INITIAL_STATUS'));
  // Effect contract: keep local filter state synchronized with browser back/forward navigation and remove the listener on cleanup; dependency set [] (intentional mount-only effect) is the deliberate re-run boundary.
  useEffect(() => {
    
    const requested = new URLSearchParams(window.location.search).get('status');
    setFilter(SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_CLIENT_ALLOWED.includes(requested ?? '') ? requested as 'all' | SuperadminSystemBulkImportRowStatus : 'all');
    setUrlStateReady(true);
    const handlePopState = () => {
      const value = new URLSearchParams(window.location.search).get('status');
      setFilter(SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_CLIENT_ALLOWED.includes(value ?? '') ? value as 'all' | SuperadminSystemBulkImportRowStatus : 'all');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  // Effect contract: serialize the current filter or view state into the URL only after initial URL hydration; dependency set [filter, urlStateReady] is the deliberate re-run boundary.
  useEffect(() => {
    if (!urlStateReady) return;
    const url = new URL(window.location.href);
    if (filter === 'all') url.searchParams.delete('status'); else url.searchParams.set('status', filter);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [filter, urlStateReady]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, rows]);
  const errors = rows.filter(row => row.status === 'error').length;
  const warnings = rows.filter(row => row.status === 'warning').length;
  const valid = rows.filter(row => row.status === 'ok').length;
  const visible = useMemo(() => filter === 'all' ? rows : rows.filter(row => row.status === filter), [filter, rows]);
  const pageCount = Math.max(1, Math.ceil(visible.length / SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const pageRows = visible.slice((safePage - 1) * SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE, safePage * SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE);
  const firstVisibleRow = visible.length === 0 ? 0 : (safePage - 1) * SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE + 1;
  const lastVisibleRow = Math.min(safePage * SUPERADMIN_SYSTEM_BULK_IMPORT_PAGE_SIZE, visible.length);
  const issueText = (row: SuperadminSystemBulkImportRow): string => {
    if (row.issue === 'REQUIRED_FIELDS_MISSING') {
      const labels = { name: tCopy('COPY.NAME'), phone: tCopy('COPY.PHONE'), shift: tCopy('COPY.SHIFT') };
      const fields = (row.issueFields ?? []).map(field => labels[field]).join(', ');
      return tCopy('COPY.REQUIRED_FIELDS_MISSING', { fields });
    }
    if (row.issue === 'EMAIL_BLANK_OPTIONAL') return tCopy('COPY.EMAIL_BLANK_OPTIONAL');
    return '';
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setErrorMessage('');
    setRows([]);
    setCurrentPage(1);
    setFileName(file.name);
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.csv')) {
      setErrorMessage(tCopy('COPY.BULK_IMPORT_EXCEL_UNSUPPORTED'));
      setStatusMessage(tCopy('COPY.BULK_IMPORT_FILE_REJECTED'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(tCopy('COPY.BULK_IMPORT_FILE_TOO_LARGE'));
      setStatusMessage(tCopy('COPY.BULK_IMPORT_FILE_REJECTED'));
      return;
    }
    try {
      const csvText = await file.text();
      const sourceRows = SuperadminSystemParseCsv(csvText);
      if (sourceRows.length - 1 > 500) {
        setErrorMessage(tCopy('COPY.BULK_IMPORT_TOO_MANY_ROWS'));
        setStatusMessage(tCopy('COPY.BULK_IMPORT_FILE_REJECTED'));
        return;
      }
      const parsed = SuperadminSystemValidateCsv(csvText);
      setRows(parsed);
      setStatusMessage(tCopy('COPY.BULK_IMPORT_PARSED_ROWS', { count: parsed.length, fileName: file.name }));
    } catch {
      setErrorMessage(tCopy('COPY.BULK_IMPORT_PARSE_FAILED'));
      setStatusMessage(tCopy('COPY.BULK_IMPORT_FILE_REJECTED'));
    }
  };

  return (
    <section className="space-y-6">
      {rows.length === 0 && <SuperadminLibrariesOnboardingSetupStudentBulkImportEmptyState />}
      {rows.length > 0 && visible.length === 0 && <SuperadminLibrariesOnboardingSetupStudentBulkImportEmptyState filtered />}

      <header className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-card via-card/95 to-indigo-950/20 shadow-xl shadow-black/20">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/10">
            <FileSpreadsheet size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
              {tCopy("COPY.BULK_STUDENT_IMPORT")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{tCopy("COPY.CSV_VALIDATION_PREVIEW_NO_STUDENT_IMPORT_ENDPOINT_OR_BACKEND_WRITE_FBD700B7")}</p>
          </div>
        </div>
        <button
          type="button"
          className="sa-btn-ghost inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
          onClick={downloadTemplate}
          data-testid="superadmin-system-system-bulk-import-download-csv-template-1">
          <Download size={15} className="text-indigo-400" /> {tCopy("COPY.DOWNLOAD_CSV_TEMPLATE")}
        </button>
      </header>

      <p className="sa-preview-notice rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3.5 text-xs text-indigo-300" role="status">{tCopy("COPY.THE_SELECTED_CSV_IS_PARSED_LOCALLY_THE_IMPORT_ACTION_IS_INTENTIONA_93083701")}</p>
      {statusMessage && <p className="text-xs text-slate-400" role="status">{statusMessage}</p>}
      {errorMessage && <p className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-300 text-xs sm:text-sm font-medium" role="alert">{errorMessage}</p>}

      <div className="sa-card rounded-2xl border border-indigo-500/20 bg-card/85 p-6 shadow-xl space-y-3">
        <label htmlFor="superadmin-bulk-import-file" className="sa-label text-xs font-semibold uppercase tracking-wider text-slate-300 block">{tCopy("COPY.CSV_FILE_UP_TO_5_MB_500_ROWS")}</label>
        <input ref={inputRef} id="superadmin-bulk-import-file" type="file" accept=".csv,text/csv" className="sa-input block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30 cursor-pointer" onChange={event => void handleFile(event.target.files?.[0])}  data-testid="superadmin-system-system-bulk-import-superadmin-bulk-import-file-2"/>
        {fileName && <p className="text-xs text-indigo-300 font-medium">{tCopy("COPY.SELECTED")} <span className="font-mono text-slate-200">{fileName}</span></p>}
      </div>

      {rows.length > 0 && <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sa-card rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-card to-card p-5 shadow-lg relative overflow-hidden">
            <p className="text-emerald-400 text-xs uppercase font-bold tracking-wider">{tCopy("COPY.VALID_ROWS")}</p>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">{valid}</p>
          </div>
          <div className="sa-card rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-card to-card p-5 shadow-lg relative overflow-hidden">
            <p className="text-amber-400 text-xs uppercase font-bold tracking-wider">{tCopy("COPY.WARNINGS")}</p>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">{warnings}</p>
          </div>
          <div className="sa-card rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-card to-card p-5 shadow-lg relative overflow-hidden">
            <p className="text-rose-400 text-xs uppercase font-bold tracking-wider">{tCopy("COPY.ERRORS")}</p>
            <p className="text-3xl font-extrabold text-slate-100 mt-1">{errors}</p>
          </div>
        </div>
        <div className="sa-card rounded-2xl border border-border/80 bg-card/90 shadow-xl p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/70">
            <h2 className="text-base font-bold text-slate-100">{tCopy("COPY.PARSED_CSV_ROWS")}</h2>
            <label className="text-xs text-slate-400 font-medium inline-flex items-center">{tCopy("COPY.FILTER_STATUS")}
              <select aria-label={tCopy("COPY.FILTER")} className="sa-select ml-2 rounded-xl border border-indigo-500/25 bg-background/90 px-3 py-1.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none" value={filter} onChange={event => setFilter(event.target.value as typeof filter)} data-testid="superadmin-system-system-bulk-import-filter-3">
                <option value="all">{tCopy("COPY.ALL")}</option>
                <option value="ok">{tCopy("COPY.VALID")}</option>
                <option value="warning">{tCopy("COPY.WARNINGS")}</option>
                <option value="error">{tCopy("COPY.ERRORS")}</option>
              </select>
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead><tr className="sa-table-header border-b border-border text-slate-400 text-xs uppercase tracking-wider"><th className="text-left p-2.5">{tCopy("COPY.ROW")}</th><th className="text-left p-2.5">{tCopy("COPY.NAME")}</th><th className="text-left p-2.5">{tCopy("COPY.PHONE")}</th><th className="text-left p-2.5">{tCopy("COPY.EMAIL")}</th><th className="text-left p-2.5">{tCopy("COPY.SHIFT")}</th><th className="text-left p-2.5">{tCopy("COPY.SEAT")}</th><th className="text-left p-2.5">{tCopy("COPY.VALIDATION")}</th></tr></thead>
              <tbody>{pageRows.map(row => <tr key={row.row} className="sa-table-row border-b border-border/50 hover:bg-surface-hover/50 transition-colors">
                <td className="p-2.5 font-mono text-slate-400">{row.row}</td><td className="p-2.5 font-medium text-slate-200">{row.name || '—'}</td><td className="p-2.5 font-mono text-slate-300">{row.phone ? maskSensitiveData(row.phone) : '—'}</td><td className="p-2.5 text-slate-300">{row.email ? maskSensitiveData(row.email) : '—'}</td><td className="p-2.5 text-slate-300">{row.shift || '—'}</td><td className="p-2.5 text-slate-300">{row.seat || '—'}</td>
                <td className="p-2.5"><span className={`sa-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${row.status === 'ok' ? 'sa-badge--success bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : row.status === 'warning' ? 'sa-badge--warning bg-amber-500/15 border border-amber-500/30 text-amber-300' : 'sa-badge--danger bg-rose-500/15 border border-rose-500/30 text-rose-300'}`}>{row.status === 'ok' ? <CheckCircle size={12} className="text-emerald-400" /> : row.status === 'warning' ? <AlertTriangle size={12} className="text-amber-400" /> : <XCircle size={12} className="text-rose-400" />} {row.status === 'ok' ? tCopy('COPY.VALID') : row.status === 'warning' ? tCopy('COPY.WARNINGS') : tCopy('COPY.ERRORS')}{issueText(row) ? ` — ${issueText(row)}` : ''}</span></td>
              </tr>)}</tbody>
            </table>
          </div>
          <nav className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60" aria-label={tCopy('COPY.PAGINATION')}>
            <p className="text-xs text-slate-400" aria-live="polite">
              {tCopy('COPY.PAGE_RANGE', { start: firstVisibleRow, end: lastVisibleRow, total: visible.length })}
            </p>
            <div className="flex items-center gap-2">
              <button type="button" className="sa-btn-ghost inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold disabled:opacity-30 cursor-pointer" onClick={() => setCurrentPage(page => Math.max(1, page - 1))} disabled={safePage <= 1}>
                {tCopy('COPY.PREVIOUS_PAGE')}
              </button>
              <span className="text-xs font-semibold text-slate-300 px-2" aria-live="polite">
                {tCopy('COPY.PAGE_NUMBER', { current: safePage, total: pageCount })}
              </span>
              <button type="button" className="sa-btn-ghost inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold disabled:opacity-30 cursor-pointer" onClick={() => setCurrentPage(page => Math.min(pageCount, page + 1))} disabled={safePage >= pageCount}>
                {tCopy('COPY.NEXT_PAGE')}
              </button>
            </div>
          </nav>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" className="sa-btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" disabled title={tCopy("COPY.BLOCKED_THE_SUPPLIED_SCOPE_CONTAINS_NO_STUDENT_IMPORT_API_CONTRACT")} data-testid="superadmin-system-system-bulk-import-blocked-the-supplied-scope-contains-no-student-import-api-contract-4"><Upload size={16} /> {tCopy("COPY.IMPORT")}{valid} {tCopy("COPY.VALID_ROWS_2")}</button>
            <button type="button" className="sa-btn-ghost inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs sm:text-sm font-semibold transition-all cursor-pointer" onClick={() => { setRows([]); setCurrentPage(1); setFileName(''); setErrorMessage(''); setFilter('all'); setStatusMessage(tCopy('COPY.BULK_IMPORT_INITIAL_STATUS')); if (inputRef.current) inputRef.current.value = ''; }} data-testid="superadmin-system-system-bulk-import-clear-preview-5">{tCopy("COPY.CLEAR_PREVIEW")}</button>
          </div>
        </div>
      </>}
    </section>
  );
}
