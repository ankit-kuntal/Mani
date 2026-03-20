import { SignupForm } from '@/components/forms/SignupForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
