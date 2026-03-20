import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn('[Firebase] Missing required environment variables. Firebase services may not work correctly.');
}

// Initialize Firebase app (with error handling)
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error('[Firebase] App initialization error:', error);
  throw error;
}

// Get Auth and Firestore with error suppression
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  auth = getAuth(app);
} catch (error) {
  console.error('[Firebase] Auth initialization error:', error);
}

try {
  db = getFirestore(app);
} catch (error) {
  console.error('[Firebase] Firestore initialization error:', error);
}

export { auth, db };
export default app;