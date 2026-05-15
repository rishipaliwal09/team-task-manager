import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { createUserProfile, getUserProfile } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      const profile = await getUserProfile(firebaseUser.uid);
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        ...profile,
      });
      setLoading(false);
    });
    return unsub;
  }, []);

  const signup = async ({ name, email, password, role }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await createUserProfile(cred.user.uid, { name, email, role });
    } catch (err) {
      await deleteUser(cred.user);
      throw new Error(
        err.code === 'permission-denied'
          ? 'Firestore rules blocked signup. Publish security rules in Firebase Console (see firebase/PASTE_IN_CONSOLE.rules).'
          : err.message
      );
    }
    const profile = await getUserProfile(cred.user.uid);
    const userData = { uid: cred.user.uid, email, ...profile };
    setUser(userData);
    localStorage.setItem('token', await cred.user.getIdToken());
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(cred.user.uid);
    const userData = { uid: cred.user.uid, email: cred.user.email, ...profile };
    setUser(userData);
    localStorage.setItem('token', await cred.user.getIdToken());
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
