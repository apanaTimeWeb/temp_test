import { MANAGER_BRANCH_INFO_DEMO_DRAFT } from '@/app/frontend_manager/manager_settings/settings_branch_info/config/manager_settings_branch_info.demo_data';
import { managerBranchInfoDraftSchema,type ManagerSettingsBranchInfoDraft } from '@/app/frontend_manager/manager_settings/settings_branch_info/schemas/ManagerSettingsBranchInfoSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Encapsulates the module-owned draft form, validation state, and local-only submit contract. */
export function useManagerBranchInfoForm() {
  const [isDraftValidated, setIsDraftValidated] = useState(false);
  const { register, watch, handleSubmit, formState: { errors, isDirty } } = useForm<ManagerSettingsBranchInfoDraft>({
    resolver: zodResolver(managerBranchInfoDraftSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: MANAGER_BRANCH_INFO_DEMO_DRAFT,
  });

  const branchData = watch();
  const onValidateLocalDraft = handleSubmit(() => {
    setIsDraftValidated(true);
  });

  return { register, errors, isDirty, isDraftValidated, branchData, onValidateLocalDraft };
}
