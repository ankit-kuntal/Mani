'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setUser(user);
          setLoading(false);
        },
        (error) => {
          console.error('[v0] Firebase auth error:', error);
          setError(error as Error);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('[v0] Firebase initialization error:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, []);

  // Show error message if Firebase is not configured
  if (error && error.message.includes('invalid-api-key')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="max-w-md space-y-4 p-6 rounded-lg border border-destructive bg-destructive/10">
          <h1 className="text-xl font-bold text-destructive">Firebase Configuration Required</h1>
          <p className="text-sm text-foreground">
            The app is not configured with Firebase credentials. Please add the following environment variables in your project Settings:
          </p>
          <ul className="text-xs space-y-1 font-mono bg-background p-3 rounded border">
            <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
            <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
            <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
            <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
            <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
            <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Find these values in your Firebase Console under Project Settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within FirebaseProvider');
  }
  return context;
}
