import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export async function createUserProfile(uid, { name, email, role }) {
  await setDoc(doc(db, 'users', uid), {
    name,
    email,
    role,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** All accounts except the logged-in user (for assign / team lists) */
export async function getTeamMembers(excludeUserId) {
  const all = await getAllUsers();
  return all
    .filter((u) => u.id !== excludeUserId)
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export function groupMembersByName(members) {
  const groups = {};
  for (const m of members) {
    const key = (m.name || 'Unknown').trim().toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  }
  return Object.entries(groups).map(([key, list]) => ({
    name: list[0].name || key,
    members: list,
    count: list.length,
  }));
}
