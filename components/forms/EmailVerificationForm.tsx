'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { checkEmailVerified, resendVerificationEmail } from '@/lib/firebase-auth';
import { Mail, RefreshCw, CheckCircle2 } from 'lucide-react';

interface EmailVerificationFormProps {
  email: string;
}

export function EmailVerificationForm({ email }: EmailVerificationFormProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Auto-check verification status every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      const isVerified = await checkEmailVerified();
      if (isVerified) {
        setVerified(true);
        clearInterval(interval);
        toast.success('Email verified successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      const isVerified = await checkEmailVerified();
      if (isVerified) {
        setVerified(true);
        toast.success('Email verified successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        toast.info('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error) {
      toast.error('Failed to check verification status');
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await resendVerificationEmail();
      toast.success('Verification email sent! Please check your inbox.');
      setCountdown(60); // 60 second cooldown
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend email';
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Email Verified!</h2>
              <p className="text-sm text-muted-foreground">
                Redirecting you to the dashboard...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          <p>Please check your inbox and click the verification link to continue. The page will automatically redirect once verified.</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleCheckVerification}
            disabled={checking}
            className="w-full"
          >
            {checking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                I've Verified My Email
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleResendEmail}
            disabled={resending || countdown > 0}
            className="w-full"
          >
            {resending ? (
              'Sending...'
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              'Resend Verification Email'
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Didn't receive the email? Check your spam folder or try resending.
        </p>
      </CardContent>
    </Card>
  );
}
