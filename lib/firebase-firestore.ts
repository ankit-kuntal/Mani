import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserDocument {
  email: string;
  attemptsLeft: number;
  tempPassword?: string;
  hasSolvedCorrectly: boolean;
  rewardClaimed: boolean;
  answerSubmitted?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getUserDocument(emailOrUid: string): Promise<UserDocument | null> {
  try {
    // Try to get by UID first
    const docRef = doc(db, 'users', emailOrUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserDocument;
    }

    // Try to get by email
    const q = query(collection(db, 'users'), where('email', '==', emailOrUid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserDocument;
    }

    return null;
  } catch (error) {
    console.error('Error fetching user document:', error);
    return null;
  }
}

export async function updateUserDocument(
  uid: string,
  data: Partial<UserDocument>
): Promise<void> {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
}

export async function decrementAttempts(uid: string): Promise<number> {
  try {
    const userDoc = await getUserDocument(uid);

    if (!userDoc) {
      throw new Error('User document not found');
    }

    const newAttemptsLeft = Math.max(0, userDoc.attemptsLeft - 1);

    await updateUserDocument(uid, {
      attemptsLeft: newAttemptsLeft,
    });

    return newAttemptsLeft;
  } catch (error) {
    console.error('Error decrementing attempts:', error);
    throw error;
  }
}

export async function incrementAttempts(uid: string): Promise<number> {
  try {
    const userDoc = await getUserDocument(uid);

    if (!userDoc) {
      throw new Error('User document not found');
    }

    const newAttemptsLeft = userDoc.attemptsLeft + 1;

    await updateUserDocument(uid, {
      attemptsLeft: newAttemptsLeft,
    });

    return newAttemptsLeft;
  } catch (error) {
    console.error('Error incrementing attempts:', error);
    throw error;
  }
}

export async function setSolvedCorrectly(
  uid: string,
  tempPassword: string
): Promise<void> {
  try {
    await updateUserDocument(uid, {
      hasSolvedCorrectly: true,
      tempPassword,
    });
  } catch (error) {
    console.error('Error setting solved correctly:', error);
    throw error;
  }
}

export async function claimReward(uid: string, payoutDetails: any): Promise<void> {
  try {
    await updateUserDocument(uid, {
      rewardClaimed: true,
      payoutDetails,
    });
  } catch (error) {
    console.error('Error claiming reward:', error);
    throw error;
  }
}
