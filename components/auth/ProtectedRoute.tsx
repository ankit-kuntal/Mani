'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { Spinner } from '@/components/ui/spinner';
import { EmailVerificationForm } from '@/components/forms/EmailVerificationForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredSolvedCorrectly?: boolean;
  requireEmailVerification?: boolean;
}

export function ProtectedRoute({
  children,
  requiredSolvedCorrectly = false,
  requireEmailVerification = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/signup');
      return;
    }

    if (requiredSolvedCorrectly) {
      // Additional check for hasSolvedCorrectly would happen in the page component
      // via getUserDocument() since we can't easily access it here
    }
  }, [user, loading, router, requiredSolvedCorrectly]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show email verification form if user hasn't verified their email
  if (requireEmailVerification && !user.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EmailVerificationForm email={user.email || ''} />
      </div>
    );
  }

  return <>{children}</>;
}
