/**
 * Modelo de dominio para una tarea en la aplicación Cuaderno.
 * Desacoplado de la estructura interna del SDK de Firestore.
 */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Datos requeridos para la creación de una nueva tarea desde la interfaz de usuario.
 */
export interface TaskCreateInput {
  title: string;
  description: string;
}

/**
 * Datos permitidos para la edición o actualización parcial de una tarea existente.
 */
export interface TaskUpdateInput {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * Estado del listado y operaciones de tareas en la aplicación.
 */
export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}
