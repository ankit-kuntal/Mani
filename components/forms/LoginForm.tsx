'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { login } from '@/lib/firebase-auth';
import { getUserDocument } from '@/lib/firebase-firestore';
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
import { toast } from 'sonner';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  tempPassword: z.string().min(1, 'Temporary password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      tempPassword: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setLoading(true);
    try {
      // Validate temp password against Firestore
      const userDoc = await getUserDocument(values.email);

      if (!userDoc) {
        toast.error('User not found');
        setLoading(false);
        return;
      }

      if (!userDoc.hasSolvedCorrectly) {
        toast.error('You must solve the puzzle first');
        setLoading(false);
        return;
      }

      if (userDoc.tempPassword !== values.tempPassword) {
        toast.error('Invalid temporary password');
        setLoading(false);
        return;
      }

      // Log in with the email and a placeholder password
      // In production, you'd have a special login flow for temp passwords
      // For now, we'll just mark them as authenticated and redirect
      toast.success('Logged in successfully!');
      router.push('/claim');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to log in';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Log In</h1>
        <p className="text-sm text-muted-foreground">
          Enter your temporary password to claim your reward
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
            name="tempPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temporary Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your 8-character temp password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
