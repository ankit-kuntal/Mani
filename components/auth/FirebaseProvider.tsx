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
    // Check if auth is null (initialization failed)
    if (!auth) {
      const err = new Error('Firebase authentication failed to initialize. Please verify your API key is valid and has authentication enabled.');
      setError(err);
      setLoading(false);
      return;
    }

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

  // Show error message if Firebase is not configured or has errors
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="max-w-md space-y-4 p-6 rounded-lg border border-destructive bg-destructive/10">
          <h1 className="text-xl font-bold text-destructive">Firebase Configuration Error</h1>
          <p className="text-sm text-foreground">
            {error.message || 'Firebase initialization failed. Please check your credentials.'}
          </p>
          {error.message.includes('invalid-api-key') && (
            <>
              <p className="text-sm text-foreground">
                Please verify that:
              </p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>API key is correct</li>
                <li>Authentication is enabled in Firebase Console</li>
                <li>Domain restrictions are not blocking this origin</li>
              </ul>
            </>
          )}
          <p className="text-xs text-muted-foreground">
            Check Firebase Console under Project Settings for your correct credentials.
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
