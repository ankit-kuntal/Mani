'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getUserDocument, decrementAttempts, incrementAttempts } from '@/lib/firebase-firestore';

export function useAttempts() {
  const { user } = useAuth();
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchAttempts = async () => {
      try {
        const userDoc = await getUserDocument(user.uid);
        if (userDoc) {
          setAttemptsLeft(userDoc.attemptsLeft);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch attempts');
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [user]);

  const decrement = async () => {
    if (!user) return;
    try {
      const newAttempts = await decrementAttempts(user.uid);
      setAttemptsLeft(newAttempts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decrement attempts');
    }
  };

  const increment = async () => {
    if (!user) return;
    try {
      const newAttempts = await incrementAttempts(user.uid);
      setAttemptsLeft(newAttempts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to increment attempts');
    }
  };

  return {
    attemptsLeft,
    loading,
    error,
    decrement,
    increment,
  };
}
