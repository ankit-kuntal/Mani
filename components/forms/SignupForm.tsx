'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signUp } from '@/lib/firebase-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import Link from 'next/link';
import { EmailVerificationForm } from './EmailVerificationForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    acceptedTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

function TermsContent() {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h3 className="font-semibold mb-2">1. Eligibility</h3>
        <p className="text-muted-foreground">
          You must be at least 18 years old and reside in a supported jurisdiction to participate
          in this puzzle reward program. By participating, you represent that you meet these
          eligibility requirements.
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">2. Puzzle Rules</h3>
        <p className="text-muted-foreground">
          Each account is allocated 2 free attempts to solve the puzzle. Additional attempts can
          be earned by watching rewarded advertisements. The correct answer must be submitted in
          the specified format. Attempts are consumed regardless of answer correctness.
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">3. Temporary Password</h3>
        <p className="text-muted-foreground">
          Upon solving the puzzle correctly, you will receive a temporary password. This password
          is for single-use authentication only and must be used within 7 days of generation. You
          are responsible for keeping your temporary password confidential.
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">4. Reward Claim</h3>
        <p className="text-muted-foreground">
          To claim your reward, you must log in with the temporary password and provide valid
          payment details (UPI ID or Bank Account). Rewards are typically processed within 24-72
          business hours. We reserve the right to verify payment details and may request
          additional documentation.
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">5. Prohibited Activities</h3>
        <p className="text-muted-foreground">
          The following are strictly prohibited: attempting to manipulate or cheat the puzzle
          system, sharing accounts or temporary passwords, using bots or automated tools,
          exploiting security vulnerabilities, and attempting multiple account registrations.
          Violations may result in immediate account termination and forfeiture of rewards.
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">6. Limitation of Liability</h3>
        <p className="text-muted-foreground">
          We provide this service "as is" without warranties. We are not responsible for
          technical issues, data loss, or payment processing failures. Your use of this service
          is at your own risk.
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">7. Privacy</h3>
        <p className="text-muted-foreground">
          We collect and process personal data (email, payment details) for reward processing and
          fraud prevention. Your data is protected according to applicable privacy laws and will
          not be shared with third parties without consent.
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">8. Dispute Resolution</h3>
        <p className="text-muted-foreground">
          Any disputes arising from this program are subject to binding arbitration. You agree to
          waive your right to class action lawsuits.
        </p>
      </div>
    </div>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptedTerms: false,
    },
  });

  const acceptedTerms = form.watch('acceptedTerms');

  async function onSubmit(values: SignupFormValues) {
    if (!values.acceptedTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    setLoading(true);
    try {
      await signUp(values.email, values.password);
      toast.success('Account created! Please verify your email.');
      setUserEmail(values.email);
      setShowVerification(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create account';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  // Show email verification form after signup
  if (showVerification) {
    return <EmailVerificationForm email={userEmail} />;
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-sm text-muted-foreground">
          Sign up to tackle the puzzle and claim your reward
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="At least 6 characters" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm your password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptedTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="terms"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="font-normal cursor-pointer" htmlFor="terms">
                    I have read and accept the{' '}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-primary hover:underline font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          terms and conditions
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Terms & Conditions</DialogTitle>
                          <DialogDescription>
                            Please read the following terms carefully before signing up.
                          </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[50vh] pr-4">
                          <TermsContent />
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !acceptedTerms}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
