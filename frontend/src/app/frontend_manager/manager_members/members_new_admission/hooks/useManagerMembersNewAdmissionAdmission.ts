'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { ManagerMembersNewAdmissionAdmissionSchema, type ManagerMembersNewAdmissionAdmissionFormValues } from '@/app/frontend_manager/manager_members/members_new_admission/schemas/ManagerMembersNewAdmissionAdmissionSchema';

/** Admission form state and validation only. No create mutation is available without an authoritative host contract. */
export function useManagerNewAdmissionAdmission() {
  const searchParams = useSearchParams();
  const defaultName = searchParams.get('name') ?? '';
  const defaultPhone = searchParams.get('phone') ?? '';
  const form = useForm<ManagerMembersNewAdmissionAdmissionFormValues>({
    resolver: zodResolver(ManagerMembersNewAdmissionAdmissionSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: defaultName,
      phone: defaultPhone,
      shift: '',
      seat: '',
      locker: '',
      plan: '',
      manualDiscount: '',
      amountPaid: '',
      paymentMode: '',
    },
  });

  return { form };
}
