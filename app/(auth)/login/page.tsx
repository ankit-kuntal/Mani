import { LoginForm } from '@/components/forms/LoginForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
