import { useState, type SyntheticEvent } from "react";
import type { TaskCreateInput } from "../types/task.types";

export interface TodoFormProps {
  onAddTask: (task: TaskCreateInput) => Promise<string | void>;
  onSuccess?: () => void;
}

/**
 * Formulario para la creación de nuevas tareas.
 * Implementa validaciones en cliente, prevención de tareas vacías
 * y estados de carga para evitar envíos múltiples.
 */
export function TodoForm({ onAddTask, onSuccess }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Caso borde: Validación de título vacío o con solo espacios
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage("El título de la tarea es obligatorio.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onAddTask({
        title: trimmedTitle,
        description: description.trim(),
      });

      // Limpiar formulario tras éxito
      setTitle("");
      setDescription("");
      onSuccess?.();
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Ocurrió un error al intentar crear la tarea.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form" noValidate>
      {errorMessage && (
        <div className="glass-alert glass-alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span className="alert-text">{errorMessage}</span>
        </div>
      )}

      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="todo-form-title" className="form-label">
            Título de la tarea{" "}
            <span style={{ color: "var(--accent-primary)" }}>*</span>
          </label>
          <span className="char-counter">{title.length}/120</span>
        </div>
        <input
          id="todo-form-title"
          type="text"
          className="glass-input"
          placeholder="Ej. Preparar informe mensual"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          disabled={isSubmitting}
          maxLength={120}
        />
      </div>

      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="todo-form-description" className="form-label">
            Descripción o notas (Opcional)
          </label>
          {description.length > 0 && (
            <span className="char-counter">{description.length}/500</span>
          )}
        </div>
        <textarea
          id="todo-form-description"
          className="glass-textarea"
          rows={3}
          placeholder="Añade detalles, enlaces o instrucciones..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
          maxLength={500}
        />
      </div>

      <button
        type="submit"
        className="glass-button glass-button-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Guardando tarea..." : "+ Agregar Tarea"}
      </button>
    </form>
  );
}
