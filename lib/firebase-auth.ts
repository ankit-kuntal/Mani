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

export async function signUp(email: string, password: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase is not initialized. Please check your environment variables.');
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification first - user document will only be created after verification
    await sendEmailVerification(user);

    // Note: User document is NOT created here
    // It will only be created after email verification in checkEmailVerified()
    // This ensures unverified users are not saved to Firestore

    return user;
  } catch (error: any) {
    throw new Error(`${error.code}: ${error.message}`);
  }
}

export async function resendVerificationEmail(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase is not initialized');
  }
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    await sendEmailVerification(user);
  } catch (error) {
    throw error;
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
      // Only create/update user document in Firestore after email is verified
      // This ensures unverified users are never saved to the database
      try {
        await updateUserDocument(user.uid, {
          email: user.email || '',
          attemptsLeft: 2,
          hasSolvedCorrectly: false,
          rewardClaimed: false,
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch {
        // Firestore update failed - non-critical for verification status
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
    user: auth.currentUser as User,
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
