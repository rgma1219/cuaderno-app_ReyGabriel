import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import {
  subscribeUserTasks,
  createTask as createTaskService,
  updateTask as updateTaskService,
  toggleTaskCompleted as toggleTaskCompletedService,
  deleteTask as deleteTaskService,
} from '../services/task.service';
import type { Task, TaskCreateInput, TaskUpdateInput } from '../types/task.types';

export interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  addTask: (input: TaskCreateInput) => Promise<string>;
  editTask: (taskId: string, input: TaskUpdateInput) => Promise<void>;
  toggleCompleted: (taskId: string, currentCompleted: boolean) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
}

/**
 * Custom Hook que conecta la interfaz con Cloud Firestore.
 * Gestiona la sincronización reactiva en tiempo real (onSnapshot),
 * estados de carga/error y operaciones CRUD filtradas por el usuario actual.
 */
export function useTasks(): UseTasksReturn {
  const { user } = useAuth();
  const userId = user?.uid;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Suscripción reactiva en tiempo real cuando hay un usuario autenticado
  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribe = subscribeUserTasks(
      userId,
      (updatedTasks) => {
        setTasks(updatedTasks);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const activeTasks = useMemo(() => (userId ? tasks : []), [userId, tasks]);
  const activeLoading = userId ? loading : false;

  // Operaciones CRUD memoizadas para prevenir re-renders en componentes hijos
  const addTask = useCallback(
    async (input: TaskCreateInput): Promise<string> => {
      if (!userId) {
        throw new Error('Debes estar autenticado para crear una tarea.');
      }
      return await createTaskService(userId, input);
    },
    [userId],
  );

  const editTask = useCallback(
    async (taskId: string, input: TaskUpdateInput): Promise<void> => {
      await updateTaskService(taskId, input);
    },
    [],
  );

  const toggleCompleted = useCallback(
    async (taskId: string, currentCompleted: boolean): Promise<void> => {
      await toggleTaskCompletedService(taskId, currentCompleted);
    },
    [],
  );

  const removeTask = useCallback(
    async (taskId: string): Promise<void> => {
      await deleteTaskService(taskId);
    },
    [],
  );

  // Métricas calculadas para la interfaz
  const totalCount = activeTasks.length;
  const completedCount = useMemo(
    () => activeTasks.filter((t) => t.completed).length,
    [activeTasks],
  );
  const pendingCount = totalCount - completedCount;

  return {
    tasks: activeTasks,
    loading: activeLoading,
    error,
    totalCount,
    pendingCount,
    completedCount,
    addTask,
    editTask,
    toggleCompleted,
    removeTask,
  };
}
