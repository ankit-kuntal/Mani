'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePuzzle } from '@/hooks/usePuzzle';
import { useAttempts } from '@/hooks/useAttempts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Form } from '@/components/ui/form';
import { PuzzleCanvas } from '@/components/puzzle/PuzzleCanvas';
import { AttemptCounter } from '@/components/puzzle/AttemptCounter';
import { FeedbackMessage } from '@/components/puzzle/FeedbackMessage';
import { RewardedAdModal } from '@/components/puzzle/RewardedAdModal';

const answerSchema = z.object({
  answer: z.string().min(1, 'Please enter your answer'),
});

type AnswerFormValues = z.infer<typeof answerSchema>;

export function PuzzleAnswerForm() {
  const form = useForm<AnswerFormValues>({
    resolver: zodResolver(answerSchema),
    defaultValues: { answer: '' },
  });

  const { submitting, lastResult, submitAnswer } = usePuzzle();
  const { attemptsLeft, loading: attemptsLoading } = useAttempts();
  const [showAdModal, setShowAdModal] = useState(false);

  async function onSubmit(values: AnswerFormValues) {
    const result = await submitAnswer(values.answer);
    if (result) {
      form.reset();
    }
  }

  return (
    <div className="w-full space-y-8 puzzle-content">
      {/* Puzzle Riddle */}
      <div className="bg-card rounded-lg border p-6 space-y-4 select-none">
        <h2 className="text-xl font-semibold">The Puzzle</h2>
        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong>Question:</strong> What is the answer to life, the universe, and everything?
          </p>
          <p className="text-sm italic">
            Hint: Think Douglas Adams. Think science fiction. Think digital.
          </p>
        </div>
      </div>

      {/* Puzzle Canvas */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Puzzle Image:</p>
        <PuzzleCanvas />
      </div>

      {/* Attempt Counter */}
      <AttemptCounter attemptsLeft={attemptsLeft} loading={attemptsLoading} />

      {/* Feedback Message */}
      {lastResult && (
        <FeedbackMessage
          message={lastResult.message}
          type={lastResult.correct ? 'success' : lastResult.formatValid ? 'warning' : 'error'}
          tempPassword={lastResult.tempPassword}
        />
      )}

      {/* Answer Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Answer</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your answer here..."
                    disabled={submitting || attemptsLeft === 0}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {attemptsLeft === 0 ? (
            <Button
              type="button"
              onClick={() => setShowAdModal(true)}
              className="w-full"
              size="lg"
            >
              Watch Ad for +1 Attempt
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          )}
        </form>
      </Form>

      {/* Rewarded Ad Modal */}
      <RewardedAdModal isOpen={showAdModal} onClose={() => setShowAdModal(false)} />
    </div>
  );
}
