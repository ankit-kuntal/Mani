'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { claimReward, getUserDocument } from '@/lib/firebase-firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';

const claimSchema = z
  .object({
    paymentMethod: z.enum(['upi', 'bank']),
    upiId: z.string().optional(),
    bankAccount: z.string().optional(),
    ifscCode: z.string().optional(),
    holderName: z.string().min(2, 'Holder name is required'),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === 'upi') {
        return data.upiId && data.upiId.length > 0;
      }
      return true;
    },
    {
      message: 'UPI ID is required for UPI payments',
      path: ['upiId'],
    }
  )
  .refine(
    (data) => {
      if (data.paymentMethod === 'bank') {
        return data.bankAccount && data.ifscCode && data.bankAccount.length > 0 && data.ifscCode.length > 0;
      }
      return true;
    },
    {
      message: 'Bank account and IFSC code are required for bank transfers',
      path: ['bankAccount'],
    }
  );

type ClaimFormValues = z.infer<typeof claimSchema>;

export function ClaimRewardForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSolved, setIsSolved] = useState<boolean | null>(null);

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      paymentMethod: 'upi',
      upiId: '',
      bankAccount: '',
      ifscCode: '',
      holderName: '',
    },
  });

  // Check if user has solved the puzzle
  React.useEffect(() => {
    async function checkSolved() {
      if (!user) return;
      try {
        const userDoc = await getUserDocument(user.uid);
        setIsSolved(userDoc?.hasSolvedCorrectly ?? false);
      } catch (error) {
        toast.error('Failed to verify puzzle status');
      }
    }
    checkSolved();
  }, [user]);

  async function onSubmit(values: ClaimFormValues) {
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    setLoading(true);
    try {
      const payoutDetails = {
        method: values.paymentMethod,
        upiId: values.upiId || undefined,
        bankAccount: values.bankAccount || undefined,
        ifscCode: values.ifscCode || undefined,
        holderName: values.holderName,
        submittedAt: new Date(),
      };

      await claimReward(user.uid, payoutDetails);
      toast.success('Reward claim submitted! You will receive your payment in 24-72 business hours.');
      router.push('/reward-submitted');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to claim reward';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (isSolved === null) {
    return <p className="text-center text-muted-foreground">Verifying your status...</p>;
  }

  if (!isSolved) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
        <p className="text-yellow-900 dark:text-yellow-100 font-semibold mb-2">
          Puzzle Not Solved Yet
        </p>
        <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-4">
          You must solve the puzzle first before claiming your reward. Return to the dashboard and submit the correct answer.
        </p>
        <Button onClick={() => router.push('/dashboard')}>
          Back to Puzzle
        </Button>
      </div>
    );
  }

  const paymentMethod = form.watch('paymentMethod');

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Claim Your Reward</h1>
        <p className="text-sm text-muted-foreground">
          Provide your payment details to receive your reward
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {paymentMethod === 'upi' && (
            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPI ID</FormLabel>
                  <FormControl>
                    <Input placeholder="yourname@upi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {paymentMethod === 'bank' && (
            <>
              <FormField
                control={form.control}
                name="bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your account number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., HDFC0000001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="holderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Claim Reward'}
          </Button>
        </form>
      </Form>

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          ℹ️ Your reward will be processed within 24-72 business hours. Please ensure your payment details are correct.
        </p>
      </div>
    </div>
  );
}
