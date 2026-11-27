'use client';

interface ManagerFinanceCollectFeeHeaderProps {
  title: string;
}

export default function ManagerFinanceCollectFeeHeader({ title }: ManagerFinanceCollectFeeHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="fin-page-title text-2xl font-bold tracking-tight">{title}</h1>
        <p className="fin-page-subtitle text-sm text-secondary mt-1">
          Record student dues, monthly plan renewal, and generate verified receipts.
        </p>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 self-start sm:self-auto shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
        <span>Active Collection Desk</span>
      </div>
    </div>
  );
}
