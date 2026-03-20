'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RewardSubmittedPage() {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Congratulations!</h1>
          <p className="text-lg text-muted-foreground">
            Your reward claim has been submitted successfully.
          </p>
        </div>

        <div className="bg-card border rounded-lg p-4 space-y-2 text-left">
          <p className="text-sm font-semibold">What happens next?</p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>✓ Your claim is being processed</li>
            <li>✓ You will receive your reward in 24-72 business hours</li>
            <li>✓ An email confirmation has been sent to your registered email</li>
            <li>✓ You can check your account status anytime by logging back in</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Thank you for solving the puzzle! We appreciate your participation.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
