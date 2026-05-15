import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const projectsRef = collection(db, 'projects');

export async function createProject({ name, description, members, createdBy }) {
  const docRef = await addDoc(projectsRef, {
    name,
    description: description || '',
    members: members || [],
    createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const snap = await getDoc(docRef);
  return { id: docRef.id, ...snap.data() };
}

export async function getProjectsForUser(userId) {
  const q = query(
    projectsRef,
    where('members', 'array-contains', userId)
  );
  const memberSnap = await getDocs(q);

  const creatorQ = query(projectsRef, where('createdBy', '==', userId));
  const creatorSnap = await getDocs(creatorQ);

  const map = new Map();
  [...memberSnap.docs, ...creatorSnap.docs].forEach((d) => {
    map.set(d.id, { id: d.id, ...d.data() });
  });
  return Array.from(map.values());
}

export async function getAllProjects() {
  const snap = await getDocs(projectsRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProjectById(id) {
  const snap = await getDoc(doc(db, 'projects', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function updateProject(id, data) {
  await updateDoc(doc(db, 'projects', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return getProjectById(id);
}

export async function deleteProject(id) {
  await deleteDoc(doc(db, 'projects', id));
}
