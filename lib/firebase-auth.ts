// Firebase Authentication utilities - Updated
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  User,
} from 'firebase/auth';
import { auth } from './firebase';
import { updateUserDocument, getUserDocument } from './firebase-firestore';

const getEmailVerificationActionCodeSettings = () => ({
  url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/` : 'http://localhost:3000/',
  handleCodeInApp: false,
});

export async function signUp(email: string, password: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase is not initialized. Please check your environment variables.');
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification - user data will be saved ONLY after verification
    try {
      await sendEmailVerification(user, getEmailVerificationActionCodeSettings());
    } catch (error: any) {
      // Log and propagate a user-friendly message
      console.error('[Firebase] sendEmailVerification failed:', error);
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/too-many-requests') {
        throw new Error(
          'Too many requests. Please wait a few minutes before trying again.'
        );
      }
      
      throw new Error(
        'Failed to send verification email. Please check your internet connection and try again.'
      );
    }

    // NOTE: User document is NOT created here - it will be created only after email verification
    // This ensures user data is saved only when user is verified

    return user;
  } catch (error: any) {
    throw new Error(`${error.code || 'auth/error'}: ${error.message || error}`);
  }
}

export async function resendVerificationEmail(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase is not initialized');
  }
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in');
  }

  try {
    await sendEmailVerification(user, getEmailVerificationActionCodeSettings());
  } catch (error: any) {
    console.error('[Firebase] resendVerificationEmail failed:', error);
    
    // Handle specific Firebase error codes
    if (error.code === 'auth/too-many-requests') {
      throw new Error(
        'Too many requests. Please wait a few minutes before trying again.'
      );
    }
    
    throw new Error(
      'Failed to resend verification email. Please check your internet connection and try again.'
    );
  }
}

export async function checkEmailVerified(): Promise<boolean> {
  if (!auth) {
    return false;
  }
  try {
    const user = auth.currentUser;
    if (!user) {
      return false;
    }
    
    // Reload user to get the latest email verification status
    await user.reload();
    
    if (user.emailVerified) {
      // Create/Update user document in Firestore ONLY after email is verified
      try {
        await updateUserDocument(user.uid, {
          email: user.email,
          attemptsLeft: 2,
          hasSolvedCorrectly: false,
          rewardClaimed: false,
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any);
      } catch {
        // Firestore document creation failed - non-critical for verification check
        console.error('[Firebase] Failed to create user document after verification');
      }
    }
    
    return user.emailVerified;
  } catch {
    // Handle token expired or other auth errors gracefully
    return false;
  }
}

export async function login(email: string, password: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase is not initialized');
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function loginWithTempPassword(
  email: string,
  tempPassword: string
): Promise<{ user: User; tempPasswordValid: boolean }> {
  // First, verify the temp password against Firestore
  const userDoc = await getUserDocument(email);

  if (!userDoc || userDoc.tempPassword !== tempPassword || !userDoc.hasSolvedCorrectly) {
    return {
      user: null as any,
      tempPasswordValid: false,
    };
  }

  // Temp password is valid - get the user's Firebase password
  // Note: In production, you'd handle this differently
  // For now, we'll just mark the user as authenticated via hasSolvedCorrectly flag
  return {
    user: auth!.currentUser as User,
    tempPasswordValid: true,
  };
}

export async function signOut(): Promise<void> {
  if (!auth) {
    return;
  }
  await firebaseSignOut(auth);
}

export async function validateTempPassword(
  uid: string,
  tempPassword: string
): Promise<boolean> {
  const userDoc = await getUserDocument(uid);
  return userDoc?.tempPassword === tempPassword && userDoc?.hasSolvedCorrectly === true;
}
