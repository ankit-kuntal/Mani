import { AuthLayout } from '@/components/layout/AuthLayout';
import EmailVerificationForm from '@/components/forms/EmailVerificationForm';

export default function VerificationPage() {
  return (
    <AuthLayout>
      <EmailVerificationForm />
    </AuthLayout>
  );
}
