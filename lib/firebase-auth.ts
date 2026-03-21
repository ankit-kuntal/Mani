import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  User,
  Auth,
} from 'firebase/auth';
import { auth } from './firebase';
import { updateUserDocument, getUserDocument } from './firebase-firestore';

export async function signUp(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send email verification first - this is the critical step
    await sendEmailVerification(user);
    console.log('[v0] Email verification sent to:', email);

    // Try to create user document in Firestore, but don't fail signup if it fails
    try {
      await updateUserDocument(user.uid, {
        email,
        attemptsLeft: 2,
        hasSolvedCorrectly: false,
        rewardClaimed: false,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('[v0] User document created in Firestore');
    } catch (firestoreError: any) {
      // Log but don't fail - Firestore document can be created later
      console.warn('[v0] Firestore document creation failed (will retry later):', firestoreError.message);
    }

    return user;
  } catch (error: any) {
    console.error('[Firebase Auth signUp] error', error.code, error.message);
    throw new Error(`${error.code}: ${error.message}`);
  }
}

export async function resendVerificationEmail(): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in');
  }
  await sendEmailVerification(user);
}

export async function checkEmailVerified(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) {
    return false;
  }
  
  // Reload user to get the latest email verification status
  await user.reload();
  
  if (user.emailVerified) {
    // Update Firestore document
    await updateUserDocument(user.uid, {
      emailVerified: true,
      updatedAt: new Date(),
    });
  }
  
  return user.emailVerified;
}

export async function login(email: string, password: string): Promise<User> {
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
  await firebaseSignOut(auth);
}

export async function validateTempPassword(
  uid: string,
  tempPassword: string
): Promise<boolean> {
  const userDoc = await getUserDocument(uid);
  return userDoc?.tempPassword === tempPassword && userDoc?.hasSolvedCorrectly === true;
}
