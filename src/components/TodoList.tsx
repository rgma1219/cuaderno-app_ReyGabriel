import { useState, useMemo } from "react";
import type { Task, TaskUpdateInput } from "../types/task.types";
import { TodoItem } from "./TodoItem";

export type TaskFilter = "all" | "pending" | "completed";

export interface TodoListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onToggleCompleted: (
    taskId: string,
    currentCompleted: boolean,
  ) => Promise<void>;
  onEditTask: (taskId: string, input: TaskUpdateInput) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

/**
 * Contenedor del listado de tareas.
 * Administra filtros por estado (Extra Credit: Todas / Pendientes / Completadas),
 * skeleton loaders para carga y estado vacío con estética Glassmorphism.
 */
export function TodoList({
  tasks,
  loading,
  error,
  onToggleCompleted,
  onEditTask,
  onDeleteTask,
}: TodoListProps) {
  const [activeFilter, setActiveFilter] = useState<TaskFilter>("all");

  // Filtrado reactivo en memoria
  const filteredTasks = useMemo(() => {
    if (activeFilter === "pending") return tasks.filter((t) => !t.completed);
    if (activeFilter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, activeFilter]);

  // 1. Estado de Error
  if (error) {
    return (
      <div className="glass-alert glass-alert-error" role="alert">
        <span className="alert-icon">⚠️</span>
        <div className="alert-text">
          <strong>Error al sincronizar tareas:</strong> {error}
        </div>
      </div>
    );
  }

  // 2. Estado de Carga (Skeleton Loaders)
  if (loading) {
    return (
      <div className="tasks-list-container">
        {[1, 2, 3].map((key) => (
          <div key={key} className="task-card glass-card task-skeleton-card">
            <div className="skeleton-checkbox" />
            <div className="skeleton-lines">
              <div className="skeleton-line skeleton-line-title" />
              <div className="skeleton-line skeleton-line-desc" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 3. Estado Vacío General (el usuario no tiene ninguna tarea)
  if (tasks.length === 0) {
    return (
      <div className="tasks-empty-state glass-card">
        <div className="empty-state-icon">📋</div>
        <h3 className="empty-state-title">No tienes tareas registradas</h3>
        <p className="empty-state-subtitle">
          Comienza creando tu primera tarea para organizar tu día.
        </p>
      </div>
    );
  }

  return (
    <div className="tasks-list-wrapper">
      {/* Pestañas de Filtros (Extra Credit) */}
      <nav className="tasks-filter-tabs" aria-label="Filtro de tareas">
        <button
          type="button"
          className={`filter-tab-btn ${activeFilter === "all" ? "is-active" : ""}`}
          onClick={() => setActiveFilter("all")}
        >
          Todas ({tasks.length})
        </button>
        <button
          type="button"
          className={`filter-tab-btn ${activeFilter === "pending" ? "is-active" : ""}`}
          onClick={() => setActiveFilter("pending")}
        >
          Pendientes ({tasks.filter((t) => !t.completed).length})
        </button>
        <button
          type="button"
          className={`filter-tab-btn ${activeFilter === "completed" ? "is-active" : ""}`}
          onClick={() => setActiveFilter("completed")}
        >
          Completadas ({tasks.filter((t) => t.completed).length})
        </button>
      </nav>

      {/* Lista filtrada o estado vacío por filtro */}
      {filteredTasks.length === 0 ? (
        <div
          className="tasks-empty-state glass-card"
          style={{ padding: "2rem 1.5rem" }}
        >
          <p className="empty-state-subtitle">
            No hay tareas en el filtro seleccionado (
            <strong>{activeFilter}</strong>).
          </p>
        </div>
      ) : (
        <div className="tasks-list-container">
          {filteredTasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              onToggleCompleted={onToggleCompleted}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
