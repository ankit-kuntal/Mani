import { Metadata } from 'next';
import { SignupForm } from '@/components/forms/SignupForm';
import { AuthLayout } from '@/components/layout/AuthLayout';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your free account to start solving challenging puzzles and win exciting rewards. Join thousands of puzzle enthusiasts today!',
  openGraph: {
    title: 'Sign Up for Mani Puzzle',
    description: 'Create your free account to start solving challenging puzzles and win exciting rewards.',
  },
};

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
