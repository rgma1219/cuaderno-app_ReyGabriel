import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  type Unsubscribe,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task, TaskCreateInput, TaskUpdateInput } from '../types/task.types';

const TASKS_COLLECTION = 'tasks';

/**
 * Convierte un documento de Cloud Firestore en una entidad tipada Task.
 */
function docToTask(docSnap: QueryDocumentSnapshot<DocumentData>): Task {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    userId: String(data.userId || ''),
    title: String(data.title || ''),
    description: String(data.description || ''),
    completed: Boolean(data.completed),
    createdAt: Number(data.createdAt) || Date.now(),
    updatedAt: Number(data.updatedAt) || Date.now(),
  };
}

/**
 * Suscribe un observador en tiempo real (onSnapshot) a las tareas del usuario autenticado.
 * Filtra estrictamente por userId y ordena por fecha de creación descendente.
 * Retorna la función Unsubscribe para limpieza en useEffect.
 */
export function subscribeUserTasks(
  userId: string,
  onUpdate: (tasks: Task[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const tasksRef = collection(db, TASKS_COLLECTION);
  const q = query(tasksRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const tasks = snapshot.docs.map(docToTask);
      // Orden cronológico: las tareas más recientes primero
      tasks.sort((a, b) => b.createdAt - a.createdAt);
      onUpdate(tasks);
    },
    (err) => {
      onError(new Error(err.message || 'Error al sincronizar las tareas desde Firestore.'));
    },
  );
}

/**
 * Crea una nueva tarea en Cloud Firestore asociada al usuario actual.
 */
export async function createTask(
  userId: string,
  input: TaskCreateInput,
): Promise<string> {
  const now = Date.now();
  const taskData = {
    userId,
    title: input.title.trim(),
    description: input.description.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, TASKS_COLLECTION), taskData);
  return docRef.id;
}

/**
 * Actualiza los campos de una tarea existente.
 */
export async function updateTask(
  taskId: string,
  input: TaskUpdateInput,
): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  const updates: Record<string, string | boolean | number> = {
    updatedAt: Date.now(),
  };

  if (input.title !== undefined) {
    updates.title = input.title.trim();
  }

  if (input.description !== undefined) {
    updates.description = input.description.trim();
  }

  if (input.completed !== undefined) {
    updates.completed = input.completed;
  }

  await updateDoc(taskRef, updates);
}

/**
 * Conmuta el estado de completitud de una tarea (toggle).
 */
export async function toggleTaskCompleted(
  taskId: string,
  currentCompleted: boolean,
): Promise<void> {
  await updateTask(taskId, { completed: !currentCompleted });
}

/**
 * Elimina permanentemente una tarea de Cloud Firestore.
 */
export async function deleteTask(taskId: string): Promise<void> {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  await deleteDoc(taskRef);
}
