import { TempPasswordForm } from '@/components/forms/TempPasswordForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default async function VerifyRewardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const tempPasswordParam = resolvedParams.tempPassword;
  const tempPasswordStr = typeof tempPasswordParam === 'string' ? tempPasswordParam : '';

  return (
    <AuthLayout>
      <TempPasswordForm initialTempPassword={tempPasswordStr} />
    </AuthLayout>
  );
}
