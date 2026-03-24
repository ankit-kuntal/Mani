'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/components/auth/FirebaseProvider';
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
import { Eye, EyeOff } from 'lucide-react';

const tempPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  tempPassword: z.string().trim().min(1, 'Temporary password is required'),
});

type TempPasswordFormValues = z.infer<typeof tempPasswordSchema>;

export function TempPasswordForm({
  initialTempPassword = ''
}: {
  initialTempPassword?: string
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TempPasswordFormValues>({
    resolver: zodResolver(tempPasswordSchema),
    defaultValues: {
      email: user?.email || '',
      tempPassword: initialTempPassword || '',
    },
  });

  useEffect(() => {
    if (user?.email && !form.getValues('email')) {
      form.setValue('email', user.email);
    }
  }, [user, form]);

  async function onSubmit(values: TempPasswordFormValues) {
    setLoading(true);
    try {
      // Validate temp password against Firestore, looking up by UID first, fallback to email
      const identifier = user?.uid || values.email;
      const userDoc = await getUserDocument(identifier);

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

      // Temp password is valid, redirect to claim page
      toast.success('Verified successfully!');
      // Store email in sessionStorage for the claim page
      sessionStorage.setItem('verifiedEmail', values.email);
      router.push('/claim');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to verify';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Claim Your Reward</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and temporary password to claim your reward
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
                  <div className="relative">
                    <Input
                      placeholder="Enter your 8-character temp password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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
            {loading ? 'Verifying...' : 'Verify & Claim'}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Need to log in instead?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
