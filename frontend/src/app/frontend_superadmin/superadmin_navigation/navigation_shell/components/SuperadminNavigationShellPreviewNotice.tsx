/** Responsibility: Superadmin Shell Preview Notice; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: role shell integration state/configuration -> localized preview notice -> visible host-integration boundary; the notice does not infer backend success or persist data. */

import { useTranslations } from 'next-intl';/**
 * Performs the superadmin navigation shell preview notice operation within the Superadmin navigation shell; inputs and outputs follow the declared TypeScript contract.
 */
/**
 * Performs the superadmin navigation shell preview notice operation within the Superadmin navigation shell; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminNavigationShellPreviewNotice() {
  const t = useTranslations('SUPERADMIN_SHELL');
  return (
    <aside className="sa-preview-notice" role="status" aria-live="polite">
      <strong>{t("COPY.SOURCE_ONLY_PREVIEW")}</strong> {t("COPY.THIS_ARCHIVE_DOES_NOT_INCLUDE_THE_HOST_APP_MANIFEST_OR_COMPLETE_API_CONTRACTS_SAMPLE_RECORDS_ARE_ILLUSTRATIVE_ACTIONS_WITHOUT_A_VERIFIED_BACKEND_WRITE_CONTRACT_MUST_BE_TREATED_AS_LOCAL_PREVIEW_CHANGES")}
    </aside>
  );
}
