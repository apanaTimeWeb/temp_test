import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { managerBranchInfoDraftSchema, type ManagerSettingsBranchInfoDraft } from '@/app/frontend_manager/manager_settings/settings_branch_info/schemas/ManagerSettingsBranchInfoSchema';
import { MANAGER_BRANCH_INFO_SAMPLE_DRAFT } from '@/app/frontend_manager/manager_settings/settings_branch_info/mocks/manager_settings_branch_info_fixtures/ManagerSettingsBranchInfoSampleFixture';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Encapsulates the module-owned draft form, validation state, and local-only submit contract. */
export function useManagerBranchInfoForm() {
  const [isDraftValidated, setIsDraftValidated] = useState(false);
  const { register, watch, handleSubmit, formState: { errors, isDirty } } = useForm<ManagerSettingsBranchInfoDraft>({
    resolver: zodResolver(managerBranchInfoDraftSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: MANAGER_BRANCH_INFO_SAMPLE_DRAFT,
  });

  const branchData = watch();
  const onValidateLocalDraft = handleSubmit(() => {
    setIsDraftValidated(true);
  });

  return { register, errors, isDirty, isDraftValidated, branchData, onValidateLocalDraft };
}
