import { useState, type SyntheticEvent } from 'react';
import type { Task, TaskUpdateInput } from '../types/task.types';

export interface TodoItemProps {
  task: Task;
  onToggleCompleted: (taskId: string, currentCompleted: boolean) => Promise<void>;
  onEditTask: (taskId: string, input: TaskUpdateInput) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

/**
 * Componente individual para representar una tarea.
 * Incluye visualización responsiva, modo de edición en línea,
 * confirmación de eliminación no bloqueante y toggle de completada.
 */
export function TodoItem({
  task,
  onToggleCompleted,
  onEditTask,
  onDeleteTask,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [isBusy, setIsBusy] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Toggle del estado completada / pendiente
  const handleToggle = async () => {
    if (isBusy || isEditing) return;
    setIsBusy(true);
    setErrorMessage(null);
    try {
      await onToggleCompleted(task.id, task.completed);
    } catch (err) {
      console.error('Error al cambiar estado de la tarea:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Error al actualizar el estado de la tarea.',
      );
    } finally {
      setIsBusy(false);
    }
  };

  // Guardar edición
  const handleSaveEdit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setErrorMessage('El título no puede quedar vacío.');
      return;
    }

    setErrorMessage(null);
    setIsBusy(true);

    try {
      await onEditTask(task.id, {
        title: trimmedTitle,
        description: editDescription.trim(),
      });
      setIsEditing(false);
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Error al actualizar la tarea.');
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setErrorMessage(null);
    setIsEditing(false);
  };

  // Eliminar tarea
  const handleDelete = async () => {
    setIsBusy(true);
    setErrorMessage(null);
    try {
      await onDeleteTask(task.id);
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Error al eliminar la tarea.',
      );
      setIsBusy(false);
      setShowConfirmDelete(false);
    }
  };

  // Renderizado en Modo Edición
  if (isEditing) {
    return (
      <article className="task-card glass-card task-card-editing">
        <form onSubmit={handleSaveEdit} className="task-edit-form">
          {errorMessage && (
            <div className="glass-alert glass-alert-error" role="alert">
              <span className="alert-text">{errorMessage}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor={`edit-title-${task.id}`} className="form-label">
              Título
            </label>
            <input
              id={`edit-title-${task.id}`}
              type="text"
              className="glass-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={isBusy}
              maxLength={120}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`edit-desc-${task.id}`} className="form-label">
              Descripción
            </label>
            <textarea
              id={`edit-desc-${task.id}`}
              className="glass-textarea"
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={isBusy}
              maxLength={500}
            />
          </div>

          <div className="task-edit-actions">
            <button
              type="submit"
              className="glass-button glass-button-primary task-btn-sm"
              disabled={isBusy}
            >
              {isBusy ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              className="glass-button glass-button-secondary task-btn-sm"
              onClick={handleCancelEdit}
              disabled={isBusy}
            >
              Cancelar
            </button>
          </div>
        </form>
      </article>
    );
  }

  // Renderizado en Modo Lectura (Normal)
  return (
    <article
      className={`task-card glass-card ${task.completed ? 'task-card-completed' : ''}`}
    >
      {errorMessage && (
        <div className="glass-alert glass-alert-error" role="alert" style={{ marginBottom: '12px' }}>
          <span className="alert-text">{errorMessage}</span>
        </div>
      )}
      <div className="task-main-content">
        {/* Checkbox circular estilizado */}
        <button
          type="button"
          onClick={handleToggle}
          className={`task-checkbox-btn ${task.completed ? 'is-checked' : ''}`}
          aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          disabled={isBusy}
        >
          {task.completed && <span className="checkmark-icon">✓</span>}
        </button>

        {/* Información textual */}
        <div className="task-info">
          <h3
            className={`task-title ${task.completed ? 'task-title-completed' : ''}`}
            onClick={handleToggle}
            style={{ cursor: 'pointer' }}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="task-desc">{task.description}</p>
          )}
        </div>
      </div>

      {/* Zona de Acciones y Badge */}
      <div className="task-footer-actions">
        <span
          className={`glass-badge ${task.completed ? 'badge-completed' : 'badge-pending'}`}
        >
          {task.completed ? 'Completada' : 'Pendiente'}
        </span>

        {showConfirmDelete ? (
          <div className="task-delete-confirm-box">
            <span className="confirm-delete-text">¿Eliminar?</span>
            <button
              type="button"
              className="glass-button task-btn-danger-confirm"
              onClick={handleDelete}
              disabled={isBusy}
            >
              Sí
            </button>
            <button
              type="button"
              className="glass-button glass-button-secondary task-btn-sm"
              onClick={() => setShowConfirmDelete(false)}
              disabled={isBusy}
            >
              No
            </button>
          </div>
        ) : (
          <div className="task-buttons-group">
            <button
              type="button"
              className="task-action-btn"
              onClick={() => setIsEditing(true)}
              aria-label="Editar tarea"
              title="Editar tarea"
              disabled={isBusy}
            >
              ✏️
            </button>
            <button
              type="button"
              className="task-action-btn task-action-btn-danger"
              onClick={() => setShowConfirmDelete(true)}
              aria-label="Eliminar tarea"
              title="Eliminar tarea"
              disabled={isBusy}
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
