import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Get Firebase ID token for backend verification
    const idToken = await result.user.getIdToken();
    
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      idToken, // Add Firebase token
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Google login failed';
    throw new Error(errorMessage);
  }
};

export const googleLogout = async () => {
  await signOut(auth);
};
