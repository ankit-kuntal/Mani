'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { validateAnswer, isCorrectAnswer } from '@/lib/puzzle-logic';
import { generateTempPassword } from '@/lib/password-generator';
import { decrementAttempts, setSolvedCorrectly } from '@/lib/firebase-firestore';
import { toast } from 'sonner';

interface SubmitResult {
  correct: boolean;
  formatValid: boolean;
  message: string;
  tempPassword?: string;
}

export function usePuzzle() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<SubmitResult | null>(null);

  const submitAnswer = async (answer: string): Promise<SubmitResult | null> => {
    if (!user) {
      toast.error('You must be logged in to submit an answer');
      return null;
    }

    setSubmitting(true);
    try {
      // Validate the answer format and correctness
      const validation = validateAnswer(answer);

      // Decrement attempts regardless of correctness
      await decrementAttempts(user.uid);

      let result: SubmitResult = {
        correct: validation.correct,
        formatValid: validation.formatValid,
        message: validation.message,
      };

      // If answer is correct, generate temp password
      if (validation.correct && validation.formatValid) {
        const tempPassword = generateTempPassword();
        await setSolvedCorrectly(user.uid, tempPassword);
        result.tempPassword = tempPassword;
        toast.success('Congratulations! Your temp password has been generated.');
      } else if (!validation.formatValid) {
        toast.error(validation.message);
      } else {
        toast.error(validation.message);
      }

      setLastResult(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit answer';
      toast.error(errorMessage);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    lastResult,
    submitAnswer,
  };
}
