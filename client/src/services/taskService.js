import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const tasksRef = collection(db, 'tasks');

export const TASK_STATUSES = ['todo', 'inProgress', 'done'];
export const TASK_PRIORITIES = ['low', 'medium', 'high'];

export async function createTask(data) {
  const docRef = await addDoc(tasksRef, {
    ...data,
    status: data.status || 'todo',
    priority: data.priority || 'medium',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const snap = await getDoc(docRef);
  return { id: docRef.id, ...snap.data() };
}

export async function getTasksByProject(projectId) {
  const q = query(tasksRef, where('projectId', '==', projectId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getTasksForUser(userId) {
  const q = query(tasksRef, where('assignedTo', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAllTasks() {
  const snap = await getDocs(tasksRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateTask(id, data) {
  await updateDoc(doc(db, 'tasks', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
  const snap = await getDoc(doc(db, 'tasks', id));
  return { id: snap.id, ...snap.data() };
}

export async function deleteTask(id) {
  await deleteDoc(doc(db, 'tasks', id));
}

export async function addTaskUpdate(taskId, { text, authorId, authorName }) {
  const updatesRef = collection(db, 'tasks', taskId, 'updates');
  const docRef = await addDoc(updatesRef, {
    text,
    authorId,
    authorName,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'tasks', taskId), {
    updatedAt: serverTimestamp(),
  });
  const snap = await getDoc(docRef);
  return { id: docRef.id, ...snap.data() };
}

export async function getTaskUpdates(taskId) {
  const updatesRef = collection(db, 'tasks', taskId, 'updates');
  const q = query(updatesRef, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function isTaskOverdue(task) {
  if (!task.dueDate || task.status === 'done') return false;
  const due = task.dueDate?.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
  return due < new Date();
}

export function getDashboardStats(tasks) {
  return {
    totalTasks: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'inProgress').length,
    done: tasks.filter((t) => t.status === 'done').length,
    overdue: tasks.filter(isTaskOverdue).length,
  };
}
