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

// Initialize Firebase app (with error handling)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Get Auth and Firestore with error suppression (errors will be caught in the provider)
let auth: any = null;
let db: any = null;

try {
  auth = getAuth(app);
} catch (error) {
  console.error('[v0] Firebase auth initialization error:', error);
}

try {
  db = getFirestore(app);
} catch (error) {
  console.error('[v0] Firebase firestore initialization error:', error);
}

export { auth, db };
export default app;
