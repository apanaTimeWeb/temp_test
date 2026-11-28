'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BookOpen, Lock } from 'lucide-react';
import PublicAuthSignInForm from '@/app/public_auth/auth_sign_in/components/PublicAuthSignInForm';
import PublicAuthSignInHero from '@/app/public_auth/auth_sign_in/components/PublicAuthSignInHero';
import PublicAuthSignInRoleSelector, {
  type RoleOptionConfig,
} from '@/app/public_auth/auth_sign_in/components/PublicAuthSignInRoleSelector';
import { PublicAuthBlockerOverlay } from '@/app/public_auth/auth_sign_in/components/PublicAuthSignInLoader';
import '@/app/public_auth/auth_sign_in/components/PublicAuthSignInStyles.css';
import { usePublicAuthLoginMutation } from '@/app/public_auth/auth_sign_in/hooks/usePublicAuthSignInMutation';
import { usePublicAuthIdempotencyKey } from '@/app/public_auth/auth_sign_in/hooks/usePublicAuthSignInIdempotencyKey';
import {
  PublicAuthApiError,
  getPublicAuthApiErrorMessage,
} from '@/app/public_auth/auth_sign_in/api/PublicAuthSignInApi';
import {
  PUBLIC_AUTH_INTERNAL_URLS,
  PUBLIC_AUTH_ROLE_REDIRECTS,
} from '@/app/public_auth/auth_sign_in/config/public_auth_sign_in_url_config';
import { PUBLIC_AUTH_SIGN_IN_DEMO } from '@/app/public_auth/auth_sign_in/mocks/fixtures/PublicAuthSignInFixtures';
import {
  createPublicAuthLoginSchema,
  type PublicAuthLoginFormData,
} from '@/app/public_auth/auth_sign_in/schemas/PublicAuthSignInValidationSchemas';

const ROLES: RoleOptionConfig[] = [
  {
    id: 'superadmin',
    label: 'Super Admin',
    email: 'superadmin@library.com',
    password: 'Password@123',
    icon: '👑',
    redirectTo: PUBLIC_AUTH_ROLE_REDIRECTS.superadmin,
    setupComplete: true,
  },
  {
    id: 'admin',
    label: 'Admin',
    email: 'admin@library.com',
    password: 'Password@123',
    icon: '⚡',
    redirectTo: PUBLIC_AUTH_ROLE_REDIRECTS.admin,
    setupComplete: true,
  },
  {
    id: 'manager',
    label: 'Manager',
    email: 'manager@library.com',
    password: 'Password@123',
    icon: '👥',
    redirectTo: PUBLIC_AUTH_ROLE_REDIRECTS.manager,
    setupComplete: true,
  },
];

/** LibraryOS multi-branch sign-in screen with role prefill, validation, and session bootstrap. */
export default function PublicAuthSignInPage() {
  const t = useTranslations('AUTH');
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleOptionConfig>(ROLES[0]);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const isProduction = process.env.NODE_ENV === 'production';
  const demoFillEnabled = !isProduction && process.env.NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED === 'true';

  const { getKey, clearKey } = usePublicAuthIdempotencyKey();
  const loginMutation = usePublicAuthLoginMutation();

  const validationSchema = useMemo(
    () =>
      createPublicAuthLoginSchema({
        emailRequired: t('VALIDATION.emailRequired'),
        passwordRequired: t('VALIDATION.passwordRequired'),
      }),
    [t]
  );

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PublicAuthLoginFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: ROLES[0].email,
      password: ROLES[0].password,
      role: 'superadmin',
    },
  });

  useEffect(() => {
    const subscription = watch(() => clearKey());
    return () => subscription.unsubscribe();
  }, [watch, clearKey]);

  const handleRoleSelect = (role: RoleOptionConfig) => {
    setSelectedRole(role);
    setValue('email', role.email, { shouldValidate: false, shouldDirty: true });
    setValue('password', role.password, { shouldValidate: false, shouldDirty: true });
    setValue('role', role.id, { shouldValidate: true, shouldDirty: true });
  };

  const handleDemoFill = () => {
    setValue('email', PUBLIC_AUTH_SIGN_IN_DEMO.email, { shouldValidate: true, shouldDirty: true });
    setValue('password', PUBLIC_AUTH_SIGN_IN_DEMO.password, { shouldValidate: true, shouldDirty: true });
    setValue('role', PUBLIC_AUTH_SIGN_IN_DEMO.role, { shouldValidate: true, shouldDirty: true });
    const matched = ROLES.find((r) => r.id === PUBLIC_AUTH_SIGN_IN_DEMO.role);
    if (matched) setSelectedRole(matched);
  };

  const isBusy = loginMutation.isPending || isSubmitting;

  const onSubmit = async (data: PublicAuthLoginFormData) => {
    try {
      const idempotencyKey = await getKey();
      await loginMutation.mutateAsync({
        payload: { email: data.email, password: data.password, role: data.role },
        idempotencyKey,
      });
      clearKey();

      const matchedRole = ROLES.find((r) => r.id === data.role);
      const mockToken = btoa(JSON.stringify({ role: data.role, email: data.email, exp: Date.now() + 900000 }));
      const mockUser = {
        id: `${data.role}-001`,
        name: data.role === 'admin' ? 'John' : data.role === 'manager' ? 'Ram' : matchedRole?.label ?? data.role,
        email: data.email,
        role: data.role,
        phone: '',
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        document.cookie = `access_token=${mockToken}; path=/; SameSite=Strict; max-age=900`;
      }

      setLoginSuccess(true);
      const target = PUBLIC_AUTH_ROLE_REDIRECTS[data.role] ?? '/admin';
      router.replace(target);

      setTimeout(() => {
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/public_auth')) {
          window.location.href = target;
        }
      }, 1000);
    } catch (error) {
      const fieldMap: Record<string, keyof PublicAuthLoginFormData> = {
        email: 'email',
        password: 'password',
        role: 'role',
      };
      const validationErrors = error instanceof PublicAuthApiError ? error.validationErrors : [];
      let hasUnknownField = false;
      for (const validationError of validationErrors) {
        const field = fieldMap[validationError.field];
        if (field) {
          setError(field, { type: 'server', message: t('errors.requestFailed') });
        } else {
          hasUnknownField = true;
        }
      }
      if (validationErrors.length === 0 || hasUnknownField) {
        setError('root.server', {
          type: 'server',
          message: getPublicAuthApiErrorMessage(error, {
            configuration: t('errors.configuration'),
            connection: t('errors.connection'),
            requestFailed: t('errors.requestFailed'),
            unexpected: t('errors.unexpected'),
          }),
        });
      }
    }
  };

  return (
    <main className="login-bg min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden flex text-white relative">
      <div className="absolute inset-0 dot-grid opacity-35 pointer-events-none" />
      <div className="aurora-orb-1" />
      <div className="aurora-orb-2" />

      {loginSuccess && <PublicAuthBlockerOverlay />}

      <PublicAuthSignInHero />

      <section className="w-full lg:w-5/12 xl:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 h-full relative z-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex justify-center items-center gap-2.5 mb-5">
            <span className="brand-logo-mark" aria-hidden="true">
              <BookOpen size={18} strokeWidth={2.2} className="text-white drop-shadow-xs" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
              <span>Library</span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent font-black ml-0.5">
                OS
              </span>
            </span>
          </div>

          <div className="glass-login rounded-2xl p-6 sm:p-7">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-950/70 via-purple-950/50 to-cyan-950/40 border border-indigo-500/30 mb-2.5 shadow-md">
                <Lock size={18} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-white">Sign In</h2>
              <p className="text-slate-400 text-xs mt-0.5">Select your role to access your workspace</p>
            </div>

            {demoFillEnabled && (
              <div className="mb-3 flex justify-end">
                <button
                  data-testid="auth-login-demo-fill"
                  type="button"
                  disabled={isBusy}
                  onClick={handleDemoFill}
                  className="rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3 py-0.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                >
                  {t('COMMON.demoFill')}
                </button>
              </div>
            )}

            <PublicAuthSignInRoleSelector
              roles={ROLES}
              selectedRole={selectedRole}
              disabled={isBusy}
              onSelect={handleRoleSelect}
            />

            <PublicAuthSignInForm
              selectedRoleId={selectedRole.id}
              isBusy={isBusy}
              loginSuccess={loginSuccess}
              showPw={showPw}
              onTogglePw={() => setShowPw((prev) => !prev)}
              forgotPasswordHref={PUBLIC_AUTH_INTERNAL_URLS.FORGOT_PASSWORD}
              requiredLabel={t('COMMON.required')}
              hidePasswordLabel={t('PASSWORD.hide')}
              showPasswordLabel={t('PASSWORD.show')}
              register={register}
              errors={errors}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
