'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredSolvedCorrectly?: boolean;
}

export function ProtectedRoute({
  children,
  requiredSolvedCorrectly = false,
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

  return <>{children}</>;
}
