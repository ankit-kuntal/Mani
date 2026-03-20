import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBHvCUob5nLwXfbottoaN4cmwqpC-3j5Z0',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mani-puzzle.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mani-puzzle',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mani-puzzle.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '322533177977',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:322533177977:web:e3ef58d5ac5e7b019af2a8',
};

// Check if Firebase config is complete
const isFirebaseConfigValid = Object.values(firebaseConfig).every(value => value);

if (!isFirebaseConfigValid && typeof window !== 'undefined') {
  console.error(
    'Firebase configuration is incomplete. Please add the following environment variables:\n' +
    '- NEXT_PUBLIC_FIREBASE_API_KEY\n' +
    '- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\n' +
    '- NEXT_PUBLIC_FIREBASE_PROJECT_ID\n' +
    '- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\n' +
    '- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\n' +
    '- NEXT_PUBLIC_FIREBASE_APP_ID'
  );
}

// Initialize Firebase (avoid re-initialization in dev mode)
let app;
let auth;
let db;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('[v0] Firebase initialization error:', error);
  // Create dummy app for error handling
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = null;
  db = null;
}

export { auth, db };
export default app;
